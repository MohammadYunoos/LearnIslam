// src/pages/Taleem/TaleemPage.tsx
// Islamic Q & A — volumes read from the `qa_volumes` table. Rendered as one
// continuous scroll (like a Maqtab lesson), styled Q/A/section markdown.
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { getQaVolumes, getQaVolume } from '../../services/supabaseService'
import { useLang, useTrList } from '../../i18n/useTr'
import { contentDbLang } from '../../i18n/contentLang'
// Lazy — pulls pdf.js only when the user opens "About the Book".
const PdfViewer = lazy(() =>
  import('../../components/PdfViewer').then((m) => ({ default: m.PdfViewer }))
)

// Bundled introduction PDF (drop the file at public/books/about.pdf).
const ABOUT_PDF = `${import.meta.env.BASE_URL}books/about.pdf`

interface VolumeMeta {
  id: string
  volume_no: number
  title: string
  language?: string
}

type SegType = 'sec' | 'q' | 'a' | 'normal' | 'table'
interface Segment {
  type: SegType
  text: string
}

const isQ = (p: string) =>
  /^q\s*\d*\s*[.):\-]/i.test(p) ||
  /^question\b/i.test(p) ||
  /^s(a|u)wal\b/i.test(p) ||
  /^sual\b/i.test(p)
const isA = (p: string) => /^a\s*[.):\-]/i.test(p) || /^ans(wer)?\b/i.test(p) || /^jawaa?b\b/i.test(p)
const isSection = (p: string) => /^(section|hissa|bab)\b/i.test(p)

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
      flush()
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

export function TaleemPage() {
  const [volumes, setVolumes] = useState<VolumeMeta[]>([])
  const [active, setActive] = useState(-1) // -1 = book list landing
  const [content, setContent] = useState<string | null>(null)
  const [loadingList, setLoadingList] = useState(true)
  const [loadingDoc, setLoadingDoc] = useState(false)
  const cardRef = useRef<HTMLDivElement | null>(null)
  const [isFs, setIsFs] = useState(false)
  const lang = useLang()

  useEffect(() => {
    const onChange = () => setIsFs(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])
  const [showAbout, setShowAbout] = useState(false)
  const toggleFullscreen = () => {
    try {
      if (document.fullscreenElement) document.exitFullscreen()
      else cardRef.current?.requestFullscreen?.()
    } catch {
      /* WebView may not support fullscreen */
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
  const activeId = volumes[active]?.id
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

  const segments = useMemo(() => classifySegments(content ?? ''), [content])

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

  return (
    <div className="bg-cream min-h-screen pb-20 page-fade">
      <PageHeader
        title="Islamic Q & A"
        subtitle="Inspired by the famous book Taleem ul Islam"
        backTo="/home"
      />

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
              onClick={() => setShowAbout(true)}
              className="glossy-purple w-full text-left rounded-full px-5 py-4 shadow-md border-2 border-gold flex items-center gap-3 active:scale-[0.98] transition-transform"
            >
              <span className="text-2xl">📖</span>
              <div>
                <p className="font-bold text-teal-900">About the Book</p>
                <p className="text-xs text-ink-muted">Read the introduction (PDF)</p>
              </div>
            </button>

            {volumes.map((v, i) => (
              <button
                key={v.id}
                onClick={() => setActive(i)}
                className="glossy-purple w-full text-left rounded-full px-5 py-4 shadow-md flex items-center gap-3 active:scale-[0.98] transition-transform"
              >
                <span className="text-2xl">📗</span>
                <p className="font-bold text-teal-900">
                  Book {v.volume_no}: {v.title}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* A single book's content. */}
        {volumes.length > 0 && active >= 0 && (
          <>
            <button
              onClick={() => setActive(-1)}
              className="mb-3 text-sm font-bold text-teal-900"
            >
              ← All books
            </button>
            <p className="text-base font-bold text-teal-900 mb-2">
              Book {volumes[active]?.volume_no}: {volumes[active]?.title}
            </p>
          <div
            ref={cardRef}
            className="fs-card relative rounded-2xl shadow-md border border-gold/30 bg-[#FFFDF7]"
          >
            <button
              onClick={toggleFullscreen}
              className="fixed top-24 right-4 z-50 bg-teal-900 text-white rounded-full w-10 h-10 flex items-center justify-center text-base shadow-lg"
              aria-label="Toggle fullscreen"
            >
              {isFs ? '🗕' : '⛶'}
            </button>
            {loadingDoc || content === null ? (
              <p className="text-sm text-ink-muted p-8">Loading volume…</p>
            ) : (
              <div className="qa-content w-full px-5 py-6">
                {lang !== 'en' && !alreadyLocalized && (
                  <p className="text-[10px] text-ink-muted italic mb-3">Auto-translated</p>
                )}
                {useRawDoc ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeSlug]}
                    components={mdComponents}
                  >
                    {content}
                  </ReactMarkdown>
                ) : (
                  segments.map((s, i) => (
                    <div key={i} className={SEG_CLASS[s.type]}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {s.type === 'table' ? s.text : segTexts[i] ?? s.text}
                      </ReactMarkdown>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          </>
        )}
      </div>

      {showAbout && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-[70] bg-black/70 flex items-center justify-center text-white text-sm">
              Loading PDF…
            </div>
          }
        >
          <PdfViewer
            url={new URL(ABOUT_PDF, window.location.href).href}
            title="About the Book"
            onClose={() => setShowAbout(false)}
          />
        </Suspense>
      )}

      <BottomNav />
    </div>
  )
}
