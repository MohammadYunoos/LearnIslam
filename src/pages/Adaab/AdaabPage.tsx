// src/pages/Adaab/AdaabPage.tsx
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { GuideDisclaimer } from '../../components/GuideDisclaimer'
import { ADAAB_TOPICS, MASLAK } from '../../content/adaab'
import { useTrList } from '../../i18n/useTr'

export function AdaabPage() {
  const navigate = useNavigate()
  const titles = useTrList(ADAAB_TOPICS.map((t) => t.title))

  return (
    <div className="bg-cream min-h-screen pb-20 page-fade">
      <PageHeader title="Adaab" subtitle="Etiquettes of daily life" backTo="/home" />

      <div className="px-4 pt-4">
        <GuideDisclaimer maslak={MASLAK} />

        <div className="grid grid-cols-2 gap-3">
          {ADAAB_TOPICS.map((t, idx) => (
            <button
              key={t.slug}
              onClick={() => navigate(`/adaab/${t.slug}`)}
              style={{ animationDelay: `${idx * 40}ms` }}
              className="tile-in glossy-gold rounded-2xl p-4 text-left shadow-md active:scale-95 transition-transform"
            >
              <div className="w-9 h-9 rounded-xl bg-teal-900/10 flex items-center justify-center text-lg mb-2">
                {t.icon}
              </div>
              <p className="text-sm font-bold text-teal-900">{titles[idx]}</p>
              {t.arabic && <p className="font-arabic text-sm text-teal-900/70 mt-0.5">{t.arabic}</p>}
            </button>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
