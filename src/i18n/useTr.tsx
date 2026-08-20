// src/i18n/useTr.tsx
// Translation helpers driven by the user's chosen language.
import { useEffect, useState } from 'react'
import { useAppStore } from '../store/appStore'
import { translateMany, translateOne, cachedTranslation } from '../services/translate'

export function useLang(): string {
  return useAppStore((s) => s.user?.language ?? 'en')
}

// Initial value for a non-English string: the cached translation if we have it,
// otherwise '' so the English source is NEVER flashed to a translated-language
// user (the element stays blank for a moment, then fills once MT resolves).
function initialFor(text: string, lang: string): string {
  if (!lang || lang === 'en') return text
  return cachedTranslation(text, lang) ?? ''
}

// Translate a single string. English is shown as-is; other languages show the
// cached value immediately, else blank until the translation arrives.
export function useTr(text: string): string {
  const lang = useLang()
  const [out, setOut] = useState(() => initialFor(text, lang))
  useEffect(() => {
    let alive = true
    if (!lang || lang === 'en') {
      setOut(text)
      return
    }
    const cached = cachedTranslation(text, lang)
    setOut(cached ?? '') // blank, not English, while fetching
    if (cached == null) {
      translateOne(text, lang).then((v) => {
        if (alive) setOut(v)
      })
    }
    return () => {
      alive = false
    }
  }, [text, lang])
  return out
}

// Translate an array of strings in one batch.
export function useTrList(texts: string[]): string[] {
  const lang = useLang()
  const key = texts.join('')
  const [out, setOut] = useState(() => texts.map((t) => initialFor(t, lang)))
  useEffect(() => {
    let alive = true
    if (!lang || lang === 'en') {
      setOut(texts)
      return
    }
    // Show cached values immediately; blank (not English) for the rest until MT.
    const cached = texts.map((t) => cachedTranslation(t, lang))
    setOut(cached.map((c) => c ?? ''))
    if (cached.some((c) => c == null)) {
      translateMany(texts, lang).then((v) => {
        if (alive) setOut(v)
      })
    }
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, lang])
  return out
}

export function Tr({ children }: { children: string }): string {
  return useTr(children)
}
