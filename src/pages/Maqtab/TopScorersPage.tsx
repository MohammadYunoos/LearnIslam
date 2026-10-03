import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import {
  getExamLeaderboard,
  type ExamLeaderboardEntry,
} from '../../services/supabaseService'
import { useTrList } from '../../i18n/useTr'

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const
type Level = (typeof LEVELS)[number]

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString([], {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return iso.slice(0, 10)
  }
}

export function TopScorersPage() {
  const [level, setLevel] = useState<Level>('Beginner')
  const [entries, setEntries] = useState<ExamLeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const L = useTrList([
    'Top Scorers',
    'Exam leaderboard',
    'Loading rankings...',
    'No exam attempts for this level yet.',
    'Unable to load rankings. Please try again.',
    'Age',
    'Islam Seeko Id',
    'Attempts',
    'Best score',
    'Achieved',
  ])
  const translatedLevels = useTrList([...LEVELS])

  useEffect(() => {
    let active = true
    setLoading(true)
    setFailed(false)
    getExamLeaderboard(level)
      .then((rows) => {
        if (active) setEntries(rows ?? [])
      })
      .catch(() => {
        if (active) {
          setEntries([])
          setFailed(true)
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [level])

  return (
    <div className="maqtab-page min-h-screen pb-24">
      <PageHeader title={L[0] || 'Top Scorers'} subtitle={L[1] || 'Exam leaderboard'} backTo="/maqtab" noTranslate />

      <main className="px-4 pt-4">
        <div className="grid grid-cols-3 border border-border bg-white rounded-lg p-1 gap-1 mb-4" role="tablist" aria-label="Exam level">
          {LEVELS.map((option, index) => (
            <button
              key={option}
              type="button"
              role="tab"
              aria-selected={level === option}
              onClick={() => setLevel(option)}
              className={`min-w-0 px-2 py-2.5 rounded-md text-xs font-bold ${
                level === option ? 'bg-teal-900 text-white' : 'text-ink-muted bg-transparent'
              }`}
            >
              {translatedLevels[index] || option}
            </button>
          ))}
        </div>

        {loading && <p className="text-sm text-ink-muted text-center py-10">{L[2]}</p>}
        {!loading && failed && <p className="text-sm text-red-600 text-center py-10">{L[4]}</p>}
        {!loading && !failed && entries.length === 0 && (
          <div className="bg-white border border-border rounded-lg px-5 py-10 text-center">
            <p className="text-sm text-ink-muted">{L[3]}</p>
          </div>
        )}

        {!loading && !failed && entries.length > 0 && (
          <div className="space-y-3">
            {entries.map((entry) => (
              <article key={entry.userId} className="bg-white border border-border rounded-lg overflow-hidden shadow-sm">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-[#FFFDF7]">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold ${entry.rank <= 3 ? 'bg-gold text-teal-900' : 'bg-sand text-ink-muted'}`}>
                    #{entry.rank}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-bold text-teal-900 text-sm truncate">{entry.name}</h2>
                    <p className="text-xs text-ink-muted">{L[5]}: {entry.age ?? '-'}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-2xl font-bold text-gold-dark">{entry.percent}%</p>
                    <p className="text-[10px] text-ink-muted uppercase">{L[8]}</p>
                  </div>
                </div>
                <dl className="px-4 py-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                  <div className="col-span-2">
                    <dt className="text-ink-muted">{L[6]}</dt>
                    <dd className="font-mono text-[11px] text-ink break-all mt-0.5">{entry.userId}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-muted">{L[7]}</dt>
                    <dd className="font-bold text-ink mt-0.5">{entry.attempts}</dd>
                  </div>
                  <div className="text-right">
                    <dt className="text-ink-muted">{L[9]}</dt>
                    <dd className="font-semibold text-ink mt-0.5">{formatDate(entry.achievedAt)}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
