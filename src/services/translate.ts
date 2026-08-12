// src/services/translate.ts
// Runtime translation via the Edge Function (/translate → Google + DB cache).
// Micro-batches per-string requests and caches results in memory + localStorage.
import { api } from './apiClient'

const mem = new Map<string, string>() // key `${lang}|${text}` -> translated

function cacheKey(lang: string, text: string) {
  return `tr_${lang}_${text}`
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
  }
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

// Translate a single string (cached). Returns the source unchanged for English.
export async function translateOne(text: string, lang: string): Promise<string> {
  if (!lang || lang === 'en' || !text.trim()) return text
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
