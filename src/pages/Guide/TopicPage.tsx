// src/pages/Guide/TopicPage.tsx
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { GuideDisclaimer } from '../../components/GuideDisclaimer'
import { getTopic, itemsForGender, type Reference } from '../../content/guide'
import { useAppStore } from '../../store/appStore'

function Refs({ refs }: { refs?: Reference[] }) {
  if (!refs || refs.length === 0) return null
  return (
    <div className="flex flex-wrap gap-1.5 mt-1.5">
      {refs.map((r, i) => (
        <span
          key={i}
          className="text-[10px] font-semibold text-teal-700 bg-teal-500/10 border border-teal-500/20 rounded-full px-2 py-0.5"
        >
          {r.source}
        </span>
      ))}
    </div>
  )
}

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
          {sections.map((section) => {
            const isOpen = open === section.key
            return (
              <div key={section.key} className="bg-white border border-border rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : section.key)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                >
                  <span className="text-sm font-bold text-teal-900">{section.title}</span>
                  <span className={`text-gold-dark transition-transform ${isOpen ? 'rotate-90' : ''}`}>
                    ›
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-3">
                    {section.items.length === 0 ? (
                      <p className="text-xs text-ink-muted italic">Content coming soon, In sha Allah.</p>
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
                                {item.text}
                              </p>
                              <Refs refs={item.refs} />
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
            ▶ Play step-by-step
          </button>
        )}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() =>
              navigate(
                `/masail?q=${encodeURIComponent(
                  `According to Hanafi fiqh, regarding ${topic.title}: `
                )}`
              )
            }
            className="flex items-center justify-center gap-1.5 bg-gold text-teal-900 text-xs font-bold rounded-xl py-2.5"
          >
            🤖 Ask Masail AI
          </button>
          <button
            onClick={() => navigate('/ulema')}
            className="flex items-center justify-center gap-1.5 bg-white border border-teal-700 text-teal-900 text-xs font-bold rounded-xl py-2.5"
          >
            🕌 Connect Ulema
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
