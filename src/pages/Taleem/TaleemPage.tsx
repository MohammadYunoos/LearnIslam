// src/pages/Taleem/TaleemPage.tsx
import { useEffect, useMemo, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { supabase } from '../../lib/supabase'

// Bundle the pdf.js worker as a relative asset so it resolves inside the APK.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

const BUCKET = 'LearnIslam'

const BOOKS = [
  {
    title: 'Taleem ul Islam (English)',
    author: 'Shaykh Mufti Kifayatullah (r.a.)',
    file: 'Taleem-ul-Islam-English-ByShaykhMuftiKifayatullahr.pdf',
  },
]

export function TaleemPage() {
  const [active] = useState(0)
  const [numPages, setNumPages] = useState(0)
  const [page, setPage] = useState(1)
  const [error, setError] = useState(false)
  const [width, setWidth] = useState(Math.min(window.innerWidth, 500) - 32)

  const book = BOOKS[active]

  const url = useMemo(
    () => supabase.storage.from(BUCKET).getPublicUrl(book.file).data.publicUrl,
    [book.file]
  )
  // Memoised so react-pdf does not reload the doc every render.
  const file = useMemo(() => ({ url }), [url])
  const options = useMemo(() => ({ disableAutoFetch: true, disableStream: false }), [])

  useEffect(() => {
    const onResize = () => setWidth(Math.min(window.innerWidth, 500) - 32)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div className="bg-cream min-h-screen pb-28">
      <PageHeader title="Taleem ul Islam" subtitle={book.author} backTo="/home" />

      <div className="px-4 pt-4">
        <div className="bg-white border border-border rounded-2xl overflow-hidden flex justify-center min-h-[60vh]">
          {error ? (
            <p className="text-sm text-red-500 p-8 text-center">
              Could not load the book. Check your connection and try again.
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
              loading={<p className="text-sm text-ink-muted p-8">Loading book…</p>}
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

      {/* Page navigator */}
      {numPages > 0 && !error && (
        <div className="fixed bottom-16 left-0 right-0 max-w-lg mx-auto bg-cream border-t border-border p-3 flex items-center justify-between gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="bg-white border border-border text-teal-900 font-bold rounded-xl py-2.5 px-5 text-sm disabled:opacity-40"
          >
            ← Prev
          </button>
          <span className="text-sm font-semibold text-teal-900">
            {page} / {numPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(numPages, p + 1))}
            disabled={page >= numPages}
            className="bg-white border border-border text-teal-900 font-bold rounded-xl py-2.5 px-5 text-sm disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
