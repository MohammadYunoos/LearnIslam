// src/pages/Wajifa/TasbihPage.tsx
// Zikr counter — tap to count, target ring, local persistence (no auth needed).
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { getZikr } from '../../content/masnoon'
import { useTr } from '../../i18n/useTr'

const key = (slug: string) => `mymaqtab_zikr_count_${slug}`

export function TasbihPage() {
  const { slug } = useParams()
  const zikr = slug ? getZikr(slug) : undefined
  const [count, setCount] = useState<number>(() => {
    const raw = slug ? localStorage.getItem(key(slug)) : null
    return raw ? parseInt(raw, 10) || 0 : 0
  })
  const tMeaning = useTr(zikr?.meaning ?? '')
  const tRef = useTr(zikr?.ref ?? '')

  if (!zikr) {
    return (
      <div className="bg-cream min-h-screen">
        <PageHeader title="Zikr" backTo="/wajifa" />
        <p className="text-sm text-ink-muted text-center py-10">Zikr not found.</p>
        <BottomNav />
      </div>
    )
  }

  const target = zikr.target || 33
  const persist = (n: number) => {
    if (slug) localStorage.setItem(key(slug), String(n))
  }
  const increment = () => setCount((c) => { const n = c + 1; persist(n); return n })
  const reset = () => { setCount(0); persist(0) }

  const inRound = count % target
  const rounds = Math.floor(count / target)
  const progress = target ? inRound / target : 0
  const circ = 2 * Math.PI * 52

  return (
    <div className="bg-cream min-h-screen pb-20">
      <PageHeader title={zikr.title} subtitle="Tap the circle to count" backTo="/wajifa" />

      <div className="px-4 pt-4">
        {/* Zikr text */}
        <div className="bg-white border border-border rounded-2xl p-4 mb-4 text-center">
          <p className="font-arabic text-2xl text-teal-900 leading-loose mb-2">{zikr.arabic}</p>
          <p className="text-sm italic text-gold-dark mb-1">{zikr.translit}</p>
          <p className="text-sm text-ink">{tMeaning}</p>
          {zikr.ref && (
            <p className="text-[11px] text-ink-muted mt-3 pt-3 border-t border-border leading-relaxed">
              📖 {tRef}
            </p>
          )}
        </div>

        {/* Counter ring */}
        <div className="flex flex-col items-center">
          <button
            onClick={increment}
            className="relative w-64 h-64 active:scale-95 transition-transform"
            aria-label="Increment count"
          >
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#F3ECD9" strokeWidth="10" />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="#C8962C"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={circ * (1 - progress)}
                className="transition-all"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-teal-900">{count}</span>
              <span className="text-xs text-ink-muted mt-1">tap to count</span>
            </div>
          </button>

          <p className="text-sm text-ink-muted mt-6">
            {inRound} / {target} this round · {rounds} round{rounds === 1 ? '' : 's'} done
          </p>

          <button
            onClick={reset}
            className="mt-6 bg-white border border-border text-ink-muted font-semibold rounded-xl py-2.5 px-8 text-sm"
          >
            Reset
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
