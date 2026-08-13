// src/pages/Guide/GuideHomePage.tsx
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { GuideDisclaimer } from '../../components/GuideDisclaimer'
import { TOPICS, GROUP_LABELS, MASLAK, type GuideGroup } from '../../content/guide'
import { useTr, useTrList } from '../../i18n/useTr'

const GROUP_ORDER: GuideGroup[] = ['purity', 'salah', 'more']

export function GuideHomePage() {
  const navigate = useNavigate()
  const titles = useTrList(TOPICS.map((t) => t.title))
  const titleFor = (slug: string) => titles[TOPICS.findIndex((t) => t.slug === slug)]
  const tSections = useTr('Sections')
  const tSectionsSteps = useTr('Sections + step-by-step animation')
  const gLabels = useTrList(GROUP_ORDER.map((g) => GROUP_LABELS[g]))

  return (
    <div className="bg-cream min-h-screen pb-20 page-fade">
      <PageHeader title="Masail" subtitle="Step-by-step Islamic practice" backTo="/home" />

      <div className="px-4 pt-4">
        <GuideDisclaimer maslak={MASLAK} />

        {GROUP_ORDER.map((group, gi) => {
          const topics = TOPICS.filter((t) => t.group === group)
          if (topics.length === 0) return null
          return (
            <div key={group} className="mb-5">
              <p className="text-xs font-bold text-ink-muted uppercase tracking-widest mb-2">
                {gLabels[gi]}
              </p>
              <div className="space-y-3">
                {topics.map((t, ti) => (
                  <button
                    key={t.slug}
                    onClick={() => navigate(`/guide/${t.slug}`)}
                    style={{ animationDelay: `${ti * 50}ms` }}
                    className="tile-in glossy-gold w-full rounded-2xl p-4 flex items-center gap-3 text-left shadow-md active:scale-[0.98] transition-transform"
                  >
                    <div className="w-11 h-11 rounded-xl bg-teal-900/10 flex items-center justify-center text-xl shrink-0">
                      {t.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-teal-900">{titleFor(t.slug)}</p>
                      <p className="text-xs text-teal-900/70">
                        {t.hasSteps ? tSectionsSteps : tSections}
                      </p>
                    </div>
                    {t.arabic && <span className="font-arabic text-lg text-teal-900">{t.arabic}</span>}
                    <span className="text-teal-900/70 text-lg">›</span>
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
