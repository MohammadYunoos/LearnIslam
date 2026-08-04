// src/pages/Hifz/HifzPage.tsx
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { SURAHS } from '../../content/surahs'
import { getStatus, getMemorised, type HifzStatus } from '../../services/hifzLocal'

const STATUS_META: Record<HifzStatus, { label: string; cls: string }> = {
  NotStarted: { label: 'Not started', cls: 'bg-sand text-ink-muted' },
  InProgress: { label: 'In progress', cls: 'bg-gold/20 text-gold-dark' },
  Completed: { label: 'Completed', cls: 'bg-teal-900 text-white' },
}

export function HifzPage() {
  const navigate = useNavigate()
  const completed = SURAHS.filter((s) => getStatus(s.slug) === 'Completed').length

  return (
    <div className="bg-cream min-h-screen pb-20">
      <PageHeader title="Hifz" subtitle="Listen · learn · memorise" backTo="/home" />

      <div className="px-4 pt-4">
        <div className="bg-white border border-border rounded-2xl p-4 mb-4">
          <p className="text-sm font-semibold text-teal-900">
            {completed} of {SURAHS.length} surahs memorised
          </p>
          <div className="h-2 bg-sand rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-gold rounded-full transition-all"
              style={{ width: `${(completed / SURAHS.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          {SURAHS.map((s) => {
            const status = getStatus(s.slug)
            const meta = STATUS_META[status]
            const memo = getMemorised(s.slug).length
            return (
              <button
                key={s.slug}
                onClick={() => navigate(`/hifz/${s.slug}`)}
                className="w-full bg-white border border-border rounded-2xl p-4 flex items-center gap-3 text-left active:scale-[0.98] transition-transform"
              >
                <div className="w-11 h-11 rounded-xl bg-sand flex items-center justify-center shrink-0">
                  <span className="font-arabic text-lg text-teal-900">{s.arabicName}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-teal-900">{s.name}</p>
                  <p className="text-xs text-ink-muted">
                    {s.meaning} · {s.ayahs.length} ayah
                    {memo > 0 ? ` · ${memo}/${s.ayahs.length} memorised` : ''}
                  </p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${meta.cls}`}>
                  {meta.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
