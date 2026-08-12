// src/components/GuideDisclaimer.tsx
import { useTr } from '../i18n/useTr'

export function GuideDisclaimer({ maslak }: { maslak: string }) {
  const t = useTr(
    'Content is for learning and is pending final review by a qualified Alim — for a verified ruling, consult your local Alim.'
  )
  const tFollowing = useTr('Following the')
  const tMaslak = useTr('maslak.')
  return (
    <div className="bg-gold/15 border border-gold rounded-2xl p-3 mb-4 flex items-start gap-2">
      <span className="text-base leading-none mt-0.5">📌</span>
      <p className="text-[11px] text-gold-dark leading-relaxed">
        {tFollowing} <span className="font-bold">{maslak}</span> {tMaslak} {t}
      </p>
    </div>
  )
}
