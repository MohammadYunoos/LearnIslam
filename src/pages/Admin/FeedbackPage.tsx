// src/pages/Admin/FeedbackPage.tsx
import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { getFeedback } from '../../services/supabaseService'
import { isAdmin } from '../../lib/admin'

interface Feedback {
  id: string
  user_name?: string
  screen?: string
  message: string
  status?: string
  created_at: string
}

export function FeedbackPage() {
  const [allowed, setAllowed] = useState<boolean | null>(null)
  const [items, setItems] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    isAdmin().then((ok) => {
      setAllowed(ok)
      if (ok) getFeedback().then((d) => setItems((d ?? []) as Feedback[])).finally(() => setLoading(false))
      else setLoading(false)
    })
  }, [])

  return (
    <div className="bg-cream min-h-screen pb-20">
      <PageHeader title="Feedback" subtitle="Ulema / tester review" backTo="/settings" />

      <div className="px-4 pt-4">
        {allowed === false && (
          <p className="text-sm text-ink-muted text-center py-10">Not authorized.</p>
        )}
        {allowed && loading && (
          <p className="text-sm text-ink-muted text-center py-8">Loading…</p>
        )}
        {allowed && !loading && items.length === 0 && (
          <p className="text-sm text-ink-muted text-center py-8">No feedback yet.</p>
        )}
        {allowed && (
          <div className="space-y-3">
            {items.map((f) => (
              <div key={f.id} className="bg-white border border-border rounded-2xl p-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-teal-900">{f.user_name ?? 'Anonymous'}</span>
                  <span className="text-[11px] text-ink-muted">
                    {new Date(f.created_at).toLocaleDateString()}
                  </span>
                </div>
                {f.screen && (
                  <p className="text-[10px] text-gold-dark font-semibold mb-1">{f.screen}</p>
                )}
                <p className="text-sm text-ink leading-relaxed">{f.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
