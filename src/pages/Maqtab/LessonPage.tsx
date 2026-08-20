// src/pages/Maqtab/LessonPage.tsx
import { useEffect, useMemo, useRef, useState } from 'react'
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
  language?: string
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

  // Normalise CRLF → LF, then split on blank lines so each heading / list /
  // rule / paragraph is its own markdown block (kept intact for translation).
  const body = (lesson?.content_md ?? lesson?.content ?? '').replace(/\r\n/g, '\n')
  const blocks = useMemo(() => body.split(/\n{2,}/).filter((b) => b.trim()), [body])
  const trBlocks = useTrList(blocks)
  // A lesson already stored in the chosen language must NOT be MT-translated again.
  const alreadyLocalized = !!lesson?.language && lesson.language !== 'english'
  const trBody = (alreadyLocalized ? blocks : trBlocks).join('\n\n')
  const tQuiz = useTr('Take the quiz')

  const cardRef = useRef<HTMLDivElement | null>(null)
  const [isFs, setIsFs] = useState(false)
  useEffect(() => {
    const onChange = () => setIsFs(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])
  const toggleFullscreen = () => {
    try {
      if (document.fullscreenElement) document.exitFullscreen()
      else cardRef.current?.requestFullscreen?.()
    } catch {
      /* WebView may not support fullscreen */
    }
  }

  return (
    <div className="bg-cream min-h-screen pb-28">
      <PageHeader
        title={lesson?.title ?? 'Lesson'}
        backTo="/maqtab"
        noTranslate={alreadyLocalized}
      />

      <div className="px-4 pt-4">
        {loading && <p className="text-ink-muted text-sm text-center py-8">Loading…</p>}

        {!loading && lesson && (
          <div
            ref={cardRef}
            className="fs-card relative rounded-2xl shadow-md border border-gold/30 bg-[#FFFDF7] px-5 py-6"
          >
            <button
              onClick={toggleFullscreen}
              className="fixed top-24 right-4 z-50 bg-teal-900 text-white rounded-full w-10 h-10 flex items-center justify-center text-base shadow-lg"
              aria-label="Toggle fullscreen"
            >
              {isFs ? '🗕' : '⛶'}
            </button>
            {lesson.arabic_text && (
              <p className="font-arabic text-2xl text-teal-900 leading-loose text-right mb-4 pr-10">
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
        <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-cream border-t border-border p-4 safe-bottom">
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
