// src/i18n/useTr.tsx
// Translation helpers driven by the user's chosen language.
import { useEffect, useState } from 'react'
import { useAppStore } from '../store/appStore'
import { translateMany, translateOne } from '../services/translate'

export function useLang(): string {
  return useAppStore((s) => s.user?.language ?? 'en')
}

// Translate a single string (English until ready; unchanged for lang 'en').
export function useTr(text: string): string {
  const lang = useLang()
  const [out, setOut] = useState(text)
  useEffect(() => {
    let alive = true
    if (!lang || lang === 'en') {
      setOut(text)
      return
    }
    translateOne(text, lang).then((v) => {
      if (alive) setOut(v)
    })
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
  const [out, setOut] = useState(texts)
  useEffect(() => {
    let alive = true
    if (!lang || lang === 'en') {
      setOut(texts)
      return
    }
    translateMany(texts, lang).then((v) => {
      if (alive) setOut(v)
    })
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
