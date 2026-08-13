// src/pages/Hifz/HifzPage.tsx
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { SURAHS } from '../../content/surahs'
import { getStatus, getMemorised, type HifzStatus } from '../../services/hifzLocal'
import { useTr, useTrList } from '../../i18n/useTr'

const STATUS_META: Record<HifzStatus, { label: string; cls: string }> = {
  NotStarted: { label: 'Not started', cls: 'bg-sand text-ink-muted' },
  InProgress: { label: 'In progress', cls: 'bg-gold/20 text-gold-dark' },
  Completed: { label: 'Completed', cls: 'bg-teal-900 text-white' },
}

export function HifzPage() {
  const navigate = useNavigate()
  const surahs = [...SURAHS].sort((a, b) => a.number - b.number)
  const completed = SURAHS.filter((s) => getStatus(s.slug) === 'Completed').length
  const meanings = useTrList(surahs.map((s) => s.meaning))
  const statusLabels = useTrList(['Not started', 'In progress', 'Completed'])
  const statusT: Record<string, string> = {
    'Not started': statusLabels[0],
    'In progress': statusLabels[1],
    Completed: statusLabels[2],
  }
  const tSurahsMemorised = useTr('surahs memorised')
  const tAyah = useTr('ayah')

  return (
    <div className="bg-cream min-h-screen pb-20 page-fade">
      <PageHeader title="Hifz" subtitle="Listen · learn · memorise" backTo="/home" />

      <div className="px-4 pt-4">
        <div className="bg-white border border-border rounded-2xl p-4 mb-4">
          <p className="text-sm font-semibold text-teal-900">
            {Math.round((completed / SURAHS.length) * 100)}% · {completed} / {SURAHS.length}{' '}
            {tSurahsMemorised}
          </p>
          <div className="h-2 bg-sand rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-gold rounded-full transition-all"
              style={{ width: `${(completed / SURAHS.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          {surahs.map((s, idx) => {
            const status = getStatus(s.slug)
            const meta = STATUS_META[status]
            const memo = getMemorised(s.slug).length
            return (
              <button
                key={s.slug}
                onClick={() => navigate(`/hifz/${s.slug}`)}
                style={{ animationDelay: `${idx * 90}ms` }}
                className="tile-in glossy-gold w-full rounded-2xl p-4 flex items-center gap-3 text-left shadow-md active:scale-[0.98] transition-transform"
              >
                <div className="w-11 h-11 rounded-xl bg-teal-900/10 flex items-center justify-center shrink-0">
                  <span className="font-arabic text-lg text-teal-900">{s.arabicName}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-teal-900">{s.name}</p>
                  <p className="text-xs text-teal-900/70">
                    {meanings[idx]} · {s.ayahs.length} {tAyah}
                    {memo > 0 ? ` · ${memo}/${s.ayahs.length}` : ''}
                  </p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${meta.cls}`}>
                  {statusT[meta.label] ?? meta.label}
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
