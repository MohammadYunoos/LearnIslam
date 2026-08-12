// src/pages/Taleem/TaleemPage.tsx
// Islamic Q & A — volumes read from the `qa_volumes` table (like Maqtab).
// Each volume's markdown is paginated and rendered with react-markdown.
import { useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { getQaVolumes, getQaVolume } from '../../services/supabaseService'
import { useLang, useTrList } from '../../i18n/useTr'

interface VolumeMeta {
  id: string
  volume_no: number
  title: string
}

type SegType = 'sec' | 'q' | 'a' | 'normal'
interface Segment {
  type: SegType
  text: string
}

// Group a page's markdown into segments so Q/A/section blocks can be styled,
// and answers keep their styling across multiple paragraphs (until the next
// question or section).
function classifySegments(md: string): Segment[] {
  const blocks = md.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean)
  const segs: Segment[] = []
  let answer: string[] | null = null
  const flush = () => {
    if (answer && answer.length) segs.push({ type: 'a', text: answer.join('\n\n') })
    answer = null
  }
  for (const b of blocks) {
    const plain = b.replace(/^[#>*_\s]+/, '').trim() // ignore leading md markers
    if (/^section\b/i.test(plain)) {
      flush()
      segs.push({ type: 'sec', text: b })
    } else if (/^q\s*\d*\s*[.):\-]/i.test(plain) || /^question\b/i.test(plain)) {
      flush()
      segs.push({ type: 'q', text: b })
    } else if (/^a\s*[.):\-]/i.test(plain) || /^ans(wer)?\b/i.test(plain)) {
      flush()
      answer = [b]
    } else if (answer) {
      answer.push(b) // continuation of the current answer
    } else {
      segs.push({ type: 'normal', text: b })
    }
  }
  flush()
  return segs
}

const SEG_CLASS: Record<SegType, string> = {
  sec: 'qa-sec',
  q: 'qa-q',
  a: 'qa-a',
  normal: '',
}

// Paginate already-classified segments (~1500 chars/page) so Q/A/section styling
// — including multi-paragraph answers — is preserved across page breaks.
function paginateSegments(segs: Segment[]): Segment[][] {
  const pages: Segment[][] = []
  let cur: Segment[] = []
  let len = 0
  for (const s of segs) {
    if (len > 0 && len + s.text.length > 1500) {
      pages.push(cur)
      cur = []
      len = 0
    }
    cur.push(s)
    len += s.text.length
  }
  if (cur.length) pages.push(cur)
  return pages.length ? pages : [[]]
}

export function TaleemPage() {
  const [volumes, setVolumes] = useState<VolumeMeta[]>([])
  const [active, setActive] = useState(0)
  const [content, setContent] = useState<string | null>(null)
  const [pages, setPages] = useState<Segment[][]>([])
  const [page, setPage] = useState(1)
  const [goto, setGoto] = useState('')
  const [loadingList, setLoadingList] = useState(true)
  const [loadingDoc, setLoadingDoc] = useState(false)

  // Load the volume list once.
  useEffect(() => {
    getQaVolumes().then((data) => {
      setVolumes((data ?? []) as VolumeMeta[])
      setLoadingList(false)
    })
  }, [])

  // Load the active volume's content.
  const activeId = volumes[active]?.id
  useEffect(() => {
    if (!activeId) return
    let alive = true
    setLoadingDoc(true)
    setContent(null)
    getQaVolume(activeId).then((v) => {
      if (!alive) return
      const md = (v?.content_md as string) ?? ''
      setContent(md)
      setPages(paginateSegments(classifySegments(md)))
      setPage(1)
      setLoadingDoc(false)
    })
    return () => {
      alive = false
    }
  }, [activeId])

  const numPages = pages.length
  const clampPage = (n: number) => Math.max(1, Math.min(numPages || 1, n))
  const submitGoto = () => {
    const n = parseInt(goto, 10)
    if (!Number.isNaN(n)) setPage(clampPage(n))
    setGoto('')
  }

  const segments = useMemo(() => pages[page - 1] ?? [], [pages, page])
  const lang = useLang()
  const segTexts = useTrList(segments.map((s) => s.text))

  return (
    <div className="bg-cream min-h-screen pb-48">
      <PageHeader title="Islamic Q & A" subtitle="Inspired by the famous book Taleem ul islaam" backTo="/home" />

      <div className="px-4 pt-4">
        {loadingList && <p className="text-sm text-ink-muted text-center py-8">Loading…</p>}

        {!loadingList && volumes.length === 0 && (
          <p className="text-sm text-ink-muted text-center py-8">
            No volumes yet. Add a row to the qa_volumes table.
          </p>
        )}

        {/* Volume switcher */}
        {volumes.length > 0 && (
          <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
            {volumes.map((v, i) => (
              <button
                key={v.id}
                onClick={() => setActive(i)}
                className={`text-xs font-semibold px-3 py-2 rounded-xl whitespace-nowrap ${
                  i === active
                    ? 'bg-teal-900 text-white'
                    : 'bg-white border border-border text-ink-muted'
                }`}
              >
                Vol {v.volume_no}: {v.title}
              </button>
            ))}
          </div>
        )}

        {volumes.length > 0 && (
          <div className="rounded-2xl overflow-hidden min-h-[55vh] shadow-md border border-gold/30 bg-[#FFFDF7]">
            {loadingDoc || content === null ? (
              <p className="text-sm text-ink-muted p-8">Loading volume…</p>
            ) : (
              <div key={page} className="qa-content w-full px-5 py-6 overflow-auto">
                {lang !== 'en' && (
                  <p className="text-[10px] text-ink-muted italic mb-3">Auto-translated</p>
                )}
                {segments.map((s, i) => (
                  <div key={i} className={SEG_CLASS[s.type]}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{segTexts[i] ?? s.text}</ReactMarkdown>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Page controls */}
      {numPages > 1 && !loadingDoc && (
        <div className="fixed bottom-16 left-0 right-0 max-w-lg mx-auto bg-cream border-t border-border p-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => setPage((p) => clampPage(p - 1))}
              disabled={page <= 1}
              className="bg-white border border-border text-teal-900 font-bold rounded-xl py-2.5 px-4 text-sm disabled:opacity-40"
            >
              ← Prev
            </button>
            <span className="text-sm font-semibold text-teal-900">
              {page} / {numPages}
            </span>
            <button
              onClick={() => setPage((p) => clampPage(p + 1))}
              disabled={page >= numPages}
              className="bg-white border border-border text-teal-900 font-bold rounded-xl py-2.5 px-4 text-sm disabled:opacity-40"
            >
              Next →
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              value={goto}
              onChange={(e) => setGoto(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitGoto()}
              placeholder={`Go to page (1–${numPages})`}
              className="flex-1 border border-border rounded-xl px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-teal-700"
            />
            <button
              onClick={submitGoto}
              className="bg-gold text-teal-900 font-bold rounded-xl px-5 py-2 text-sm"
            >
              Go
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
