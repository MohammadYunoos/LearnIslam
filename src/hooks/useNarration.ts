// src/hooks/useNarration.ts
// Narration: native Android/iOS TTS via Capacitor (reliable), Web Speech API on
// the web. Reads in the user's chosen language.
import { useCallback, useEffect, useRef, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { TextToSpeech } from '@capacitor-community/text-to-speech'
import { useAppStore } from '../store/appStore'

const STORAGE_KEY = 'mymaqtab_narration_on'
const NATIVE = Capacitor.isNativePlatform()

// Map app language → a TTS locale.
const LOCALE: Record<string, string> = {
  en: 'en-US',
  ur: 'ur-PK',
  hi: 'hi-IN',
  bn: 'bn-IN',
  ms: 'ms-MY',
  id: 'id-ID',
}

// Web voice fallback ranking (when not native).
const LANG_RANK = ['ur-pk', 'ur', 'hi-in', 'hi', 'en-in', 'en-us', 'en']
const FEMALE_HINT = /female|woman|zira|heera|swara|lekha|neerja|aditi|raveena|priya|salma/i

function webVoice(): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) return null
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return null
  const score = (v: SpeechSynthesisVoice) => {
    const lang = v.lang.toLowerCase().replace('_', '-')
    let idx = LANG_RANK.findIndex((l) => lang === l || lang.startsWith(l + '-') || l === lang.split('-')[0])
    if (idx < 0) idx = LANG_RANK.length
    return (LANG_RANK.length - idx) * 10 + (FEMALE_HINT.test(v.name) ? 5 : 0)
  }
  return [...voices].sort((a, b) => score(b) - score(a))[0] ?? null
}

export function useNarration() {
  const language = useAppStore((s) => s.user?.language ?? 'en')
  const locale = LOCALE[language] ?? 'en-US'
  const supported = NATIVE || (typeof window !== 'undefined' && 'speechSynthesis' in window)
  const [enabled, setEnabled] = useState<boolean>(() => localStorage.getItem(STORAGE_KEY) === '1')
  const [speaking, setSpeaking] = useState(false)
  const localeRef = useRef(locale)
  localeRef.current = locale

  const cancel = useCallback(() => {
    if (NATIVE) TextToSpeech.stop().catch(() => {})
    else if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [])

  const speak = useCallback(
    (text: string) => {
      if (!supported || !enabled || !text) return
      if (NATIVE) {
        TextToSpeech.stop().catch(() => {})
        setSpeaking(true)
        TextToSpeech.speak({ text, lang: localeRef.current, rate: 1.0 })
          .then(() => setSpeaking(false))
          .catch(() => setSpeaking(false))
        return
      }
      // Web
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      const v = webVoice()
      if (v) u.voice = v
      u.lang = v?.lang ?? localeRef.current
      u.rate = 0.95
      u.onstart = () => setSpeaking(true)
      u.onend = () => setSpeaking(false)
      u.onerror = () => setSpeaking(false)
      window.speechSynthesis.speak(u)
    },
    [supported, enabled]
  )

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev
      localStorage.setItem(STORAGE_KEY, next ? '1' : '0')
      if (!next) cancel()
      return next
    })
  }, [cancel])

  useEffect(() => {
    return () => {
      if (NATIVE) TextToSpeech.stop().catch(() => {})
      else if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    }
  }, [])

  const voiceLabel = NATIVE ? `device (${locale})` : (webVoice()?.name ?? 'device default')

  return { supported, enabled, speaking, speak, cancel, toggle, voiceLabel }
}
