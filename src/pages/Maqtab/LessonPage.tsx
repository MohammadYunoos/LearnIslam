import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Capacitor } from '@capacitor/core'
import { PageHeader } from '../../components/PageHeader'
import {
  getLessonContent,
  getMaqtabLessonFeedback,
  rateMaqtabLesson,
  toggleMaqtabLessonLike,
} from '../../services/supabaseService'
import { useAppStore } from '../../store/appStore'
import { useTrList } from '../../i18n/useTr'
import { logAnalyticsEvent } from '../../lib/analytics'
import { useScrollDirection } from '../../hooks/useScrollDirection'

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

interface ReadingState {
  progress: number
  bookmark: number | null
  fontScale: number
}

const DEFAULT_READING_STATE: ReadingState = { progress: 0, bookmark: null, fontScale: 1 }
const FONT_SCALES = [0.85, 1, 1.15, 1.3]

function formatEmbeddedTakeaways(markdown: string) {
  const lines = markdown.split('\n')
  const headingIndex = lines.findIndex((line) => /^\s*\*\*Key Takeaways\*\*\s*$/i.test(line))
  if (headingIndex < 0) return markdown

  let end = lines.length
  for (let i = headingIndex + 1; i < lines.length; i += 1) {
    if (/^\s*(?:#{1,6}\s+|\*\*[^*]+\*\*\s*$)/.test(lines[i])) {
      end = i
      break
    }
  }
  const takeaways = lines
    .slice(headingIndex + 1, end)
    .join('\n')
    .split('✓')
    .map((line) => line.replace(/^\s*(?:[-*+]\s+|\d+[.)]\s+)/, '').trim())
    .filter(Boolean)
  if (!takeaways.length) return markdown

  const formatted = ['## Key Takeaways', '', ...takeaways.map((item) => `- ✓ ${item}`)]
  return [...lines.slice(0, headingIndex), ...formatted, '', ...lines.slice(end)].join('\n')
}

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)))
}

