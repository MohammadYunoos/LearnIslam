// src/pages/Maqtab/LessonPage.tsx
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { PageHeader } from '../../components/PageHeader'
import { getLessonContent } from '../../services/supabaseService'
import { useTr, useTrList } from '../../i18n/useTr'

interface Lesson {
  id: string
  title: string
  content_md?: string
  content?: string
  arabic_text?: string
  duration_min?: number
  level?: string
}

export function LessonPage() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!lessonId) return
    getLessonContent(lessonId).then((data) => {
      setLesson(data as Lesson)
      setLoading(false)
    })
  }, [lessonId])

  const body = lesson?.content_md ?? lesson?.content ?? ''
  const blocks = useMemo(() => {
    const raw = body.split(/\n{2,}/)
    const out: string[] = []
    for (const b of raw) {
      if (b.length <= 1500) {
        out.push(b)
        continue
      }
      // Split oversized blocks by sentence so each translate call stays small.
      let cur = ''
      for (const s of b.split(/(?<=[.!?۔])\s+/)) {
        if (cur && cur.length + s.length > 1500) {
          out.push(cur)
          cur = ''
        }
        cur += (cur ? ' ' : '') + s
      }
      if (cur) out.push(cur)
    }
    return out
  }, [body])
  const trBlocks = useTrList(blocks)
  const trBody = trBlocks.join('\n\n')
  const tQuiz = useTr('Take the quiz')

  return (
    <div className="bg-cream min-h-screen pb-28">
      <PageHeader title={lesson?.title ?? 'Lesson'} backTo="/maqtab" />

      <div className="px-4 pt-4">
        {loading && <p className="text-ink-muted text-sm text-center py-8">Loading…</p>}

        {!loading && lesson && (
          <div className="rounded-2xl shadow-md border border-gold/30 bg-[#FFFDF7] px-5 py-6">
            {lesson.arabic_text && (
              <p className="font-arabic text-2xl text-teal-900 leading-loose text-right mb-4">
                {lesson.arabic_text}
              </p>
            )}
            <div className="qa-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{trBody}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {/* Fixed action bar */}
      {!loading && lesson && (
        <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-cream border-t border-border p-4">
          <button
            onClick={() => navigate(`/maqtab/${lessonId}/quiz`)}
            className="w-full bg-teal-900 text-white font-bold rounded-xl py-3 text-sm"
          >
            {tQuiz} →
          </button>
        </div>
      )}
    </div>
  )
}
