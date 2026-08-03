// src/pages/Guide/GuideHomePage.tsx
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { GuideDisclaimer } from '../../components/GuideDisclaimer'
import { TOPICS, GROUP_LABELS, MASLAK, type GuideGroup } from '../../content/guide'

const GROUP_ORDER: GuideGroup[] = ['purity', 'salah', 'more']

export function GuideHomePage() {
  const navigate = useNavigate()

  return (
    <div className="bg-cream min-h-screen pb-20">
      <PageHeader title="My Guide" subtitle="Step-by-step Islamic practice" backTo="/home" />

      <div className="px-4 pt-4">
        <GuideDisclaimer maslak={MASLAK} />

        {GROUP_ORDER.map((group) => {
          const topics = TOPICS.filter((t) => t.group === group)
          if (topics.length === 0) return null
          return (
            <div key={group} className="mb-5">
              <p className="text-xs font-bold text-ink-muted uppercase tracking-widest mb-2">
                {GROUP_LABELS[group]}
              </p>
              <div className="space-y-3">
                {topics.map((t) => (
                  <button
                    key={t.slug}
                    onClick={() => navigate(`/guide/${t.slug}`)}
                    className="w-full bg-white border border-border rounded-2xl p-4 flex items-center gap-3 text-left active:scale-[0.98] transition-transform"
                  >
                    <div className="w-11 h-11 rounded-xl bg-sand flex items-center justify-center text-xl shrink-0">
                      {t.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-teal-900">{t.title}</p>
                      <p className="text-xs text-ink-muted">
                        {t.hasSteps ? 'Sections + step-by-step animation' : 'Sections'}
                      </p>
                    </div>
                    {t.arabic && <span className="font-arabic text-lg text-ink">{t.arabic}</span>}
                    <span className="text-gold-dark text-lg">›</span>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <BottomNav />
    </div>
  )
}