export function LessonPage() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const user = useAppStore((s) => s.user)
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [bookmark, setBookmark] = useState<number | null>(null)
  const [fontScale, setFontScale] = useState(1)
  const [bookmarkSaved, setBookmarkSaved] = useState(false)
  const [toolbarMinimized, setToolbarMinimized] = useState(false)
  const isScrollingDown = useScrollDirection()
  const [likeCount, setLikeCount] = useState(0)
  const [liked, setLiked] = useState(false)
  const [rating, setRating] = useState<number | null>(null)
  const [averageRating, setAverageRating] = useState<number | null>(null)
  const [ratingCount, setRatingCount] = useState(0)
  const [feedbackBusy, setFeedbackBusy] = useState(false)
  const [lessonHeaderHeight, setLessonHeaderHeight] = useState(0)
  const lessonHeaderRef = useRef<HTMLDivElement | null>(null)
  const progressRef = useRef(0)
  const restoredRef = useRef<string | null>(null)
  const restoringRef = useRef(true)
  const pageExitingRef = useRef(false)

  const storageKey = `maqtab_reading_${user?.id ?? 'guest'}_${lessonId ?? 'unknown'}`

  useLayoutEffect(() => {
    const header = lessonHeaderRef.current
    if (!header) return
    const updateHeight = () => setLessonHeaderHeight(Math.ceil(header.getBoundingClientRect().height))
    updateHeight()
    const observer = new ResizeObserver(updateHeight)
    observer.observe(header)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!lessonId) return
    setLoading(true)
    restoredRef.current = null
    restoringRef.current = true
    pageExitingRef.current = false
    getLessonContent(lessonId).then((data) => {
      setLesson(data as Lesson)
      setLoading(false)
    })
  }, [lessonId])

  useEffect(() => {
    if (!lessonId) return
    getMaqtabLessonFeedback(lessonId)
      .then((feedback) => {
        setLikeCount(feedback.likeCount)
        setLiked(feedback.liked)
        setRating(feedback.rating)
        setAverageRating(feedback.averageRating)
        setRatingCount(feedback.ratingCount)
      })
      .catch(() => {
        // Feedback is supplementary; a lesson still works when it is unavailable.
      })
  }, [lessonId])

  const rawBody = (lesson?.content_md ?? lesson?.content ?? '').replace(/\r\n/g, '\n')
  const formattedBody = useMemo(() => formatEmbeddedTakeaways(rawBody), [rawBody])
  const blocks = useMemo(
    () => formattedBody.split(/\n{2,}/).filter((block) => block.trim()),
    [formattedBody]
  )
  const trBlocks = useTrList(blocks)
  const alreadyLocalized = !!lesson?.language && lesson.language !== 'english'
  const trBody = (alreadyLocalized ? blocks : trBlocks).join('\n\n')
  const L = useTrList([
    'Completed',
    'Decrease font size',
    'Increase font size',
    'Save Progress',
    'Progress saved',
    'Go to bookmark',
    'Take the quiz',
    'You need 80% or higher to pass this lesson quiz.',
    'Loading...',
    'Reading progress',
    'Minimize progress controls',
    'Show progress controls',
    'Like',
    'Rate this lesson',
    'Share',
    'ratings',
  ])

  const readSavedState = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) || '{}') as Partial<ReadingState>
      return {
        progress: clampPercent(parsed.progress ?? 0),
        bookmark: parsed.bookmark == null ? null : clampPercent(parsed.bookmark),
        fontScale: FONT_SCALES.includes(parsed.fontScale ?? 1) ? (parsed.fontScale ?? 1) : 1,
      }
    } catch {
      return DEFAULT_READING_STATE
    }
  }

  const saveState = (next: Partial<ReadingState>) => {
    try {
      const current = readSavedState()
      localStorage.setItem(storageKey, JSON.stringify({ ...current, ...next }))
    } catch {
      /* Reading still works when device storage is unavailable. */
    }
  }

  const scrollToPercent = (percent: number, behavior: ScrollBehavior = 'smooth') => {
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
    window.scrollTo({ top: (maxScroll * percent) / 100, behavior })
  }

  useLayoutEffect(() => {
    if (loading || !lessonId || restoredRef.current === storageKey) return
    if (rawBody.trim() && !trBody.trim()) return
    const saved = readSavedState()
    setProgress(saved.progress)
    progressRef.current = saved.progress
    setBookmark(saved.bookmark)
    setFontScale(saved.fontScale)
    const frame = window.requestAnimationFrame(() => {
      scrollToPercent(saved.progress, 'auto')
      restoredRef.current = storageKey
      restoringRef.current = false
    })
    return () => window.cancelAnimationFrame(frame)
    // Restore once after the translated lesson content is rendered.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, lessonId, storageKey, rawBody, trBody])

  useEffect(() => {
    const preserveProgress = () => {
      pageExitingRef.current = true
      saveState({ progress: progressRef.current })
    }
    window.addEventListener('beforeunload', preserveProgress)
    window.addEventListener('pagehide', preserveProgress)
    return () => {
      window.removeEventListener('beforeunload', preserveProgress)
      window.removeEventListener('pagehide', preserveProgress)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey])

  useEffect(() => {
    let frame = 0
    let saveTimer = 0
    const updateProgress = () => {
      if (restoringRef.current || pageExitingRef.current) return
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        const next = maxScroll <= 0 ? 100 : clampPercent((window.scrollY / maxScroll) * 100)
        progressRef.current = next
        setProgress(next)
        window.clearTimeout(saveTimer)
        saveTimer = window.setTimeout(() => saveState({ progress: next }), 250)
      })
    }
    window.addEventListener('scroll', updateProgress, { passive: true })
    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.cancelAnimationFrame(frame)
      window.clearTimeout(saveTimer)
    }
    // Storage identity changes only when the user or lesson changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey])

  const changeFontScale = (direction: -1 | 1) => {
    const currentIndex = FONT_SCALES.indexOf(fontScale)
    const nextIndex = Math.max(0, Math.min(FONT_SCALES.length - 1, currentIndex + direction))
    const next = FONT_SCALES[nextIndex]
    setFontScale(next)
    saveState({ fontScale: next })
  }

  const addBookmark = () => {
    const next = progressRef.current
    setBookmark(next)
    saveState({ bookmark: next, progress: next })
    setBookmarkSaved(true)
    window.setTimeout(() => setBookmarkSaved(false), 1800)
  }

  const toggleLike = async () => {
    if (!lessonId || feedbackBusy) return
    setFeedbackBusy(true)
    try {
      const feedback = await toggleMaqtabLessonLike(lessonId)
      setLiked(feedback.liked)
      setLikeCount(feedback.likeCount)
    } finally {
      setFeedbackBusy(false)
    }
  }

  const setLessonRating = async (nextRating: number) => {
    if (!lessonId || feedbackBusy) return
    setFeedbackBusy(true)
    try {
      const feedback = await rateMaqtabLesson(lessonId, nextRating)
      setRating(feedback.rating)
      setAverageRating(feedback.averageRating)
      setRatingCount(feedback.ratingCount)
      void logAnalyticsEvent('lesson_rated', { lesson_id: lessonId, rating: nextRating })
    } finally {
      setFeedbackBusy(false)
    }
  }

  const shareLesson = async () => {
    const appLink = 'https://play.google.com/store/apps/details?id=com.mymaqtab.app'
    const message = `I am learning ${lesson?.title ?? 'Islamic lessons'} on Islam Seeko. Join me: ${appLink}`
    try {
      if (Capacitor.isNativePlatform()) {
        const { Share } = await import('@capacitor/share')
        await Share.share({ title: 'Learn with Islam Seeko', text: message, dialogTitle: L[14] })
      } else if (navigator.share) {
        await navigator.share({ title: 'Learn with Islam Seeko', text: message })
      } else {
        await navigator.clipboard.writeText(message)
      }
    } catch {
      // A dismissed share sheet should not interrupt reading.
    }
  }

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
    <div className="maqtab-page maqtab-reader-page min-h-screen pb-40">
      <div ref={lessonHeaderRef} className="fixed top-0 left-0 right-0 z-40 max-w-lg mx-auto">
        <PageHeader
          title={lesson?.title ?? 'Lesson'}
          backTo="/maqtab"
          noTranslate={alreadyLocalized}
          compact
          marqueeTitle
        />

        {!loading && lesson && !toolbarMinimized && isScrollingDown && (
          <div className="maqtab-reader-toolbar border-b shadow-sm px-3 py-2 transition-opacity duration-300">
          <div className="flex items-center justify-between text-[11px] font-semibold mb-1.5">
            <span className="text-teal-900">{L[0]} {progress}%</span>
            <button
              type="button"
              onClick={() => setToolbarMinimized(true)}
              className="w-7 h-7 -my-1 border border-border bg-white text-teal-900 font-bold rounded-md"
              aria-label={L[10]}
              title={L[10]}
            >
              &minus;
            </button>
          </div>
          <div className="h-1.5 bg-sand rounded-full overflow-hidden" role="progressbar" aria-label={L[9]} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
            <div className="h-full bg-gold transition-[width] duration-150" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex items-center justify-between mt-1.5 gap-2">
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => changeFontScale(-1)} disabled={fontScale === FONT_SCALES[0]} className="w-8 h-8 border border-border bg-white text-teal-900 text-sm font-bold rounded-md disabled:opacity-40" aria-label={L[1]} title={L[1]}>A-</button>
              <span className="w-10 text-center text-[11px] font-semibold text-ink-muted">{Math.round(fontScale * 100)}%</span>
              <button type="button" onClick={() => changeFontScale(1)} disabled={fontScale === FONT_SCALES[FONT_SCALES.length - 1]} className="w-8 h-8 border border-border bg-white text-teal-900 text-sm font-bold rounded-md disabled:opacity-40" aria-label={L[2]} title={L[2]}>A+</button>
            </div>
            <div className="flex gap-1">
              {bookmark != null && (
                <button type="button" onClick={() => scrollToPercent(bookmark)} className="h-8 px-2 border border-gold bg-white text-gold-dark font-bold rounded-md text-[11px]" title={L[5]}>
                  {L[5]} {bookmark}%
                </button>
              )}
              <button type="button" onClick={addBookmark} className="h-8 px-2.5 bg-teal-900 text-white font-bold rounded-md text-[11px]" title={L[3]}>
                {bookmarkSaved ? L[4] : L[3]}
              </button>
            </div>
          </div>
          </div>
        )}

        {!loading && lesson && toolbarMinimized && (
          <div className="maqtab-reader-toolbar flex justify-end border-b shadow-sm px-3 py-1.5 pointer-events-none">
            <button
              type="button"
              onClick={() => setToolbarMinimized(false)}
              className="pointer-events-auto flex items-center gap-2 bg-teal-900/30 text-teal-900 border border-teal-900/20 rounded-full shadow px-3 h-9 text-xs font-bold backdrop-blur-sm"
              aria-label={L[11]}
              title={L[11]}
            >
              <span>{L[0]} {progress}%</span>
              <span className="text-gold-dark text-base leading-none">+</span>
            </button>
          </div>
        )}
      </div>
      <div aria-hidden="true" style={{ height: `${lessonHeaderHeight}px` }} />

      <div className="px-4 pt-4">
        {loading && <p className="text-ink-muted text-sm text-center py-8">{L[8]}</p>}

        {!loading && lesson && (
          <>
            <div ref={cardRef} className="maqtab-reader-surface fs-card relative px-5 py-6">
              <button onClick={toggleFullscreen} className="absolute top-3 right-3 z-10 bg-teal-900 text-white rounded-full w-10 h-10 flex items-center justify-center text-base shadow-lg" aria-label="Toggle fullscreen" title="Toggle fullscreen">
                {isFs ? 'X' : '[ ]'}
              </button>
              {lesson.arabic_text && (
                <p className="font-arabic text-2xl text-teal-900 leading-loose text-right mb-4 pr-10" style={{ fontSize: `${fontScale * 1.5}rem` }}>
                  {lesson.arabic_text}
                </p>
              )}
              <div
                className="qa-content lesson-content maqtab-lesson-content"
                style={{ '--lesson-font-scale': fontScale } as React.CSSProperties}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{trBody}</ReactMarkdown>
              </div>
            </div>
            <section className="maqtab-lesson-feedback" aria-label="Lesson feedback">
              <button
                type="button"
                onClick={toggleLike}
                disabled={feedbackBusy}
                className={`maqtab-feedback-action ${liked ? 'is-active' : ''}`}
                aria-pressed={liked}
              >
                <span aria-hidden="true">{liked ? '♥' : '♡'}</span>
                {L[12]} <strong>{likeCount}</strong>
              </button>
              <div className="maqtab-rating" aria-label={L[13]}>
                <span className="maqtab-rating-label">{L[13]}</span>
                <div className="maqtab-stars" role="radiogroup" aria-label={L[13]}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setLessonRating(star)}
                      disabled={feedbackBusy}
                      className={star <= (rating ?? 0) ? 'is-selected' : ''}
                      aria-label={`${star} star${star === 1 ? '' : 's'}`}
                      aria-pressed={star === rating}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <span className="maqtab-rating-summary">
                  {averageRating == null ? 'No ratings yet' : `${averageRating.toFixed(1)} / 5 · ${ratingCount} ${L[15]}`}
                </span>
              </div>
              <button type="button" onClick={shareLesson} className="maqtab-feedback-action">
                <span aria-hidden="true">↗</span>
                {L[14]}
              </button>
            </section>
          </>
        )}
      </div>

      {!loading && lesson && (
        <div className="maqtab-reader-footer fixed bottom-0 left-0 right-0 max-w-lg mx-auto border-t px-4 pt-3 pb-4 safe-bottom z-40">
          <p className="text-center text-xs font-semibold text-ink-muted mb-2">{L[7]}</p>
          <button onClick={() => navigate(`/maqtab/${lessonId}/quiz`)} className="w-full bg-teal-900 text-white font-bold rounded-xl py-3 text-sm">
            {L[6]} &rarr;
          </button>
        </div>
      )}
    </div>
  )
}
