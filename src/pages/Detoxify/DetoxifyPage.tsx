// src/pages/Detoxify/DetoxifyPage.tsx
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { HEART_TOPICS, SCHOLARS, ytSearch } from '../../content/detoxify'
import { openExternal } from '../../lib/external'
import { useTr, useTrList } from '../../i18n/useTr'

export function DetoxifyPage() {
  const titles = useTrList(HEART_TOPICS.map((t) => t.title))
  const descs = useTrList(HEART_TOPICS.map((t) => t.desc))
  const tIntro = useTr(
    'Cleanse the heart from spiritual diseases — anger, jealousy, pride and more. Tap a scholar to watch their talks and shorts on each topic.'
  )
  const tFoot = useTr(
    'Links open YouTube search results for each scholar. Content is external and not produced by this app.'
  )
  return (
    <div className="bg-cream min-h-screen pb-20">
      <PageHeader title="Detoxify" subtitle="Purify the heart · Tazkiyah" backTo="/home" />

      <div className="px-4 pt-4">
        <div className="bg-white border border-border rounded-2xl p-4 mb-4">
          <p className="text-sm text-ink leading-relaxed">{tIntro}</p>
        </div>

        <div className="space-y-3">
          {HEART_TOPICS.map((t, idx) => (
            <div key={t.slug} className="bg-white border border-border rounded-2xl p-4">
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <p className="text-sm font-bold text-teal-900">{titles[idx]}</p>
                {t.arabic && <span className="font-arabic text-base text-ink">{t.arabic}</span>}
              </div>
              <p className="text-xs text-ink-muted mb-3 leading-relaxed">{descs[idx]}</p>
              <div className="flex flex-wrap gap-2">
                {SCHOLARS.map((s) => (
                  <button
                    key={s}
                    onClick={() => openExternal(ytSearch(`${s} ${t.keyword}`))}
                    className="text-[11px] font-semibold text-teal-900 bg-sand border border-border rounded-full px-3 py-1.5 active:scale-95 transition-transform"
                  >
                    ▶ {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-ink-muted text-center mt-4 px-6">{tFoot}</p>
      </div>

      <BottomNav />
    </div>
  )
}
