// src/i18n/useTr.tsx
// Translation helpers driven by the user's chosen language.
import { useEffect, useState } from 'react'
import { useAppStore } from '../store/appStore'
import {
  cachedTranslation,
  isTranslating,
  subscribeTranslating,
} from '../services/translate'

export function useLang(): string {
  return useAppStore((s) => s.user?.language ?? 'en')
}

// True while a bulk sync or a batch of translations is in flight — drives the
// loading overlay so we can block taps until Roman-Urdu text is ready.
export function useTranslating(): boolean {
  const [on, setOn] = useState(isTranslating())
  useEffect(() => subscribeTranslating(() => setOn(isTranslating())), [])
  return on
}


// Translate a single string. English is shown as-is; other languages show the
// cached value if available, else the source text as fallback.
export function useTr(text: string): string {
  const lang = useLang()
  const [out, setOut] = useState(() => {
    if (!lang || lang === 'en') return text
    return cachedTranslation(text, lang) ?? text
  })
  useEffect(() => {
    if (!lang || lang === 'en') {
      setOut(text)
      return
    }
    const cached = cachedTranslation(text, lang)
    setOut(cached ?? text)
  }, [text, lang])
  return out
}

// Translate an array of strings in one batch.
export function useTrList(texts: string[]): string[] {
  const lang = useLang()
  const key = texts.join('')
  const [out, setOut] = useState(() => {
    if (!lang || lang === 'en') return texts
    return texts.map((t) => cachedTranslation(t, lang) ?? t)
  })
  useEffect(() => {
    if (!lang || lang === 'en') {
      setOut(texts)
      return
    }
    setOut(texts.map((t) => cachedTranslation(t, lang) ?? t))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, lang])
  return out
}

export function Tr({ children }: { children: string }): string {
  return useTr(children)
}
