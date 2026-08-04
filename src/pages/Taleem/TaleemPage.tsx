// src/pages/Taleem/TaleemPage.tsx
// Islamic Q & A — a series of PDF volumes stored in the `LearnIslam` bucket.
// Rendered in-app with react-pdf (works in the Android WebView). Add more
// volumes by appending to VOLUMES with the exact file name in the bucket.
import { useEffect, useMemo, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { supabase } from '../../lib/supabase'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

const BUCKET = 'LearnIslam'

interface Volume {
  no: number
  title: string
  file: string
}

// Add each uploaded volume here (exact file name in the bucket).
const VOLUMES: Volume[] = [
  { no: 1, title: 'Foundations of Islam', file: 'Volume_1_Foundations_of_Islam_Corrected_No_Generic_Answers.pdf' },
 { no: 2, title: 'Aqidah and Matters of Faith', file: 'Volume_2_Aqidah_and_Matters_of_Faith_Chapters_1_to_6.pdf' },
  { no: 3, title: 'Seerah and Islamic Character.pdf', file: 'Volume_3_Seerah_and_Islamic_Character_Enhanced.pdf' }
]

export function TaleemPage() {
  const [active, setActive] = useState(0)
  const [numPages, setNumPages] = useState(0)
  const [page, setPage] = useState(1)
  const [goto, setGoto] = useState('')
  const [error, setError] = useState(false)
  const [width, setWidth] = useState(Math.min(window.innerWidth, 500) - 32)

  const vol = VOLUMES[active]

  const url = useMemo(
    () => supabase.storage.from(BUCKET).getPublicUrl(vol.file).data.publicUrl,
    [vol.file]
  )
  const file = useMemo(() => ({ url }), [url])
  const options = useMemo(() => ({ disableAutoFetch: true, disableStream: false }), [])

  useEffect(() => {
    const onResize = () => setWidth(Math.min(window.innerWidth, 500) - 32)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Reset to page 1 when switching volumes.
  useEffect(() => {
    setPage(1)
    setNumPages(0)
    setError(false)
  }, [active])

  const clampPage = (n: number) => Math.max(1, Math.min(numPages || 1, n))

  const submitGoto = () => {
    const n = parseInt(goto, 10)
    if (!Number.isNaN(n)) setPage(clampPage(n))
    setGoto('')
  }

  return (
    <div className="bg-cream min-h-screen pb-28">
      <PageHeader title="Islamic Q & A" subtitle="Question & answer series" backTo="/home" />

      <div className="px-4 pt-4">
        {/* Volume switcher */}
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
          {VOLUMES.map((v, i) => (
            <button
              key={v.file}
              onClick={() => setActive(i)}
              className={`text-xs font-semibold px-3 py-2 rounded-xl whitespace-nowrap ${
                i === active
                  ? 'bg-teal-900 text-white'
                  : 'bg-white border border-border text-ink-muted'
              }`}
            >
              Vol {v.no}: {v.title}
            </button>
          ))}
        </div>

        <div className="bg-white border border-border rounded-2xl overflow-hidden flex justify-center min-h-[55vh]">
          {error ? (
            <p className="text-sm text-red-500 p-8 text-center">
              Could not load this volume. Check your connection and that the file exists in the
              bucket.
            </p>
          ) : (
            <Document
              file={file}
              options={options}
              onLoadSuccess={({ numPages }) => {
                setNumPages(numPages)
                setError(false)
              }}
              onLoadError={() => setError(true)}
              loading={<p className="text-sm text-ink-muted p-8">Loading volume…</p>}
            >
              <Page
                pageNumber={page}
                width={width}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                loading={<p className="text-sm text-ink-muted p-8">Loading page…</p>}
              />
            </Document>
          )}
        </div>
      </div>

      {/* Page controls */}
      {numPages > 0 && !error && (
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
