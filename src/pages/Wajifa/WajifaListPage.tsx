// src/pages/Wajifa/WajifaListPage.tsx
// Masnoon Dua & Zikr — two parts: masnoon duas (read) and zikr (counter).
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { MASNOON_DUAS, ZIKR } from '../../content/masnoon'
import { useTr, useTrList } from '../../i18n/useTr'

export function WajifaListPage() {
  const navigate = useNavigate()
  const [tab, setTabState] = useState<'duas' | 'zikr'>(
    () => (localStorage.getItem('mymaqtab_wajifa_tab') as 'duas' | 'zikr') || 'duas'
  )
  const setTab = (t: 'duas' | 'zikr') => {
    localStorage.setItem('mymaqtab_wajifa_tab', t)
    setTabState(t)
  }
  const duaTitles = useTrList(MASNOON_DUAS.map((d) => d.title))
  const duaMeanings = useTrList(MASNOON_DUAS.map((d) => d.meaning))
  const zikrTitles = useTrList(ZIKR.map((z) => z.title))
  const tDuasTab = useTr('Masnoon Duas')
  const tZikrTab = useTr('Zikr & Wajifa')
  const tHint = useTr('Tap any zikr to open the counter for your daily wird.')

  return (
    <div className="bg-cream min-h-screen pb-20 page-fade">
      <PageHeader title="Masnoon Dua & Zikr" subtitle="Duas · Kalimas · Tasbih" backTo="/home" />

      <div className="px-4 pt-4">
        {/* Tabs */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {(['duas', 'zikr'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-xl py-2.5 text-sm font-bold border ${
                tab === t
                  ? 'bg-teal-900 text-white border-teal-900'
                  : 'bg-white text-ink-muted border-border'
              }`}
            >
              {t === 'duas' ? `🤲 ${tDuasTab}` : `📿 ${tZikrTab}`}
            </button>
          ))}
        </div>

        {tab === 'duas' && (
          <div className="space-y-3">
            {MASNOON_DUAS.map((d, idx) => (
              <div key={d.slug} className="bg-white border border-border rounded-2xl p-4">
                <p className="text-xs font-bold text-gold-dark uppercase tracking-wide mb-2">
                  {duaTitles[idx]}
                </p>
                <p className="font-arabic text-2xl text-teal-900 leading-loose text-right mb-2">
                  {d.arabic}
                </p>
                <p className="text-sm italic text-gold-dark leading-relaxed mb-1">{d.translit}</p>
                <p className="text-sm text-ink leading-relaxed">{duaMeanings[idx]}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'zikr' && (
          <div className="space-y-3">
            <p className="text-xs text-ink-muted mb-1">{tHint}</p>
            {ZIKR.map((z, idx) => (
              <button
                key={z.slug}
                onClick={() => navigate(`/wajifa/${z.slug}`)}
                style={{ animationDelay: `${idx * 90}ms` }}
                className="tile-in glossy-gold w-full rounded-2xl p-4 flex items-center gap-3 text-left shadow-md active:scale-[0.98] transition-transform"
              >
                <div className="w-11 h-11 rounded-xl bg-teal-900/10 flex items-center justify-center text-lg shrink-0">
                  📿
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-teal-900">{zikrTitles[idx]}</p>
                  <p className="font-arabic text-base text-teal-900 truncate">{z.arabic}</p>
                </div>
                <span className="text-xs font-bold text-teal-900 shrink-0">×{z.target}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
