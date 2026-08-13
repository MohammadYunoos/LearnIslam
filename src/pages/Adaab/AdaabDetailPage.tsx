// src/pages/Adaab/AdaabDetailPage.tsx
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { GuideDisclaimer } from '../../components/GuideDisclaimer'
import { RefChips } from '../../components/RefChips'
import { getAdaab, MASLAK } from '../../content/adaab'
import { itemsForGender } from '../../content/guide'
import { useAppStore } from '../../store/appStore'
import { useTr, useTrList } from '../../i18n/useTr'

export function AdaabDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const gender = useAppStore((s) => s.user?.gender)
  const topic = slug ? getAdaab(slug) : undefined

  const items = topic ? itemsForGender(topic.items, gender) : []
  const trItems = useTrList(items.map((i) => i.text))
  const tIntro = useTr(topic?.intro ?? '')
  const tAsk = useTr('Ask Ulema')

  if (!topic) {
    return (
      <div className="bg-cream min-h-screen pb-20">
        <PageHeader title="Not found" backTo="/adaab" />
        <p className="text-sm text-ink-muted text-center py-10">Adaab not found.</p>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="bg-cream min-h-screen pb-44">
      <PageHeader title={topic.title} subtitle={topic.arabic} backTo="/adaab" />

      <div className="px-4 pt-4">
        <GuideDisclaimer maslak={MASLAK} />

        {topic.intro && <p className="text-sm text-ink-muted mb-3">{tIntro}</p>}

        <div className="bg-white border border-border rounded-2xl p-4">
          <ol className="space-y-3">
            {items.map((item, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="text-xs font-bold text-gold-dark mt-0.5">{i + 1}.</span>
                <div className="flex-1">
                  <p className="text-sm text-ink leading-relaxed">
                    {item.gender && (
                      <span className="text-[10px] font-bold text-gold-dark mr-1.5">
                        {item.gender === 'female' ? '♀ Women' : '♂ Men'}
                      </span>
                    )}
                    {trItems[i] ?? item.text}
                  </p>
                  <RefChips refs={item.refs} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Always-visible action bar */}
      <div className="fixed bottom-bar left-0 right-0 max-w-lg mx-auto bg-cream border-t border-border p-3">
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
