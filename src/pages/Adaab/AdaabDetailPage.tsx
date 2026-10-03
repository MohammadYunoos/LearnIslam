// src/pages/Adaab/AdaabDetailPage.tsx
import { useParams } from 'react-router-dom'
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
  const gender = useAppStore((s) => s.user?.gender)
  const topic = slug ? getAdaab(slug) : undefined

  const items = topic ? itemsForGender(topic.items, gender) : []
  const trItems = useTrList(items.map((i) => i.text))
  const tIntro = useTr(topic?.intro ?? '')

  if (!topic) {
    return (
      <div className="reader-page min-h-screen pb-20">
        <PageHeader title="Not found" backTo="/adaab" />
        <p className="text-sm text-ink-muted text-center py-10">Adaab not found.</p>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="reader-page min-h-screen pb-44">
      <PageHeader title={topic.title} subtitle={topic.arabic} backTo="/adaab" />

      <div className="px-4 pt-4">
        <GuideDisclaimer maslak={MASLAK} />

        {topic.intro && <p className="text-sm text-ink-muted mb-3">{tIntro}</p>}

        <div className="reader-surface rounded-lg px-4 py-2">
          <ol className="reader-divider">
            {items.map((item, i) => (
              <li key={i} className="py-4 flex gap-3">
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

      <BottomNav />
    </div>
  )
}
