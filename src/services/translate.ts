// src/services/translate.ts
// Runtime translation via the Edge Function (/translate → Google + DB cache).
// Micro-batches per-string requests and caches results in memory + localStorage.
import { api } from './apiClient'
import { idbGetAll, idbBulkPut } from './translationStore'
import { curatedTranslation } from '../i18n/curatedTranslations'

const mem = new Map<string, string>() // key `${lang}|${text}` -> translated

// ── bulk-sync signal (for the loading overlay) ─────────────────────────────
let inflight = 0
const listeners = new Set<() => void>()
function notify() {
  listeners.forEach((l) => l())
}
function inc() {
  inflight++
  notify()
}
function dec() {
  inflight = Math.max(0, inflight - 1)
  notify()
}
export function isTranslating(): boolean {
  return inflight > 0
}
export function subscribeTranslating(cb: () => void): () => void {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

// Manual overrides for app-specific terms that machine translation leaves in
// English (proper nouns) or renders poorly. Keyed by language then source text.
const OVERRIDES: Record<string, Record<string, string>> = {
  ur: {
    Hifz: 'حفظ',
    Detoxify: 'تزکیۂ نفس',
    Maqtab: 'مکتب',
    Masail: 'مسائل',
    Adaab: 'آداب',
    Wajifa: 'وظیفہ',
    Tasbih: 'تسبیح',
    Qirat: 'قرأت',
    Ruku: 'رکوع',
    Salam: 'سلام',
    Muhasaba: 'محاسبہ',
  },
  hi: {
    Hifz: 'हिफ़्ज़',
    Detoxify: 'तज़्किया',
    Maqtab: 'मकतब',
    Masail: 'मसाइल',
    Adaab: 'आदाब',
    Muhasaba: 'मुहासबा',
  },
}

// Bump this whenever curated wording is bulk-seeded so existing devices drop
// their stale localStorage entries and re-fetch fresh translations.
const TR_CACHE_VERSION = 'v4'

function cacheKey(lang: string, text: string) {
  return `tr_${TR_CACHE_VERSION}_${lang}_${text}`
}

// Drop a cached translation so a freshly-curated wording shows immediately.
export function clearCached(lang: string, text: string) {
  mem.delete(`${lang}|${text}`)
  try {
    localStorage.removeItem(cacheKey(lang, text))
  } catch {
    /* ignore */
  }
}

function readLocal(lang: string, text: string): string | null {
  if (text.length > 256) return null
  try {
    return localStorage.getItem(cacheKey(lang, text))
  } catch {
    return null
  }
}



// ── Offline bulk cache (IndexedDB) ──────────────────────────────────────────
const syncFlag = (lang: string) => `tr_sync_${TR_CACHE_VERSION}_${lang}`
const syncingLanguages = new Set<string>()

// Load every cached row for a language into the in-memory map so
// cachedTranslation() resolves synchronously (instant, offline).
const primePromises = new Map<string, Promise<void>>()

export function primeFromIdb(lang: string): Promise<void> {
  if (!lang || lang === 'en') return Promise.resolve()
  const existing = primePromises.get(lang)
  if (existing) return existing
  const promise = idbGetAll(lang).then((rows) => {
    for (const [src, val] of rows) mem.set(`${lang}|${src}`, val)
  })
  primePromises.set(lang, promise)
  return promise
}

// One-time bulk download of all translations for a language → mem + IndexedDB.
// Guarded per cache-version so it only refetches when the version bumps.
export async function syncLang(lang: string): Promise<void> {
  if (!lang || lang === 'en') return
  if (syncingLanguages.has(lang)) return
  try {
    if (localStorage.getItem(syncFlag(lang))) return
  } catch {
    /* ignore */
  }
  syncingLanguages.add(lang)
  inc()
  try {
    const res = await api.get<{ rows: { source_text: string; translated_text: string }[] }>(
      `/translate/all?target=${encodeURIComponent(lang)}`
    )
    const rows = res?.rows ?? []
    for (const r of rows) {
      if (r?.source_text != null && r?.translated_text != null) {
        mem.set(`${lang}|${r.source_text}`, r.translated_text)
      }
    }
    await idbBulkPut(lang, rows)
    try {
      localStorage.setItem(syncFlag(lang), '1')
    } catch {
      /* ignore */
    }
    notify()
  } catch {
    /* offline / failed */
  } finally {
    dec()
    syncingLanguages.delete(lang)
  }
}

// Prime from IndexedDB (fast, offline) then background-sync from the server.
export async function ensureLang(lang: string): Promise<void> {
  await primeFromIdb(lang)
  void syncLang(lang)
}


// Synchronous cache read: returns the already-known translation (override,
// in-memory, or localStorage) without any network call. Returns `text` for
// English, or null when nothing is cached yet (caller should show source then
// fetch). Lets the UI paint the right text on first render — no English flash.
export function cachedTranslation(text: string, lang: string): string | null {
  if (!lang || lang === 'en' || !text.trim()) return text
  const override = OVERRIDES[lang]?.[text.trim()]
  if (override) return override
  const curated = curatedTranslation(text, lang)
  if (curated != null) return curated
  const k = `${lang}|${text}`
  if (mem.has(k)) return mem.get(k)!
  const local = readLocal(lang, text)
  if (local != null) {
    mem.set(k, local)
    return local
  }
  return null
}

