// src/components/PdfViewer.tsx
// Full-screen in-app PDF reader (pdf.js via react-pdf). Renders every page in a
// vertical scroll — works offline in the Capacitor WebView and on web, no native
// plugin needed. The worker is bundled by Vite via the import.meta.url URL.
import { useEffect, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

export function PdfViewer({
  url,
  title,
  onClose,
}: {
  url: string
  title: string
  onClose: () => void
}) {
  const [numPages, setNumPages] = useState(0)
  const [width, setWidth] = useState(() => Math.min(window.innerWidth - 24, 820))

  useEffect(() => {
    const onResize = () => setWidth(Math.min(window.innerWidth - 24, 820))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div className="fixed inset-0 z-[70] bg-black/70 flex flex-col">
      <div className="flex items-center justify-between bg-teal-900 text-white px-4 py-3 shadow-lg">
        <span className="font-bold text-sm truncate pr-2">{title}</span>
        <button onClick={onClose} className="text-lg font-bold px-2" aria-label="Close">
          ✕
        </button>
      </div>
      <div className="flex-1 overflow-auto flex flex-col items-center gap-3 py-3">
        <Document
          file={url}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={<p className="text-white text-sm mt-10">Loading PDF…</p>}
          error={<p className="text-white text-sm mt-10 px-6 text-center">Couldn’t open the PDF. Make sure it exists at public/books/about.pdf.</p>}
        >
          {Array.from({ length: numPages }, (_, i) => (
            <Page
              key={i}
              pageNumber={i + 1}
              width={width}
              className="mb-3 shadow-lg"
              renderAnnotationLayer={false}
            />
          ))}
        </Document>
      </div>
    </div>
  )
}
