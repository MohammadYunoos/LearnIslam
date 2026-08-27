// src/services/translate.ts
// Runtime translation via the Edge Function (/translate → Google + DB cache).
// Micro-batches per-string requests and caches results in memory + localStorage.
import { api } from './apiClient'
import { idbGetAll, idbBulkPut } from './translationStore'

const mem = new Map<string, string>() // key `${lang}|${text}` -> translated

// ── "translating" signal (drives the loading overlay) ───────────────────────
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
  try {
    return localStorage.getItem(cacheKey(lang, text))
  } catch {
    return null
  }
}
function writeLocal(lang: string, text: string, val: string) {
  try {
    localStorage.setItem(cacheKey(lang, text), val)
  } catch {
    /* storage full — ignore */
  }
}

// Pending micro-batch state (per language).
interface Pending {
  texts: Set<string>
  resolvers: (() => void)[]
  timer: ReturnType<typeof setTimeout> | null
}
const pendings = new Map<string, Pending>()

async function flush(lang: string) {
  const p = pendings.get(lang)
  if (!p) return
  pendings.delete(lang)
  if (p.timer) clearTimeout(p.timer)
  const texts = [...p.texts]
  inc()
  try {
    const res = await api.post<{ translations: string[] }>('/translate', { texts, target: lang })
    const arr = res?.translations ?? texts
    texts.forEach((t, i) => {
      const val = arr[i] ?? t
      mem.set(`${lang}|${t}`, val)
      writeLocal(lang, t, val)
    })
  } catch {
    texts.forEach((t) => mem.set(`${lang}|${t}`, t))
  } finally {
    p.resolvers.forEach((r) => r())
    dec()
  }
}

// ── Offline bulk cache (IndexedDB) ──────────────────────────────────────────
const syncFlag = (lang: string) => `tr_sync_${TR_CACHE_VERSION}_${lang}`

// Load every cached row for a language into the in-memory map so
// cachedTranslation() resolves synchronously (instant, offline).
export async function primeFromIdb(lang: string): Promise<void> {
  if (!lang || lang === 'en') return
  const rows = await idbGetAll(lang)
  for (const [src, val] of rows) mem.set(`${lang}|${src}`, val)
  if (rows.length) notify()
}

// One-time bulk download of all translations for a language → mem + IndexedDB.
// Guarded per cache-version so it only refetches when the version bumps.
export async function syncLang(lang: string): Promise<void> {
  if (!lang || lang === 'en') return
  try {
    if (localStorage.getItem(syncFlag(lang))) return
  } catch {
    /* ignore */
  }
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
    /* offline / failed — reads fall back to per-string fetch */
  } finally {
    dec()
  }
}

// Prime from IndexedDB (fast, offline) then background-sync from the server.
export async function ensureLang(lang: string): Promise<void> {
  await primeFromIdb(lang)
  void syncLang(lang)
}

function queue(lang: string, text: string): Promise<void> {
  let p = pendings.get(lang)
  if (!p) {
    p = { texts: new Set(), resolvers: [], timer: null }
    pendings.set(lang, p)
  }
  p.texts.add(text)
  return new Promise((resolve) => {
    p!.resolvers.push(resolve)
    if (p!.timer) clearTimeout(p!.timer)
    p!.timer = setTimeout(() => flush(lang), 50)
  })
}

// Synchronous cache read: returns the already-known translation (override,
// in-memory, or localStorage) without any network call. Returns `text` for
// English, or null when nothing is cached yet (caller should show source then
// fetch). Lets the UI paint the right text on first render — no English flash.
export function cachedTranslation(text: string, lang: string): string | null {
  if (!lang || lang === 'en' || !text.trim()) return text
  const override = OVERRIDES[lang]?.[text.trim()]
  if (override) return override
  const k = `${lang}|${text}`
  if (mem.has(k)) return mem.get(k)!
  const local = readLocal(lang, text)
  if (local != null) {
    mem.set(k, local)
    return local
  }
  return null
}

// Translate a single string (cached). Returns the source unchanged for English.
export async function translateOne(text: string, lang: string): Promise<string> {
  if (!lang || lang === 'en' || !text.trim()) return text
  const override = OVERRIDES[lang]?.[text.trim()]
  if (override) return override
  const k = `${lang}|${text}`
  if (mem.has(k)) return mem.get(k)!
  const local = readLocal(lang, text)
  if (local != null) {
    mem.set(k, local)
    return local
  }
  await queue(lang, text)
  return mem.get(k) ?? text
}

// Translate a list; resolves to an array aligned to the input.
export async function translateMany(texts: string[], lang: string): Promise<string[]> {
  if (!lang || lang === 'en') return texts
  return Promise.all(texts.map((t) => translateOne(t, lang)))
}
