// src/pages/Taleem/TaleemPage.tsx
// Islamic Q & A — volumes read from the `qa_volumes` table. Rendered as one
// continuous scroll (like a Maqtab lesson), styled Q/A/section markdown.
import { useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { getQaVolumes, getQaVolume } from '../../services/supabaseService'
import { useLang, useTrList } from '../../i18n/useTr'
import { contentDbLang } from '../../i18n/contentLang'

interface VolumeMeta {
  id: string
  volume_no: number
  title: string
  language?: string
}

type SegType = 'sec' | 'q' | 'a' | 'normal'
interface Segment {
  type: SegType
  text: string
}

// Group markdown into styled segments; answers keep their styling across
// multiple paragraphs (until the next question or section).
function classifySegments(md: string): Segment[] {
  const blocks = md
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean)
    // Drop markdown horizontal-rule separators (---, ***, ___) — they otherwise
    // get pulled into the preceding answer and render as stray lines.
    .filter((b) => !/^(-{3,}|\*{3,}|_{3,})$/.test(b))
  const segs: Segment[] = []
  let answer: string[] | null = null
  const flush = () => {
    if (answer && answer.length) segs.push({ type: 'a', text: answer.join('\n\n') })
    answer = null
  }
  for (const b of blocks) {
    const plain = b.replace(/^[#>*_\s]+/, '').trim()
    // Markers: English (Section / Q. / A.) + Roman-Urdu (Hissa / Bab / Sawal / Jawab).
    if (/^(section|hissa|bab)\b/i.test(plain)) {
      flush()
      segs.push({ type: 'sec', text: b })
    } else if (
      /^q\s*\d*\s*[.):\-]/i.test(plain) ||
      /^question\b/i.test(plain) ||
      /^s(a|u)wal\b/i.test(plain) ||
      /^sual\b/i.test(plain)
    ) {
      flush()
      segs.push({ type: 'q', text: b })
    } else if (
      /^a\s*[.):\-]/i.test(plain) ||
      /^ans(wer)?\b/i.test(plain) ||
      /^jawaa?b\b/i.test(plain)
    ) {
      flush()
      answer = [b]
    } else if (answer) {
      answer.push(b)
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

export function TaleemPage() {
  const [volumes, setVolumes] = useState<VolumeMeta[]>([])
  const [active, setActive] = useState(0)
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
      setActive(0)
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
  const segTexts = useTrList(segments.map((s) => s.text))

  // A volume already served in the chosen language must NOT be MT-translated again.
  const activeLang = volumes[active]?.language
  const alreadyLocalized = !!activeLang && activeLang !== 'english'

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
                {segments.map((s, i) => (
                  <div key={i} className={SEG_CLASS[s.type]}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {alreadyLocalized ? s.text : segTexts[i] ?? s.text}
                    </ReactMarkdown>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
