// src/pages/Maqtab/MaqtabPage.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { OverflowMarquee } from '../../components/OverflowMarquee'
import { BottomNav } from '../../components/BottomNav'
import { useAppStore } from '../../store/appStore'
import { getMaqtabChapters, getMaqtabProgress } from '../../services/supabaseService'
import { useTr, useTrList, useLang } from '../../i18n/useTr'
import { contentDbLang } from '../../i18n/contentLang'
import { openPdf } from '../../lib/openPdfNative'
import { MaqtabOnboarding } from '../../components/MaqtabOnboarding'

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
  const [showTutorial, setShowTutorial] = useState(false)
  const tutorialKey = `maqtab_tutorial_complete_${user?.id ?? 'guest'}`

  useEffect(() => {
    setShowTutorial(localStorage.getItem(tutorialKey) !== '1')
  }, [tutorialKey])

  const completeTutorial = () => {
    localStorage.setItem(tutorialKey, '1')
    setShowTutorial(false)
  }

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

  const levelOrder: Record<string, number> = { Beginner: 0, Intermediate: 1, Advanced: 2 }
  levels.sort((a, b) => (levelOrder[a.level] ?? 999) - (levelOrder[b.level] ?? 999))

  // Level completion: every lesson in level is done
  const levelCompletion = (level: string) => {
    const levelLessons = lessons.filter((l) => (l.level || '') === level)
    return levelLessons.length > 0 && levelLessons.every((l) => done.has(l.id))
  }

  const tOverall = useTr('Overall progress')
  const tKnowledge = useTr('Knowledge Check')
  const tKnowledgeSub = useTr('Quick 5-question check — see where you stand')
  const tAbout = useTr('About')
  const tAboutSub = useTr('Read the introduction (PDF)')
  const tExam = useTr('Take Exam')
  const tExamReady = useTr('You finished this level — take the exam for your certificate!')
  const tExamLocked = useTr('Finish all lessons to unlock the exam')
  const tChapter = useTr('Chapter')
  const tLesson = useTr('Lesson')
  const tMin = useTr('min')
  const tLoading = useTr('Loading lessons…')
  const tNone = useTr('No lessons found. Check your Supabase content.')
  const tTopScorers = useTr('Top Scorers')
  const tTopScorersSub = useTr('See the leading exam scores across every level')
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
        return 'maqtab-level--beginner'
      case 'Intermediate':
        return 'maqtab-level--intermediate'
      case 'Advanced':
        return 'maqtab-level--advanced'
      default:
        return 'maqtab-level--default'
    }
  }

  const getPdfPath = (level: string) => {
    const levelName = level.toLowerCase()
    return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/LearnIslam/About_Us/${levelName}.pdf`
  }

  return (
    <div className="maqtab-page min-h-screen pb-20 page-fade">
      <PageHeader
        title="Maqtab"
        subtitle="Your learning journey"
        backTo="/home"
        rightAction={
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowTutorial(true)}
              className="w-10 h-10 shrink-0 rounded-full bg-white/10 text-white flex items-center justify-center text-lg font-bold"
              aria-label="Maqtab tutorial"
              title="Maqtab tutorial"
            >
              ?
            </button>
            <button
              type="button"
              onClick={() => navigate('/maqtab/top-scorers')}
              className="w-10 h-10 shrink-0 rounded-full bg-white/10 text-gold flex items-center justify-center text-xl"
              aria-label={tTopScorers}
              title={tTopScorers}
            >
              🏆
            </button>
          </div>
        }
      />

      <MaqtabOnboarding open={showTutorial} onComplete={completeTutorial} />

      <div className="maqtab-content px-4 pt-4">
        {/* Knowledge check (pre-test) — always available */}
        <button
          onClick={() => navigate('/maqtab/knowledge-check')}
          className="maqtab-diagnostic w-full p-4 text-left mb-4 active:scale-[0.98] transition-transform"
        >
          <p className="text-sm font-bold text-teal-900">📝 {tKnowledge}</p>
          <p className="text-xs text-teal-900/80 mt-0.5">{tKnowledgeSub}</p>
        </button>

        {lessons.length > 0 && (
          <div className="maqtab-progress-panel p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold text-teal-900">{tOverall}</p>
              <p className="text-xs font-bold text-gold-dark">
                {lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0}% ·{' '}
                {completedCount} / {lessons.length}
              </p>
            </div>
            <div className="maqtab-progress-track h-2 rounded-full overflow-hidden">
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

        {levels.map((lvl) => {
          const style = getLevelStyle(lvl.level)
          const levelDone = levelCompletion(lvl.level)
          const levelLessons = lvl.chapters.flatMap((chapter) => chapter.lessons)
          const levelCompleted = levelLessons.filter((lesson) => done.has(lesson.id)).length

          const isLevelUnlocked = () => {
            if (lvl.level === 'Beginner') return true
            if (lvl.level === 'Intermediate') return user?.maqtabUnlocked || user?.maqtabIntermediateUnlocked
            if (lvl.level === 'Advanced') return user?.maqtabUnlocked || user?.maqtabAdvancedUnlocked
            return false
          }

          return (
            <section
              key={lvl.level}
              data-level={lvl.level}
              className={`maqtab-level ${style} mb-8 ${visibleLevels.has(lvl.level) ? 'section-fill' : 'opacity-0'}`}
            >
              <div className="maqtab-level-header">
                <h2 className="maqtab-level-title">{levelMap.get(lvl.level) ?? lvl.level}</h2>
                <span className="maqtab-level-count">{levelCompleted}/{levelLessons.length}</span>
              </div>

              {/* About section with PDF */}
              <div className="mb-5">
                <button
                  onClick={() => openPdf(getPdfPath(lvl.level), `${lvl.level.toLowerCase()}.pdf`)}
                  className="maqtab-about w-full p-3 text-left active:scale-[0.98] transition-transform"
                >
                  <p className="text-sm font-semibold text-teal-900">📖 {tAbout} {lvl.level}</p>
                  <p className="text-xs text-teal-900/80 mt-0.5">{tAboutSub}</p>
                </button>
              </div>

              {/* Lock UI for Intermediate/Advanced if not unlocked */}
              {!isLevelUnlocked() && (
                <div className="maqtab-locked text-center py-8">
                  <p className="text-4xl mb-3">🔒</p>
                  <p className="text-lg font-semibold text-teal-900 mb-2">Section Locked</p>
                  <p className="text-sm text-ink-muted mb-4">Invite 2 friends to unlock</p>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => navigate('/invite')}
                      className="bg-teal-900 hover:bg-teal-800 text-white font-semibold py-2 px-4 rounded-lg transition text-sm"
                    >
                      Invite Friends
                    </button>
                  </div>
                </div>
              )}

              {/* Chapters and lessons */}
              {isLevelUnlocked() && (
                <>
                  {lvl.chapters.map((ch) => (
                <div key={ch.chapter} className="maqtab-chapter mb-5">
                  {/* Chapter title */}
                  <p className="maqtab-chapter-title mb-2">
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
                          className={`maqtab-lesson-row tile-in w-full p-3 flex items-center gap-3 text-left active:scale-[0.98] transition-transform ${isDone ? 'is-complete' : ''}`}
                        >
                          <div
                            className="maqtab-lesson-index w-9 h-9 flex items-center justify-center font-bold text-sm shrink-0"
                          >
                            {isDone ? '✓' : lesson.lesson_num}
                          </div>
                          <div className="flex-1 min-w-0">
                            <OverflowMarquee
                              text={titleMap.get(lesson.title) ?? lesson.title}
                              className="maqtab-lesson-title text-sm font-bold"
                            />
                            <p className="maqtab-lesson-meta text-xs">
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
                    className={`maqtab-exam w-full p-4 text-center transition-transform ${levelDone ? 'is-ready' : 'is-locked'}`}
                  >
                    <p className="text-sm font-bold">
                      {levelDone ? '🎓' : '🔒'} {tExam}
                    </p>
                    <p className="text-xs mt-1 opacity-75">
                      {levelDone ? tExamReady : tExamLocked}
                    </p>
                  </button>
                </>
              )}

            </section>
          )
        })}

        {!loading && lessons.length > 0 && (
          <button
            type="button"
            onClick={() => navigate('/maqtab/top-scorers')}
            className="maqtab-leaderboard-link w-full mb-6 px-4 py-4 flex items-center gap-3 text-left active:scale-[0.98]"
          >
            <span className="w-10 h-10 shrink-0 rounded-full bg-gold text-teal-900 flex items-center justify-center font-bold">#1</span>
            <span className="flex-1 min-w-0">
              <span className="block text-sm font-bold text-teal-900">{tTopScorers}</span>
              <span className="block text-xs text-ink-muted mt-0.5">{tTopScorersSub}</span>
            </span>
            <span className="text-gold-dark text-xl" aria-hidden="true">&rsaquo;</span>
          </button>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
