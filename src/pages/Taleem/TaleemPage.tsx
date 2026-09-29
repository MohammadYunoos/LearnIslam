// src/pages/Taleem/TaleemPage.tsx
// Islamic Q & A — volumes read from the `qa_volumes` table. Rendered as one
// continuous scroll (like a Maqtab lesson), styled Q/A/section markdown.
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { getQaVolumes, getQaVolume } from '../../services/supabaseService'
import { useLang, useTrList } from '../../i18n/useTr'
import { contentDbLang } from '../../i18n/contentLang'
import { openPdf } from '../../lib/openPdfNative'
import { openExternal } from '../../lib/external'
import { useAppStore } from '../../store/appStore'

// Supabase storage PDF (LearnIslam/About_Us/about.pdf)
const ABOUT_PDF = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/LearnIslam/About_Us/about.pdf`
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.mymaqtab.app'
const REVIEW_PROMPT_KEY = 'islamseeko_review_prompt_dismissed_at'
const REVIEW_ELIGIBLE_KEY = 'islamseeko_qa_volume_opened'
const REVIEW_PROMPT_INTERVAL_MS = 3 * 24 * 60 * 60 * 1000

interface VolumeMeta {
  id: string
  volume_no: number
  title: string
  language?: string
}

interface ReadingState {
  progress: number
  bookmark: number | null
  fontScale: number
}

const DEFAULT_READING_STATE: ReadingState = { progress: 0, bookmark: null, fontScale: 1 }
const FONT_SCALES = [0.85, 1, 1.15, 1.3]

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)))
}

type SegType = 'sec' | 'q' | 'a' | 'normal' | 'table'
interface Segment {
  type: SegType
  text: string
}

const toTitleCase = (str: string) =>
  str.replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\b[a-z]/g, (c) => c.toLowerCase())

const QUESTION_PREFIX_RE = /^(\s*(?:(?:#{1,6}|>)\s+)?(?:[-*+]\s+)?(?:\*\*|__)?)(q(?:uestion)?|s(?:a|u)wal|sual|سوال)(?=\s|\d|[.):\-]|[٠-٩۰-۹])\s*(?:(?:no\.?|number|نمبر)\s*)?([0-9٠-٩۰-۹]+)?\s*(?:[.):\-]\s*)?/i

const isQ = (p: string) => QUESTION_PREFIX_RE.test(p)
const isA = (p: string) =>
  /^a\s*[.):\-]/i.test(p) || /^ans(wer)?\b/i.test(p) || /^jawaa?b\b/i.test(p) || /^جواب(?:\s|[.):\-])/i.test(p)
const isSection = (p: string) => /^(section|hissa|bab)\b/i.test(p)

function parseQuestionNumber(value: string) {
  const normalized = value
    .replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))
    .replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
  return Number.parseInt(normalized, 10)
}

// The books are stored as Markdown and use a mix of "Q.", "Question:",
// "Sawal" and already-numbered prefixes. Add a visible sequence only where
// the source omitted one, while leaving authored numbers and Markdown intact.
function numberQaQuestions(markdown: string) {
  let nextQuestion = 1
  return markdown
    .split(/(\n{2,})/)
    .map((block) => {
      if (/^\n+$/.test(block)) return block
      const match = block.match(QUESTION_PREFIX_RE)
      if (!match) return block

      if (match[3]) {
        const authoredNumber = parseQuestionNumber(match[3])
        if (Number.isFinite(authoredNumber)) nextQuestion = Math.max(nextQuestion, authoredNumber + 1)
        return block
      }

      const label = match[2]
      const numberedPrefix = label.toLowerCase() === 'q'
        ? `${match[1]}Q${nextQuestion}. `
        : `${match[1]}${label} ${nextQuestion}. `
      nextQuestion += 1
      return block.replace(QUESTION_PREFIX_RE, numberedPrefix)
    })
    .join('')
}

// An all-caps subtitle line like "WELL-WATER" or "GLOSSARY OF TERMS" — a short
// heading with no lowercase letters. These must break out of the current answer
// and render as a highlighted section header.
function isCapsHead(b: string): boolean {
  const t = b.replace(/[*_#>`]/g, '').trim()
  if (t.length < 2 || t.length > 48 || t.includes('\n')) return false
  const letters = t.replace(/[^A-Za-z]/g, '')
  if (letters.length < 2 || letters !== letters.toUpperCase()) return false
  return /^[A-Z0-9 ()\-&'’.,/]+$/.test(t)
}

