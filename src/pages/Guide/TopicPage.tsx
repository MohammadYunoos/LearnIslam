// src/pages/Guide/TopicPage.tsx
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { GuideDisclaimer } from '../../components/GuideDisclaimer'
import { getTopic, itemsForGender } from '../../content/guide'
import { useAppStore } from '../../store/appStore'
import { useTr, useTrList } from '../../i18n/useTr'
import { RefChips } from '../../components/RefChips'

export function TopicPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const gender = useAppStore((s) => s.user?.gender)
  const topic = slug ? getTopic(slug) : undefined
  // Sections with all gender-specific items filtered to the user's gender; drop empties.
  const sections = (topic?.sections ?? [])
    .map((s) => ({ ...s, items: itemsForGender(s.items, gender) }))
    .filter((s) => s.items.length > 0)
  const [open, setOpen] = useState<string | null>(topic?.sections[0]?.key ?? null)

  const sectionTitles = useTrList(sections.map((s) => s.title))
  const itemTexts = sections.flatMap((s) => s.items.map((i) => i.text))
  const trItems = useTrList(itemTexts)
  const trMap = new Map(itemTexts.map((t, i) => [t, trItems[i]]))
  const tPlay = useTr('Play step-by-step')
  const tAsk = useTr('Ask Ulema')
  const tComing = useTr('Content coming soon, In sha Allah.')

  if (!topic) {
    return (
      <div className="bg-cream min-h-screen pb-20">
        <PageHeader title="Not found" backTo="/guide" />
        <p className="text-sm text-ink-muted text-center py-10">Topic not found.</p>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="bg-cream min-h-screen pb-44">
      <PageHeader title={topic.title} subtitle={topic.arabic} backTo="/guide" />

      <div className="px-4 pt-4">
        <GuideDisclaimer maslak={topic.maslak} />

        <div className="space-y-3">
          {sections.map((section, si) => {
            const isOpen = open === section.key
            return (
              <div key={section.key} className="bg-white border border-border rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : section.key)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                >
                  <span className="text-sm font-bold text-teal-900">{sectionTitles[si]}</span>
                  <span className={`text-gold-dark transition-transform ${isOpen ? 'rotate-90' : ''}`}>
                    ›
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-3">
                    {section.items.length === 0 ? (
                      <p className="text-xs text-ink-muted italic">{tComing}</p>
                    ) : (
                      <ol className="space-y-2.5">
                        {section.items.map((item, i) => (
                          <li key={i} className="flex gap-2.5">
                            <span className="text-xs font-bold text-gold-dark mt-0.5">{i + 1}.</span>
                            <div className="flex-1">
                              <p className="text-sm text-ink leading-relaxed">
                                {item.gender && (
                                  <span className="text-[10px] font-bold text-gold-dark mr-1.5">
                                    {item.gender === 'female' ? '♀ Women' : '♂ Men'}
                                  </span>
                                )}
                                {trMap.get(item.text) ?? item.text}
                              </p>
                              <RefChips refs={item.refs} />
                            </div>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Always-visible action bar (no scrolling needed) */}
      <div className="fixed bottom-16 left-0 right-0 max-w-lg mx-auto bg-cream border-t border-border p-3 space-y-2">
        {topic.hasSteps && topic.steps && topic.steps.length > 0 && (
          <button
            onClick={() => navigate(`/guide/${topic.slug}/steps`)}
            className="w-full bg-teal-900 text-white font-bold rounded-xl py-2.5 text-sm"
          >
            ▶ {tPlay}
          </button>
        )}
        <button
          onClick={() => navigate('/masail')}
          className="w-full flex items-center justify-center gap-1.5 bg-teal-900 text-white text-sm font-bold rounded-xl py-2.5"
        >
          🕌 {tAsk}
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
