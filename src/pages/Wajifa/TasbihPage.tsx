// src/pages/Wajifa/TasbihPage.tsx
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { useAppStore } from '../../store/appStore'
import { getTasbihProgress, saveTasbihCount } from '../../services/supabaseService'

const TARGET = 33

export function TasbihPage() {
  const { slug } = useParams()
  const wajifaId = Number(slug)
  const user = useAppStore((s) => s.user)
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!user || Number.isNaN(wajifaId)) {
      setLoading(false)
      return
    }
    getTasbihProgress(user.id).then((rows) => {
      const row = rows.find((r) => r.wajifa_id === wajifaId)
      if (row) setCount(row.current_count ?? 0)
      setLoading(false)
    })
  }, [user, wajifaId])

  // Debounced save so we don't hit Supabase on every single tap
  const persist = (next: number) => {
    if (!user || Number.isNaN(wajifaId)) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      saveTasbihCount(user.id, wajifaId, next)
    }, 600)
  }

  const increment = () => {
    setCount((c) => {
      const next = c + 1
      persist(next)
      return next
    })
  }

  const reset = () => {
    setCount(0)
    persist(0)
  }

  const ringProgress = Math.min(1, (count % TARGET) / TARGET)
  const circumference = 2 * Math.PI * 52

  return (
    <div className="bg-cream min-h-screen pb-20">
      <PageHeader title="Tasbih" subtitle="Tap the circle to count" backTo="/wajifa" />

      <div className="px-4 pt-8 flex flex-col items-center">
        {loading ? (
          <p className="text-ink-muted text-sm py-8">Loading…</p>
        ) : (
          <>
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
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - ringProgress)}
                  className="transition-all"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold text-teal-900">{count}</span>
                <span className="text-xs text-ink-muted mt-1">tap to count</span>
              </div>
            </button>

            <p className="text-sm text-ink-muted mt-6">
              {count % TARGET} / {TARGET} in this round · {Math.floor(count / TARGET)} rounds done
            </p>

            <button
              onClick={reset}
              className="mt-6 bg-white border border-border text-ink-muted font-semibold rounded-xl py-2.5 px-8 text-sm"
            >
              Reset
            </button>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