// Parse "term — meaning" / "term: meaning" pairs (one per line or ;-separated).
function glossaryRows(text: string): [string, string][] {
  const rows: [string, string][] = []
  for (const line of text.split(/\n|;/).map((s) => s.trim()).filter(Boolean)) {
    const m = line.replace(/^[-*\d.]+\s*/, '').match(/^(.+?)\s*(?:[—–:=]|\s-\s)\s*(.+)$/)
    if (m && m[1] && m[2]) rows.push([m[1].trim(), m[2].trim()])
  }
  return rows
}
function toTable(rows: [string, string][]): string {
  const esc = (s: string) => s.replace(/\|/g, '\\|')
  return [
    '| Term | Meaning |',
    '| --- | --- |',
    ...rows.map(([t, m]) => `| ${esc(t)} | ${esc(m)} |`),
  ].join('\n')
}

// Group markdown into styled segments; answers keep their styling across
// multiple paragraphs (until the next question / section / caps subtitle).
function classifySegments(md: string): Segment[] {
  const blocks = md
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean)
    .filter((b) => !/^(-{3,}|\*{3,}|_{3,})$/.test(b))
  const segs: Segment[] = []
  let answer: string[] | null = null
  let glossary: string[] | null = null // accumulating glossary body
  const flush = () => {
    if (answer && answer.length) segs.push({ type: 'a', text: answer.join('\n\n') })
    answer = null
  }
  const flushGlossary = () => {
    if (glossary && glossary.length) {
      const rows = glossaryRows(glossary.join('\n'))
      segs.push(rows.length ? { type: 'table', text: toTable(rows) } : { type: 'normal', text: glossary.join('\n\n') })
    }
    glossary = null
  }
  for (const b of blocks) {
    const plain = b.replace(/^[#>*_\s]+/, '').trim()
    const caps = isCapsHead(b)

    // A real markdown table (pipe rows) — render verbatim (e.g. a glossary).
    if (/(^|\n)\s*\|.*\|/.test(b)) {
      if (answer) {
        answer.push(b)
        continue
      }
      flushGlossary()
      segs.push({ type: 'table', text: b })
      continue
    }

    // While collecting a glossary, keep swallowing body blocks until a new
    // heading/question ends it.
    if (glossary) {
      if (caps || isSection(plain) || isQ(plain)) flushGlossary()
      else {
        glossary.push(b)
        continue
      }
    }

    if (caps && /^glossary/i.test(plain)) {
      flush()
      segs.push({ type: 'sec', text: b })
      glossary = []
    } else if (isSection(plain)) {
      flush()
      segs.push({ type: 'sec', text: b })
    } else if (isQ(plain)) {
      flush()
      segs.push({ type: 'q', text: b })
    } else if (isA(plain)) {
      flush()
      answer = [b]
    } else if (caps) {
      flush()
      segs.push({ type: 'sec', text: b }) // all-caps subtitle → highlighted header
    } else if (answer) {
      answer.push(b)
    } else {
      segs.push({ type: 'normal', text: b })
    }
  }
  flush()
  flushGlossary()
  return segs
}

const SEG_CLASS: Record<SegType, string> = {
  sec: 'qa-sec',
  q: 'qa-q',
  a: 'qa-a',
  normal: '',
  table: 'qa-table',
}

// Flatten a ReactMarkdown children tree to its text (for Q/A detection).
function childText(children: any): string {
  if (children == null) return ''
  if (typeof children === 'string') return children
  if (Array.isArray(children)) return children.map(childText).join('')
  if (typeof children === 'object' && children.props) return childText(children.props.children)
  return ''
}

// Custom renderers for the full-document markdown path: styled tables, in-doc
// TOC links that smooth-scroll, and Q/A/section colouring (kept identical).
const mdComponents = {
  a({ href, children }: any) {
    if (typeof href === 'string' && href.startsWith('#')) {
      return (
        <a
          href={href}
          onClick={(e: any) => {
            e.preventDefault()
            const el = document.getElementById(decodeURIComponent(href.slice(1)))
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }}
        >
          {children}
        </a>
      )
    }
    return (
      <a href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    )
  },
  table({ children }: any) {
    return (
      <div className="qa-table">
        <table>{children}</table>
      </div>
    )
  },
  p({ children }: any) {
    // Only colour the Q and Answer paragraphs; everything else is default
    // markdown (bold all-caps lines, ayah, notes, etc. render normally).
    const t = childText(children).trim()
    if (isQ(t)) return <div className="qa-q"><p>{children}</p></div>
    if (isA(t)) return <div className="qa-a"><p>{children}</p></div>
    return <p>{children}</p>
  },
}

// Segments already carry their Q/A class. Keep link and table behaviour inside
// grouped answers without wrapping their paragraphs in a second Q/A surface.
const segmentMdComponents = {
  a: mdComponents.a,
  table: mdComponents.table,
}

export function TaleemPage() {
  const user = useAppStore((state) => state.user)
  const [volumes, setVolumes] = useState<VolumeMeta[]>([])
  const [active, setActive] = useState(-1) // -1 = book list landing
  const [content, setContent] = useState<string | null>(null)
  const [loadingList, setLoadingList] = useState(true)
  const [loadingDoc, setLoadingDoc] = useState(false)
  const [openingReview, setOpeningReview] = useState(false)
  const [reviewError, setReviewError] = useState('')
  const [progress, setProgress] = useState(0)
  const [bookmark, setBookmark] = useState<number | null>(null)
  const [fontScale, setFontScale] = useState(1)
  const [progressSaved, setProgressSaved] = useState(false)
  const [toolbarMinimized, setToolbarMinimized] = useState(false)
  const [showReviewPrompt, setShowReviewPrompt] = useState(() => {
    const dismissedAt = Number(localStorage.getItem(REVIEW_PROMPT_KEY)) || 0
    const hasReadQa = localStorage.getItem(REVIEW_ELIGIBLE_KEY) === 'true'
    return hasReadQa && Date.now() - dismissedAt >= REVIEW_PROMPT_INTERVAL_MS
  })
  const cardRef = useRef<HTMLDivElement | null>(null)
  const progressRef = useRef(0)
  const restoredRef = useRef<string | null>(null)
  const restoringRef = useRef(true)
  const pageExitingRef = useRef(false)
  const [isFs, setIsFs] = useState(false)
  const lang = useLang()

  const activeId = volumes[active]?.id
  const storageKey = `qa_reading_${user?.id ?? 'guest'}_${activeId ?? 'none'}`
  const toolbarLabels = useTrList([
    'Completed',
    'Decrease font size',
    'Increase font size',
    'Save Progress',
    'Progress saved',
    'Go to saved progress',
    'Reading progress',
    'Minimize progress controls',
    'Show progress controls',
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
    if (!activeId) return
    try {
      const current = readSavedState()
      localStorage.setItem(storageKey, JSON.stringify({ ...current, ...next }))
    } catch {
      /* Reading remains available when device storage is unavailable. */
    }
  }

  const scrollToPercent = (percent: number, behavior: ScrollBehavior = 'smooth') => {
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
    window.scrollTo({ top: (maxScroll * percent) / 100, behavior })
  }

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

  const dismissReviewPrompt = () => {
    localStorage.setItem(REVIEW_PROMPT_KEY, String(Date.now()))
    setShowReviewPrompt(false)
  }

  const openVolume = (index: number) => {
    localStorage.setItem(REVIEW_ELIGIBLE_KEY, 'true')
    const dismissedAt = Number(localStorage.getItem(REVIEW_PROMPT_KEY)) || 0
    if (Date.now() - dismissedAt >= REVIEW_PROMPT_INTERVAL_MS) setShowReviewPrompt(true)
    restoredRef.current = null
    restoringRef.current = true
    pageExitingRef.current = false
    progressRef.current = 0
    setProgress(0)
    setBookmark(null)
    setFontScale(1)
    setProgressSaved(false)
    setToolbarMinimized(false)
    setActive(index)
  }

  const closeVolume = () => {
    pageExitingRef.current = true
    saveState({ progress: progressRef.current })
    setActive(-1)
    setContent(null)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  const changeFontScale = (direction: -1 | 1) => {
    const currentIndex = FONT_SCALES.indexOf(fontScale)
    const nextIndex = Math.max(0, Math.min(FONT_SCALES.length - 1, currentIndex + direction))
    const next = FONT_SCALES[nextIndex]
    setFontScale(next)
    saveState({ fontScale: next })
  }

  const saveProgress = () => {
    const next = progressRef.current
    setBookmark(next)
    saveState({ bookmark: next, progress: next })
    setProgressSaved(true)
    window.setTimeout(() => setProgressSaved(false), 1800)
  }

  async function handleOpenReview() {
    setOpeningReview(true)
    setReviewError('')
    try {
      await openExternal(PLAY_STORE_URL)
      dismissReviewPrompt()
    } catch (e) {
      console.error('Failed to open Play Store:', e)
      setReviewError('The Play Store could not be opened. Please try again.')
    } finally {
      setOpeningReview(false)
    }
  }

  // Load the volume list (re-fetch when language changes so we get the right rows).
  useEffect(() => {
    setLoadingList(true)
    getQaVolumes(contentDbLang(lang)).then((data) => {
      setVolumes((data ?? []) as VolumeMeta[])
      setActive(-1) // start on the book list
      setLoadingList(false)
    })
  }, [lang])

  // Load the active volume's content.
  useEffect(() => {
    if (!activeId) return
    let alive = true
    setLoadingDoc(true)
    setContent(null)
    getQaVolume(activeId).then((v) => {
      if (!alive) return
      setContent((v?.content_md as string) ?? '')
      setLoadingDoc(false)
    })
    return () => {
      alive = false
    }
  }, [activeId])

  const numberedContent = useMemo(() => numberQaQuestions(content ?? ''), [content])
  const segments = useMemo(() => classifySegments(numberedContent), [numberedContent])

  // A volume already served in the chosen language must NOT be MT-translated again.
  const activeLang = volumes[active]?.language
  const alreadyLocalized = !!activeLang && activeLang !== 'english'
  // Render the whole doc as one markdown tree (tables, TOC anchors, uniform)
  // when no runtime translation is needed. Only ur/hi (which have a proper
  // per-segment classifier) use the MT fallback; Roman-Urdu without a localized
  // sibling renders the english body raw rather than firing a book-sized MT
  // batch that hangs the app.
  const useRawDoc = alreadyLocalized || lang === 'en' || lang === 'ur-roman'
  const segTexts = useTrList(useRawDoc ? [] : segments.map((s) => s.text))

  useLayoutEffect(() => {
    if (!activeId || loadingDoc || content === null || restoredRef.current === storageKey) return
    if (!useRawDoc && segments.length > 0 && !segTexts.some((text) => text.trim())) return
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
    // Restore after the complete book body has rendered.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, loadingDoc, content, storageKey, useRawDoc, segments.length, segTexts])

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
    if (!activeId || loadingDoc || content === null) return
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, loadingDoc, content, storageKey])

  return (
    <div className="bg-cream min-h-screen pb-20 page-fade">
      <div className={activeId ? 'sticky top-0 z-40' : ''}>
        <PageHeader
          title="Islamic Q & A"
          subtitle={activeId ? undefined : 'Inspired by the famous book Taleem ul Islam'}
          backTo="/home"
          compact={!!activeId}
        />

        {activeId && !loadingDoc && content !== null && !toolbarMinimized && (
          <div className="bg-[#FFFDF7] border-b border-border shadow-sm px-2.5 py-1.5">
          <div className="flex items-center justify-between text-[10px] font-semibold mb-1">
            <span className="text-teal-900">{toolbarLabels[0]} {progress}%</span>
            <button
              type="button"
              onClick={() => setToolbarMinimized(true)}
              className="w-6 h-6 -my-0.5 border border-border bg-white text-teal-900 font-bold rounded-md"
              aria-label={toolbarLabels[7]}
              title={toolbarLabels[7]}
            >
              &minus;
            </button>
          </div>
          <div
            className="h-1 bg-sand rounded-full overflow-hidden"
            role="progressbar"
            aria-label={toolbarLabels[6]}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <div className="h-full bg-gold transition-[width] duration-150" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex items-center justify-between mt-1 gap-1">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => changeFontScale(-1)}
                disabled={fontScale === FONT_SCALES[0]}
                className="w-7 h-7 border border-border bg-white text-teal-900 text-xs font-bold rounded-md disabled:opacity-40"
                aria-label={toolbarLabels[1]}
                title={toolbarLabels[1]}
              >
                A-
              </button>
              <span className="w-8 text-center text-[10px] font-semibold text-ink-muted">{Math.round(fontScale * 100)}%</span>
              <button
                type="button"
                onClick={() => changeFontScale(1)}
                disabled={fontScale === FONT_SCALES[FONT_SCALES.length - 1]}
                className="w-7 h-7 border border-border bg-white text-teal-900 text-xs font-bold rounded-md disabled:opacity-40"
                aria-label={toolbarLabels[2]}
                title={toolbarLabels[2]}
              >
                A+
              </button>
            </div>
            <div className="min-w-0 flex-1 flex items-center justify-end gap-1">
              {bookmark != null && (
                <button
                  type="button"
                  onClick={() => scrollToPercent(bookmark)}
                  className="h-7 px-1.5 border border-gold bg-white text-gold-dark font-bold rounded-md text-[9px] leading-none whitespace-nowrap"
                  title={toolbarLabels[5]}
                >
                  {toolbarLabels[5]} {bookmark}%
                </button>
              )}
              <button
                type="button"
                onClick={saveProgress}
                className="h-7 px-2 bg-teal-900 text-white font-bold rounded-md text-[10px] leading-none whitespace-nowrap"
                title={toolbarLabels[3]}
              >
                {progressSaved ? toolbarLabels[4] : toolbarLabels[3]}
              </button>
            </div>
          </div>
          </div>
        )}

        {activeId && !loadingDoc && content !== null && toolbarMinimized && (
          <div className="flex justify-end bg-[#FFFDF7] border-b border-border shadow-sm px-2.5 py-1 pointer-events-none">
            <button
              type="button"
              onClick={() => setToolbarMinimized(false)}
              className="pointer-events-auto flex items-center gap-1.5 bg-teal-900/30 text-teal-900 border border-teal-900/20 rounded-full shadow px-2.5 h-8 text-[11px] font-bold backdrop-blur-sm"
              aria-label={toolbarLabels[8]}
              title={toolbarLabels[8]}
            >
              <span>{toolbarLabels[0]} {progress}%</span>
              <span className="text-gold-dark text-base leading-none">+</span>
            </button>
          </div>
        )}
      </div>

      <div className="px-4 pt-4">
        {loadingList && <p className="text-sm text-ink-muted text-center py-8">Loading…</p>}

        {!loadingList && volumes.length === 0 && (
          <p className="text-sm text-ink-muted text-center py-8">
            No volumes yet. Add a row to the qa_volumes table.
          </p>
        )}

        {/* Landing: list every book one below the other, About the Book first. */}
        {!loadingList && volumes.length > 0 && active < 0 && (
          <div className="space-y-3">
            <button
              onClick={() => openPdf(ABOUT_PDF, 'about.pdf')}
              className="glossy-gold w-full text-left rounded-full px-5 py-4 shadow-md border-2 border-gold flex items-center gap-3 active:scale-[0.98] transition-transform"
            >
              <span className="text-2xl">📖</span>
              <div>
                <p className="font-bold text-teal-900">About the Book</p>
                <p className="text-xs text-ink-muted">Read the introduction (PDF)</p>
              </div>
            </button>

            {showReviewPrompt && (
              <div className="bg-white border border-border rounded-lg px-5 py-4 shadow-sm">
                <p className="text-sm font-bold text-teal-900 mb-1">Rate Islam Seeko</p>
                <p className="text-xs text-ink-muted leading-relaxed mb-3">
                  Your honest Play Store feedback helps other learners and helps us improve. Rating is optional and does not unlock content.
                </p>
                {reviewError && <p className="text-xs text-red-600 mb-3">{reviewError}</p>}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleOpenReview}
                    disabled={openingReview}
                    className="bg-teal-900 text-white font-semibold py-2.5 rounded-lg text-sm disabled:opacity-50"
                  >
                    {openingReview ? 'Opening…' : 'Open Play Store'}
                  </button>
                  <button
                    onClick={dismissReviewPrompt}
                    className="bg-sand border border-border text-teal-900 font-semibold py-2.5 rounded-lg text-sm"
                  >
                    Not now
                  </button>
                </div>
              </div>
            )}

            {volumes.map((v, i) => {
              return (
                <div key={v.id}>
                  <button
                    onClick={() => openVolume(i)}
                    className="glossy-gold w-full text-left rounded-full px-5 py-4 shadow-md flex items-center gap-3 active:scale-[0.98] transition-transform"
                  >
                    <span className="text-2xl">📗</span>
                    <p className="font-bold text-teal-900">
                      Book {v.volume_no}: {toTitleCase(v.title)}
                    </p>
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* A single book's content. */}
        {volumes.length > 0 && active >= 0 && (
          <>
            <button
              onClick={closeVolume}
              className="mb-3 text-sm font-bold text-teal-900"
            >
              ← All books
            </button>
            <p className="text-base font-bold text-teal-900 mb-2">
              BOOK {volumes[active]?.volume_no}: {toTitleCase(volumes[active]?.title ?? '')}
            </p>
          <div
            ref={cardRef}
            className="fs-card relative rounded-2xl shadow-md border border-gold/30 bg-[#FFFDF7]"
          >
            <button
              onClick={toggleFullscreen}
              className="absolute top-3 right-3 z-10 bg-teal-900 text-white rounded-full w-10 h-10 flex items-center justify-center text-base shadow-lg"
              aria-label="Toggle fullscreen"
            >
              {isFs ? '🗕' : '⛶'}
            </button>
            {loadingDoc || content === null ? (
              <p className="text-sm text-ink-muted p-8">Loading volume…</p>
            ) : (
              <div
                className="qa-content lesson-content w-full px-5 py-6"
                style={{ '--lesson-font-scale': fontScale } as React.CSSProperties}
              >
                {lang !== 'en' && !alreadyLocalized && (
                  <p className="text-[10px] text-ink-muted italic mb-3">Auto-translated</p>
                )}
                {segments.map((s, i) => (
                  <div key={i} className={SEG_CLASS[s.type]}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeSlug]}
                      components={segmentMdComponents}
                    >
                      {useRawDoc || s.type === 'table' ? s.text : segTexts[i] ?? s.text}
                    </ReactMarkdown>
                  </div>
                ))}
              </div>
            )}
          </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
