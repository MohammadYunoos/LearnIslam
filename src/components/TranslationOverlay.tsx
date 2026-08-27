// src/components/TranslationOverlay.tsx
// While Roman-Urdu / Urdu translations are loading (first-time bulk sync or a
// batch fetch), show a small spinner and block taps so the user doesn't act on
// half-loaded text. Auto-hides once translations are ready (usually sub-second).
import { useLang, useTranslating } from '../i18n/useTr'

export function TranslationOverlay() {
  const lang = useLang()
  const busy = useTranslating()
  if (lang === 'en' || !busy) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/10 cursor-wait">
      <div className="mt-24 flex items-center gap-2 rounded-full bg-teal-900 text-white px-4 py-2 shadow-lg">
        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        <span className="text-xs font-bold">Loading…</span>
      </div>
    </div>
  )
}
