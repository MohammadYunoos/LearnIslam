// src/hooks/useNarration.ts
// Text-to-speech narration via the Web Speech API.
// Works in browsers and the Android WebView (uses the device TTS engine).
// Voice preference: female, Urdu > Hindi > Indian-English accent.
import { useCallback, useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'mymaqtab_narration_on'

// Language preference, best first.
const LANG_RANK = ['ur-pk', 'ur-in', 'ur', 'hi-in', 'hi', 'en-in', 'en-gb', 'en-au', 'en-us', 'en']

// Common female voice-name hints across Android/Windows/Chrome TTS engines.
const FEMALE_HINT =
  /female|woman|zira|heera|swara|lekha|kalpana|neerja|aditi|raveena|isha|priya|ananya|google (?:हिन्दी|اردو)|hediye|salma/i
const MALE_HINT = /male|man|ravi|hemant|madhur|prabhat/i

function ttsAvailable(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

function scoreVoice(v: SpeechSynthesisVoice): number {
  const lang = v.lang.toLowerCase().replace('_', '-')
  const base = lang.split('-')[0]
  let idx = LANG_RANK.findIndex((l) => lang === l || lang.startsWith(l + '-') || l === base)
  if (idx < 0) idx = LANG_RANK.length
  let s = (LANG_RANK.length - idx) * 10
  if (FEMALE_HINT.test(v.name)) s += 6
  else if (MALE_HINT.test(v.name)) s -= 6
  return s
}

function pickVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices.length) return null
  return [...voices].sort((a, b) => scoreVoice(b) - scoreVoice(a))[0]
}

export function useNarration() {
  const supported = ttsAvailable()
  const [enabled, setEnabled] = useState<boolean>(() => localStorage.getItem(STORAGE_KEY) === '1')
  const [speaking, setSpeaking] = useState(false)
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null)
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)

  // Voices load asynchronously — listen for voiceschanged and pick the best.
  useEffect(() => {
    if (!supported) return
    const load = () => {
      const v = pickVoice(window.speechSynthesis.getVoices())
      voiceRef.current = v
      setVoice(v)
    }
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load)
  }, [supported])

  const cancel = useCallback(() => {
    if (!supported) return
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [supported])

  const speak = useCallback(
    (text: string) => {
      if (!supported || !enabled || !text) return
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      const v = voiceRef.current
      if (v) {
        u.voice = v
        u.lang = v.lang
      } else {
        u.lang = 'hi-IN' // fall back to an Indian-accent locale
      }
      u.rate = 0.9
      u.pitch = 1.05 // slightly higher = softer/female tone on engines without a female voice
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
      if (!next && supported) window.speechSynthesis.cancel()
      return next
    })
  }, [supported])

  useEffect(() => {
    return () => {
      if (supported) window.speechSynthesis.cancel()
    }
  }, [supported])

  const voiceLabel = voice ? `${voice.name} (${voice.lang})` : 'device default'

  return { supported, enabled, speaking, speak, cancel, toggle, voiceLabel }
}
