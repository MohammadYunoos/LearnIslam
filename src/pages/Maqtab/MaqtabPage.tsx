// src/pages/Maqtab/MaqtabPage.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { useAppStore } from '../../store/appStore'
import { getMaqtabChapters, getMaqtabProgress } from '../../services/supabaseService'

interface Lesson {
  id: string
  chapter_num: number
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

  useEffect(() => {
    async function load() {
      const [chapters, progress] = await Promise.all([
        getMaqtabChapters(),
        user ? getMaqtabProgress(user.id) : Promise.resolve([]),
      ])
      setLessons(chapters as Lesson[])
      setDone(new Set(progress.map((p) => p.lesson_id)))
      setLoading(false)
    }
    load()
  }, [user])

  const completedCount = lessons.filter((l) => done.has(l.id)).length

  // Group: Level → Chapter → lessons (keep sort_order within each).
  const levels: { level: string; chapters: { chapter: number; lessons: Lesson[] }[] }[] = []
  for (const l of [...lessons].sort((a, b) => a.sort_order - b.sort_order)) {
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

  return (
    <div className="bg-cream min-h-screen pb-20">
      <PageHeader title="Maqtab" subtitle="Your learning journey" backTo="/home" />

      <div className="px-4 pt-4">
        {lessons.length > 0 && (
          <div className="bg-white border border-border rounded-2xl p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold text-teal-900">Overall progress</p>
              <p className="text-xs font-bold text-gold-dark">
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

        {loading && <p className="text-ink-muted text-sm text-center py-8">Loading lessons…</p>}

        {!loading && lessons.length === 0 && (
          <p className="text-ink-muted text-sm text-center py-8">
            No lessons found. Check your Supabase content.
          </p>
        )}

        {levels.map((lvl) => (
          <div key={lvl.level} className="mb-6">
            {/* Level */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-white bg-teal-900 rounded-full px-3 py-1 uppercase tracking-wide">
                {lvl.level}
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {lvl.chapters.map((ch) => (
              <div key={ch.chapter} className="mb-4">
                {/* Chapter */}
                <p className="text-sm font-bold text-gold-dark mb-2 pl-1">Chapter {ch.chapter}</p>
                <div className="space-y-2">
                  {ch.lessons.map((lesson) => {
                    const isDone = done.has(lesson.id)
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => navigate(`/maqtab/${lesson.id}`)}
                        className="w-full bg-white border border-border rounded-2xl p-3.5 flex items-center gap-3 text-left active:scale-[0.98] transition-transform"
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                            isDone ? 'bg-teal-900 text-white' : 'bg-sand text-teal-900'
                          }`}
                        >
                          {isDone ? '✓' : lesson.lesson_num}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-teal-900 truncate">
                            {lesson.title}
                          </p>
                          <p className="text-xs text-ink-muted">
                            Lesson {lesson.lesson_num}
                            {lesson.duration_min ? ` · ${lesson.duration_min} min` : ''}
                          </p>
                        </div>
                        <span className="text-gold-dark text-lg">›</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  )
}
