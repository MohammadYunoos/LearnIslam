// src/pages/Adaab/AdaabPage.tsx
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { GuideDisclaimer } from '../../components/GuideDisclaimer'
import { ADAAB_TOPICS, MASLAK } from '../../content/adaab'

export function AdaabPage() {
  const navigate = useNavigate()

  return (
    <div className="bg-cream min-h-screen pb-20">
      <PageHeader title="Adaab" subtitle="Etiquettes of daily life" backTo="/home" />

      <div className="px-4 pt-4">
        <GuideDisclaimer maslak={MASLAK} />

        <div className="grid grid-cols-2 gap-3">
          {ADAAB_TOPICS.map((t) => (
            <button
              key={t.slug}
              onClick={() => navigate(`/adaab/${t.slug}`)}
              className="bg-white border border-border rounded-2xl p-4 text-left active:scale-95 transition-transform"
            >
              <div className="w-9 h-9 rounded-xl bg-sand flex items-center justify-center text-lg mb-2">
                {t.icon}
              </div>
              <p className="text-sm font-bold text-teal-900">{t.title}</p>
              {t.arabic && <p className="font-arabic text-sm text-ink mt-0.5">{t.arabic}</p>}
            </button>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
