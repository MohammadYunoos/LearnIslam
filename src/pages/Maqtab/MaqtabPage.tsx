// src/pages/Maqtab/MaqtabPage.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { useAppStore } from '../../store/appStore'
import { getMaqtabChapters, getMaqtabProgress } from '../../services/supabaseService'
import { useTr, useTrList, useLang } from '../../i18n/useTr'
import { contentDbLang } from '../../i18n/contentLang'

interface Lesson {
  id: string
  chapter_num: number
  title: string
  duration_min: number
  sort_order: number
  level: string
  lesson_num: number
}

// Chapter titles (no column in the DB). Keyed by "level-chapter".
const CHAPTER_TITLES: Record<string, string> = {
  'Beginner-1': 'Foundations of Iman',
  'Beginner-2': 'Taharah — Purification',
  'Beginner-3': 'Salah — Prayer',
}

function chapterTitle(level: string, chapter: number): string {
  return CHAPTER_TITLES[`${level}-${chapter}`] ?? ''
}

export function MaqtabPage() {
  const navigate = useNavigate()
  const user = useAppStore((s) => s.user)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [done, setDone] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const lang = useLang()

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

  // Beginner is "done" when every Beginner lesson has a completed (passed) quiz.
  const beginnerLessons = lessons.filter((l) => (l.level || '') === 'Beginner')
  const beginnerDone = beginnerLessons.length > 0 && beginnerLessons.every((l) => done.has(l.id))

  const tOverall = useTr('Overall progress')
  const tKnowledge = useTr('Knowledge Check')
  const tKnowledgeSub = useTr('Quick 5-question check — see where you stand')
  const tExam = useTr('Beginner Exam')
  const tExamReady = useTr('You finished Beginner — take the exam for your certificate!')
  const tExamLocked = useTr('Finish all Beginner lessons to unlock the exam')
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
  const chapLabels = levels.flatMap((lvl) =>
    lvl.chapters.map((ch) => chapterTitle(lvl.level, ch.chapter)).filter(Boolean)
  )
  const trChap = useTrList(chapLabels)
  const chapMap = new Map(chapLabels.map((t, i) => [t, trChap[i]]))
  const chapLabel = (level: string, chapter: number) => {
    const en = chapterTitle(level, chapter)
    return en ? chapMap.get(en) ?? en : ''
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

        {levels.map((lvl) => (
          <div key={lvl.level} className="mb-6">
            {/* Level */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-white bg-teal-900 rounded-full px-3 py-1 uppercase tracking-wide">
                {levelMap.get(lvl.level) ?? lvl.level}
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {lvl.chapters.map((ch) => (
              <div key={ch.chapter} className="mb-4">
                {/* Chapter */}
                <p className="text-sm font-bold text-gold-dark mb-2 pl-1">
                  {tChapter} {ch.chapter}
                  {chapLabel(lvl.level, ch.chapter) ? ` · ${chapLabel(lvl.level, ch.chapter)}` : ''}
                </p>
                <div className="space-y-2">
                  {ch.lessons.map((lesson) => {
                    const isDone = done.has(lesson.id)
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => navigate(`/maqtab/${lesson.id}`)}
                        className="tile-in glossy-gold w-full rounded-2xl p-3.5 flex items-center gap-3 text-left shadow-md active:scale-[0.98] transition-transform"
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                            isDone ? 'bg-teal-900 text-white' : 'bg-teal-900/10 text-teal-900'
                          }`}
                        >
                          {isDone ? '✓' : lesson.lesson_num}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-teal-900 truncate">
                            {titleMap.get(lesson.title) ?? lesson.title}
                          </p>
                          <p className="text-xs text-teal-900/70">
                            {tLesson} {lesson.lesson_num}
                            {lesson.duration_min ? ` · ${lesson.duration_min} ${tMin}` : ''}
                          </p>
                        </div>
                        <span className="text-teal-900/70 text-lg">›</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

            {/* Beginner exam entry — at the end of the Beginner section */}
            {lvl.level === 'Beginner' && (
              <button
                onClick={() => beginnerDone && navigate('/maqtab/exam')}
                disabled={!beginnerDone}
                className={`w-full rounded-2xl p-4 text-left shadow mt-2 transition-transform ${
                  beginnerDone
                    ? 'glossy-gold active:scale-[0.98]'
                    : 'bg-white border border-border opacity-70'
                }`}
              >
                <p className={`text-sm font-bold ${beginnerDone ? 'text-teal-900' : 'text-ink-muted'}`}>
                  {beginnerDone ? '🎓' : '🔒'} {tExam}
                </p>
                <p className={`text-xs mt-0.5 ${beginnerDone ? 'text-teal-900/80' : 'text-ink-muted'}`}>
                  {beginnerDone ? tExamReady : tExamLocked}
                </p>
              </button>
            )}
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  )
}
