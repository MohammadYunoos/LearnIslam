// src/pages/Home/HomePage.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/appStore'
import { BottomNav } from '../../components/BottomNav'
import { getHadeesOfTheDay, getMaqtabProgress } from '../../services/supabaseService'
import { useTr, useTrList, useLang } from '../../i18n/useTr'
import { Logo } from '../../components/Logo'

const MENU_ITEMS = [
  { num: '01', title: 'Masail', sub: 'Gusl · Wudu · Tayammum · Namaaz · more', icon: '💧', path: '/guide' },
  { num: '02', title: 'Adaab', sub: 'Daily etiquette', icon: '📋', path: '/adaab' },
  { num: '03', title: 'Islamic Q & A', sub: 'Question & answer volumes', icon: '📚', path: '/taleem' },
  { num: '04', title: 'Maqtab', sub: 'Learning journey', icon: '📖', path: '/maqtab' },
  { num: '05', title: 'Hifz', sub: 'Surah memorisation', icon: '⭐', path: '/hifz' },
  { num: '06', title: 'Detoxify', sub: 'Heart and Akhlaq', icon: '🌿', path: '/detoxify' },
  { num: '07', title: 'Masnoon Dua & Zikr', sub: 'Duas · Kalimas · Tasbih', icon: '🤲', path: '/wajifa' },
  { num: '08', title: 'Ask Ulema', sub: 'Send your masail to scholars', icon: '🕌', path: '/masail' },
  { num: '09', title: 'Find Qibla', sub: 'Direction of the Ka‘bah', icon: '🧭', path: '/qibla' },
  { num: '10', title: 'Ehtimam-e-Namaaz', sub: 'Prayer & Roza timings', icon: '🕰️', path: '/namaaz-timings' },
]

interface Hadees {
  arabic_text?: string
  translation?: string
  collection?: string
  hadith_num?: string | number
  grading?: string
}

export function HomePage() {
  const navigate = useNavigate()
  const user = useAppStore((s) => s.user)
  const showPopup = useAppStore((s) => s.showHadeesPopup)
  const setPopup = useAppStore((s) => s.setShowHadeesPopup)
  const [hadees, setHadees] = useState<Hadees | null>(null)
  const [progress, setProgress] = useState<{ lesson_id: string; quiz_score: number }[]>([])

  useEffect(() => {
    getHadeesOfTheDay().then(setHadees)
    if (user) getMaqtabProgress(user.id).then(setProgress)
  }, [user])

  // Show the Hadees popup only once per day.
  useEffect(() => {
    const today = new Date().toDateString()
    const shown = localStorage.getItem('mymaqtab_hadees_date')
    setPopup(shown !== today)
  }, [setPopup])

  const dismissHadees = () => {
    localStorage.setItem('mymaqtab_hadees_date', new Date().toDateString())
    setPopup(false)
  }

  const tGreet = useTr('Assalamu Alaikum')
  const tPrompt = useTr('What would you like to learn?')
  const titles = useTrList(MENU_ITEMS.map((i) => i.title))
  const subs = useTrList(MENU_ITEMS.map((i) => i.sub))
  const tHadeesTitle = useTr('Hadees of the day')
  const tAmeen = useTr('Ameen, continue')
  const tMaqtabProgress = useTr('Maqtab progress')
  const tLessonsDone = useTr('lessons done')
  const tHadeesTranslation = useTr(hadees?.translation ?? '')
  const lang = useLang()
  // For non-English users the translation arrives async; show a loader until
  // the Roman/Urdu text is ready instead of flashing the English source.
  const hadeesReady = lang === 'en' || !hadees?.translation || tHadeesTranslation !== ''

  return (
    <div className="bg-cream min-h-screen pb-20 page-fade">
      {/* Top bar */}
      <div className="bg-teal-900 px-4 pt-10 pb-4 flex items-center justify-between safe-top">
        <div className="flex items-center gap-2">
          <Logo size={34} ring={false} />
          <div>
            <p className="font-arabic text-white text-xl font-bold leading-tight">Islam Seekho</p>
            <p className="text-sand text-xs">{tGreet}, {user?.name}</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/settings')}
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-sm"
        >
          ⚙️
        </button>
      </div>

      <div className="px-4 pt-4">
        {/* Progress card */}
        {progress.length > 0 && (
          <div className="bg-white border border-border rounded-2xl p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold text-teal-900">{tMaqtabProgress}</p>
              <p className="text-xs font-bold text-gold-dark">{progress.length} {tLessonsDone}</p>
            </div>
            <div className="h-2 bg-sand rounded-full overflow-hidden">
              <div
                className="h-full bg-gold rounded-full transition-all"
                style={{ width: `${Math.min(100, (progress.length / 9) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Menu grid */}
        <p className="text-xs font-bold text-ink-muted uppercase tracking-widest mb-3">{tPrompt}</p>
        <div className="grid grid-cols-2 gap-3">
          {MENU_ITEMS.map((item, idx) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{ animationDelay: `${idx * 90}ms` }}
              className="tile-in glossy group relative overflow-hidden rounded-2xl p-4 text-left shadow-md active:scale-95 transition-transform"
            >
              <span className="text-xs font-bold text-white/70 group-active:text-teal-900 block mb-1">
                {item.num}
              </span>
              <div className="w-9 h-9 rounded-xl bg-white/15 group-active:bg-teal-900/15 flex items-center justify-center text-lg mb-2">
                {item.icon}
              </div>
              <p className="text-sm font-bold leading-tight group-active:text-teal-900">
                {titles[idx]}
              </p>
              <p className="text-xs text-white/80 group-active:text-teal-900/80 mt-0.5">
                {subs[idx]}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Hadees popup */}
      {showPopup && hadees && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-cream rounded-2xl p-6 text-center border-t-4 border-gold w-full max-w-sm">
            <p className="text-xs font-bold text-gold-dark uppercase tracking-widest mb-3">
              {tHadeesTitle}
            </p>
            {hadees.arabic_text && (
              <p className="font-arabic text-lg text-teal-900 leading-relaxed mb-3">
                {hadees.arabic_text}
              </p>
            )}
            {hadeesReady ? (
              <>
                <p className="text-sm text-ink leading-relaxed mb-2">
                  &ldquo;{tHadeesTranslation || hadees.translation}&rdquo;
                </p>
                <p className="text-xs text-ink-muted mb-4">
                  — {hadees.collection}, Hadith {hadees.hadith_num} · {hadees.grading}
                </p>
                <button
                  onClick={dismissHadees}
                  className="bg-teal-900 text-white font-bold px-8 py-2.5 rounded-full text-sm"
                >
                  {tAmeen}
                </button>
              </>
            ) : (
              <div className="flex justify-center py-6">
                <span className="w-7 h-7 border-2 border-gold border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
