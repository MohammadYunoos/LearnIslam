// src/pages/Hifz/HifzPage.tsx
import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { useAppStore } from '../../store/appStore'
import {
  getHifzSurahs,
  getHifzProgress,
  updateHifzStatus,
} from '../../services/supabaseService'

type Status = 'NotStarted' | 'InProgress' | 'Completed'

interface Surah {
  id: number
  name: string
  arabic_name?: string
  level?: string
  ayah_count?: number
  sort_order?: number
}

const STATUS_META: Record<Status, { label: string; cls: string }> = {
  NotStarted: { label: 'Not started', cls: 'bg-sand text-ink-muted' },
  InProgress: { label: 'In progress', cls: 'bg-gold/20 text-gold-dark' },
  Completed: { label: 'Completed', cls: 'bg-teal-900 text-white' },
}

const NEXT: Record<Status, Status> = {
  NotStarted: 'InProgress',
  InProgress: 'Completed',
  Completed: 'NotStarted',
}

export function HifzPage() {
  const user = useAppStore((s) => s.user)
  const isPremium = user?.tier === 'premium'
  const [surahs, setSurahs] = useState<Surah[]>([])
  const [statuses, setStatuses] = useState<Record<number, Status>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [list, progress] = await Promise.all([
        getHifzSurahs(isPremium),
        user ? getHifzProgress(user.id) : Promise.resolve([]),
      ])
      setSurahs(list as Surah[])
      const map: Record<number, Status> = {}
      for (const p of progress) map[p.surah_id] = p.status as Status
      setStatuses(map)
      setLoading(false)
    }
    load()
  }, [user, isPremium])

  const toggle = async (surahId: number) => {
    const current = statuses[surahId] ?? 'NotStarted'
    const next = NEXT[current]
    setStatuses((s) => ({ ...s, [surahId]: next }))
    if (user) await updateHifzStatus(user.id, surahId, next)
  }

  const completed = Object.values(statuses).filter((s) => s === 'Completed').length

  return (
    <div className="bg-cream min-h-screen pb-20">
      <PageHeader title="Hifz" subtitle="Surah memorisation" backTo="/home" />

      <div className="px-4 pt-4">
        <div className="bg-white border border-border rounded-2xl p-4 mb-4">
          <p className="text-sm font-semibold text-teal-900">
            {completed} surah{completed === 1 ? '' : 's'} memorised
          </p>
          <p className="text-xs text-ink-muted mt-0.5">
            Tap a surah to cycle its status: Not started → In progress → Completed
          </p>
        </div>

        {loading && <p className="text-ink-muted text-sm text-center py-8">Loading…</p>}

        <div className="space-y-3">
          {surahs.map((surah) => {
            const status = statuses[surah.id] ?? 'NotStarted'
            const meta = STATUS_META[status]
            return (
              <button
                key={surah.id}
                onClick={() => toggle(surah.id)}
                className="w-full bg-white border border-border rounded-2xl p-4 flex items-center gap-3 text-left active:scale-[0.98] transition-transform"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-teal-900">{surah.name}</p>
                  {surah.arabic_name && (
                    <p className="font-arabic text-base text-ink">{surah.arabic_name}</p>
                  )}
                  <p className="text-xs text-ink-muted">
                    {surah.level ? `${surah.level}` : ''}
                    {surah.ayah_count ? ` · ${surah.ayah_count} ayah` : ''}
                  </p>
                </div>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${meta.cls}`}>
                  {meta.label}
                </span>
              </button>
            )
          })}
        </div>

        {!isPremium && !loading && (
          <p className="text-xs text-ink-muted text-center mt-6 px-6">
            Basic surahs shown. Upgrade to premium to unlock the full Hifz list.
          </p>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
