// src/pages/Maqtab/MaqtabPage.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { useAppStore } from '../../store/appStore'
import { getMaqtabChapters, getMaqtabProgress } from '../../services/supabaseService'
import { useTr, useTrList, useLang } from '../../i18n/useTr'
import { contentDbLang } from '../../i18n/contentLang'
import { openPdf } from '../../lib/openPdfNative'

interface Lesson {
  id: string
  chapter_num: number
  chapter_title?: string
  title: string
  duration_min: number
  sort_order: number
  level: string
  lesson_num: number
}

export function MaqtabPage() {
  const navigate = useNavigate()
  const user = useAppStore((s) => s.user)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [done, setDone] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const lang = useLang()
  const [visibleLevels, setVisibleLevels] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function load() {
      const [chapters, progress] = await Promise.all([
        getMaqtabChapters(contentDbLang(lang)),
        user ? getMaqtabProgress(user.id) : Promise.resolve([]),
      ])
      setLessons(chapters as Lesson[])
      setDone(new Set(progress.map((p) => p.lesson_id)))
      setLoading(false)
    }
    load()
  }, [user, lang])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const levelKey = entry.target.getAttribute('data-level')
            if (levelKey) {
              setVisibleLevels((prev) => new Set([...prev, levelKey]))
            }
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = document.querySelectorAll('[data-level]')
    elements.forEach((el) => observer.observe(el))

    return () => {
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [lessons.length])

  const completedCount = lessons.filter((l) => done.has(l.id)).length

  // Group: Level → Chapter → lessons. sort_order repeats per chapter, so order
  // by chapter number then lesson number.
  const ordered = [...lessons].sort(
    (a, b) => a.chapter_num - b.chapter_num || a.lesson_num - b.lesson_num || a.sort_order - b.sort_order
  )
  const levels: { level: string; chapters: { chapter: number; lessons: Lesson[] }[] }[] = []
  for (const l of ordered) {
    let lvl = levels.find((x) => x.level === l.level)
    if (!lvl) {
      lvl = { level: l.level || 'Lessons', chapters: [] }
      levels.push(lvl)
    }
    let ch = lvl.chapters.find((c) => c.chapter === l.chapter_num)
    if (!ch) {
      ch = { chapter: l.chapter_num, lessons: [] }
      lvl.chapters.push(ch)
    }
    ch.lessons.push(l)
  }

  // Level completion: every lesson in level is done
  const levelCompletion = (level: string) => {
    const levelLessons = lessons.filter((l) => (l.level || '') === level)
    return levelLessons.length > 0 && levelLessons.every((l) => done.has(l.id))
  }

  const tOverall = useTr('Overall progress')
  const tKnowledge = useTr('Knowledge Check')
  const tKnowledgeSub = useTr('Quick 5-question check — see where you stand')
  const tAbout = useTr('About')
  const tExam = useTr('Take Exam')
  const tExamReady = useTr('You finished this level — take the exam for your certificate!')
  const tExamLocked = useTr('Finish all lessons to unlock the exam')
  const tChapter = useTr('Chapter')
  const tLesson = useTr('Lesson')
  const tMin = useTr('min')
  const tLoading = useTr('Loading lessons…')
  const tNone = useTr('No lessons found. Check your Supabase content.')
  // When the DB serves already-localized rows (english-urdu), the `title` is
  // curated Roman — render it verbatim; MT would only garble it.
  const alreadyLocalized = contentDbLang(lang) !== 'english'
  const lessonTitles = useTrList(lessons.map((l) => l.title))
  const titleMap = new Map(
    lessons.map((l, i) => [l.title, alreadyLocalized ? l.title : lessonTitles[i]])
  )
  const levelNames = useTrList(levels.map((l) => l.level))
  const levelMap = new Map(levels.map((l, i) => [l.level, levelNames[i]]))
  // Chapter title = the chapter's lesson title (from maqtab_lessons.title),
  // translated via the same titleMap.
  const chapLabel = (ch: { lessons: Lesson[] }) => {
    const t = ch.lessons[0]?.title
    return t ? titleMap.get(t) ?? t : ''
  }

  const getLevelStyle = (level: string) => {
    switch (level) {
      case 'Beginner':
        return { glossy: 'glossy-sky', accent: 'bg-blue-500', text: 'text-blue-900', border: 'border-blue-200' }
      case 'Intermediate':
        return { glossy: 'glossy', accent: 'bg-green-500', text: 'text-green-900', border: 'border-green-200' }
      case 'Advanced':
        return { glossy: 'glossy-purple', accent: 'bg-purple-500', text: 'text-purple-900', border: 'border-purple-200' }
      default:
        return { glossy: 'glossy-gold', accent: 'bg-gray-500', text: 'text-gray-900', border: 'border-gray-200' }
    }
  }

  const getPdfPath = (level: string) => {
    const levelName = level.toLowerCase()
    return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/LearnIslam/About_Us/${levelName}.pdf`
  }

  return (
    <div className="bg-cream min-h-screen pb-20 page-fade">
      <PageHeader title="Maqtab" subtitle="Your learning journey" backTo="/home" />

      <div className="px-4 pt-4">
        {/* Knowledge check (pre-test) — always available */}
        <button
          onClick={() => navigate('/maqtab/knowledge-check')}
          className="glossy-sky w-full rounded-2xl p-4 text-left shadow mb-4 active:scale-[0.98] transition-transform"
        >
          <p className="text-sm font-bold text-teal-900">📝 {tKnowledge}</p>
          <p className="text-xs text-teal-900/80 mt-0.5">{tKnowledgeSub}</p>
        </button>

        {lessons.length > 0 && (
          <div className="bg-white border border-border rounded-2xl p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold text-teal-900">{tOverall}</p>
              <p className="text-xs font-bold text-gold-dark">
                {lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0}% ·{' '}
                {completedCount} / {lessons.length}
              </p>
            </div>
            <div className="h-2 bg-sand rounded-full overflow-hidden">
              <div
                className="h-full bg-gold rounded-full transition-all"
                style={{
                  width: `${lessons.length ? (completedCount / lessons.length) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        )}

        {loading && <p className="text-ink-muted text-sm text-center py-8">{tLoading}</p>}

        {!loading && lessons.length === 0 && (
          <p className="text-ink-muted text-sm text-center py-8">{tNone}</p>
        )}

        {levels.map((lvl, idx) => {
          const style = getLevelStyle(lvl.level)
          const levelDone = levelCompletion(lvl.level)

          return (
            <div
              key={lvl.level}
              data-level={lvl.level}
              className={`mb-6 rounded-2xl p-4 ${style.glossy} shadow-md ${visibleLevels.has(lvl.level) ? 'section-fill' : 'opacity-0'}`}
            >
              {/* Level heading */}
              <span className={`text-xs font-bold text-white bg-teal-900 rounded-full px-3 py-1 uppercase tracking-wide inline-block mb-3`}>
                {levelMap.get(lvl.level) ?? lvl.level}
              </span>

              {/* About section with PDF */}
              <div className="mb-4 mt-3">
                <button
                  onClick={() => openPdf(getPdfPath(lvl.level), `${lvl.level.toLowerCase()}.pdf`)}
                  className="w-full rounded-xl p-3 glossy-gold text-teal-900 text-center text-sm font-semibold active:scale-[0.98] transition-transform shadow"
                >
                  📖 {tAbout} {lvl.level}
                </button>
              </div>

              {/* Separator */}
              <div className="h-px bg-border my-3" />

              {/* Chapters and lessons */}
              {lvl.chapters.map((ch) => (
                <div key={ch.chapter} className="mb-4">
                  {/* Chapter title */}
                  <p className={`text-sm font-bold mb-2 pl-1 ${lvl.level === 'Intermediate' ? 'text-white' : 'text-teal-900'}`}>
                    {tChapter} {ch.chapter}
                    {ch.lessons[0]?.chapter_title ? ` · ${ch.lessons[0].chapter_title}` : chapLabel(ch) ? ` · ${chapLabel(ch)}` : ''}
                  </p>
                  <div className="space-y-2">
                    {ch.lessons.map((lesson) => {
                      const isDone = done.has(lesson.id)
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => navigate(`/maqtab/${lesson.id}`)}
                          className="tile-in w-full rounded-2xl p-3.5 flex items-center gap-3 text-left shadow-md active:scale-[0.98] transition-transform bg-white border border-border"
                        >
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                              isDone ? 'bg-teal-900 text-white' : 'bg-teal-900/10 text-teal-900'
                            }`}
                          >
                            {isDone ? '✓' : lesson.lesson_num}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-ink truncate">
                              {titleMap.get(lesson.title) ?? lesson.title}
                            </p>
                            <p className="text-xs text-ink-muted">
                              {tLesson} {lesson.lesson_num}
                              {lesson.duration_min ? ` · ${lesson.duration_min} ${tMin}` : ''}
                            </p>
                          </div>
                          <span className="text-ink-muted text-lg">›</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}

              {/* Exam button for each level */}
              <button
                onClick={() => levelDone && navigate(`/maqtab/exam?level=${lvl.level}`)}
                disabled={!levelDone}
                className={`w-full rounded-2xl p-4 text-center transition-transform ${
                  levelDone
                    ? 'glossy-gold text-teal-900 shadow-xl border-b-4 border-gold active:translate-y-1 active:shadow-lg active:border-b-2'
                    : 'bg-white border border-border opacity-70'
                }`}
              >
                <p className={`text-sm font-bold ${levelDone ? 'text-teal-900' : 'text-ink-muted'}`}>
                  {levelDone ? '🎓' : '🔒'} {tExam}
                </p>
                <p className={`text-xs mt-0.5 ${levelDone ? 'text-teal-900/70' : 'text-ink-muted'}`}>
                  {levelDone ? tExamReady : tExamLocked}
                </p>
              </button>

              {/* Separator between levels */}
              {idx < levels.length - 1 && <div className="h-1 bg-border my-4" />}
            </div>
          )
        })}
      </div>

      <BottomNav />
    </div>
  )
}
