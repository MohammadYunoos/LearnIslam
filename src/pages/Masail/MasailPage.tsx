// src/pages/Masail/MasailPage.tsx
// Ask Ulema — send your masail (questions) to scholars. Feature in progress.
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { useTr } from '../../i18n/useTr'

export function MasailPage() {
  const tProg = useTr('In progress')
  const tHead = useTr('Ask your Masail to the Ulema')
  const tBody = useTr(
    'Soon you will be able to send your questions (masail) directly to qualified Ulema and receive verified answers, In sha Allah. This feature is being built.'
  )
  const tFoot = useTr('For now, please consult your local Alim for rulings.')
  return (
    <div className="bg-cream min-h-screen pb-20">
      <PageHeader title="Ask Ulema" subtitle="Send your masail to scholars" backTo="/home" />

      <div className="px-4 pt-4">
        <div className="bg-white border border-border rounded-2xl p-6 text-center">
          <p className="text-5xl mb-3">🕌</p>
          <span className="inline-block text-xs font-bold text-gold-dark bg-gold/15 border border-gold rounded-full px-3 py-1 mb-4">
            {tProg}
          </span>
          <h3 className="text-base font-bold text-teal-900 mb-2">{tHead}</h3>
          <p className="text-sm text-ink-muted leading-relaxed">{tBody}</p>
        </div>

        <p className="text-[11px] text-ink-muted text-center mt-4 px-6">{tFoot}</p>
      </div>

      <BottomNav />
    </div>
  )
}
