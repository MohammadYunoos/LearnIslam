// src/pages/Analyzer/AnalyzerPage.tsx
import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { useAppStore } from '../../store/appStore'
import { getAnalyzerSummary } from '../../services/supabaseService'

interface Summary {
  hifzBasicCompleted: number
  hifzBasicTotal: number
  lessonsCompleted: number
  streakDays: number
  staleSurahId: number | null
  recentEvents: { event_type: string; created_at: string }[]
}

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="bg-white border border-border rounded-2xl p-4 text-center">
      <p className="text-2xl font-bold text-teal-900">{value}</p>
      <p className="text-xs text-ink-muted mt-1">{label}</p>
    </div>
  )
}

export function AnalyzerPage() {
  const user = useAppStore((s) => s.user)
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getAnalyzerSummary(user.id).then((s) => {
      setSummary(s)
      setLoading(false)
    })
  }, [user])

  return (
    <div className="bg-cream min-h-screen pb-20">
      <PageHeader title="Analyzer" subtitle="Your progress" backTo="/home" />

      <div className="px-4 pt-4">
        {loading && <p className="text-ink-muted text-sm text-center py-8">Loading…</p>}

        {summary && (
          <>
            {summary.staleSurahId != null && (
              <div className="bg-gold/15 border border-gold rounded-2xl p-4 mb-4 flex items-start gap-3">
                <span className="text-xl">⏰</span>
                <p className="text-sm text-gold-dark font-medium">
                  You have a surah in progress that has not been revised in 5+ days. Time for a
                  quick revision!
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mb-4">
              <Stat value={`${summary.streakDays} 🔥`} label="Day streak" />
              <Stat value={summary.lessonsCompleted} label="Lessons completed" />
              <Stat
                value={`${summary.hifzBasicCompleted}/${summary.hifzBasicTotal}`}
                label="Basic Hifz done"
              />
              <Stat value={summary.recentEvents.length} label="Recent activities" />
            </div>

            <p className="text-xs font-bold text-ink-muted uppercase tracking-widest mb-2">
              Recent activity
            </p>
            <div className="bg-white border border-border rounded-2xl divide-y divide-border">
              {summary.recentEvents.length === 0 && (
                <p className="text-sm text-ink-muted p-4 text-center">
                  No activity yet. Start a lesson!
                </p>
              )}
              {summary.recentEvents.map((e, i) => (
                <div key={i} className="flex justify-between items-center px-4 py-3">
                  <span className="text-sm text-ink capitalize">
                    {e.event_type.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs text-ink-muted">
                    {new Date(e.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
