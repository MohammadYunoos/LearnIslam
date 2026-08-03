// src/pages/Maqtab/LessonPage.tsx
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { PageHeader } from '../../components/PageHeader'
import { getLessonContent } from '../../services/supabaseService'

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

  return (
    <div className="bg-cream min-h-screen pb-28">
      <PageHeader title={lesson?.title ?? 'Lesson'} backTo="/maqtab" />

      <div className="px-4 pt-4">
        {loading && <p className="text-ink-muted text-sm text-center py-8">Loading…</p>}

        {!loading && lesson && (
          <div className="bg-white border border-border rounded-2xl p-5">
            {lesson.arabic_text && (
              <p className="font-arabic text-2xl text-teal-900 leading-relaxed text-right mb-4">
                {lesson.arabic_text}
              </p>
            )}
            <div className="prose-maqtab text-sm text-ink leading-relaxed space-y-3">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
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
            Take the quiz →
          </button>
        </div>
      )}
    </div>
  )
}
