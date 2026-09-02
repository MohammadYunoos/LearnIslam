// src/pages/Maqtab/CertificatePage.tsx
// Shown after passing the Beginner exam. Draws a canvas certificate, plays a
// fanfare, and lets the user download / share it. Guarded by a real passing
// attempt on the server (not just navigation).
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { useAppStore } from '../../store/appStore'
import { getExamAttempts } from '../../services/supabaseService'
import {
  drawCertificate,
  saveCertificate,
  shareCertificate,
  playFanfare,
  type CertData,
} from '../../lib/certificate'
import { useTr } from '../../i18n/useTr'

const APP_LINK = 'https://islamseekho.app' // dummy download link (placeholder)

export function CertificatePage() {
  const navigate = useNavigate()
  const user = useAppStore((s) => s.user)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [ready, setReady] = useState(false)
  const [checking, setChecking] = useState(true)

  const tCongrats = useTr('Mubarak ho! 🎉')
  const tBody = useTr('You have successfully completed the Beginner section and earned your certificate.')
  const tDownload = useTr('Download')
  const tShare = useTr('Share')
  const tChecking = useTr('Loading…')
  const tLocked = useTr('Pass the Beginner exam first to unlock your certificate.')
  const tGoExam = useTr('Go to exam')

  // Verify a passing attempt on the server; take the best % for the cert.
  useEffect(() => {
    let alive = true
    getExamAttempts('Beginner')
      .then((attempts) => {
        if (!alive) return
        const passed = (attempts ?? []).filter((a) => a.passed)
        if (!passed.length) {
          setReady(false)
          setChecking(false)
          return
        }
        const bestPercent = Math.max(...passed.map((a) => a.percent))
        // Prefer the stored pass snapshot (name/date) if present.
        let data: CertData = {
          name: user?.name ?? 'Student',
          percent: bestPercent,
          date: new Date().toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }),
        }
        try {
          const raw = localStorage.getItem('exam_pass_beginner')
          if (raw) {
            const s = JSON.parse(raw)
            data = {
              name: s.name || data.name,
              percent: s.percent ?? bestPercent,
              date: new Date(s.date || Date.now()).toLocaleDateString([], {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              }),
            }
          }
        } catch {
          /* use server-derived data */
        }
        setReady(true)
        setChecking(false)
        // Draw after the canvas mounts.
        requestAnimationFrame(() => {
          if (canvasRef.current) drawCertificate(canvasRef.current, data)
        })
        playFanfare()
      })
      .catch(() => {
        if (alive) {
          setReady(false)
          setChecking(false)
        }
      })
    return () => {
      alive = false
    }
  }, [user])

  const shareText = `Alhamdulillah! I completed the Beginner section on Islam Seeko and earned my certificate. Learn with me — download the app: ${APP_LINK}`

  return (
    <div className="bg-cream min-h-screen pb-24">
      <PageHeader title="Certificate" subtitle="Beginner completed" backTo="/maqtab" />

      <div className="px-4 pt-4 space-y-4">
        {checking && <p className="text-ink-muted text-sm text-center py-8">{tChecking}</p>}

        {!checking && !ready && (
          <div className="bg-white border border-border rounded-2xl p-6 text-center">
            <p className="text-sm text-ink-muted mb-4">{tLocked}</p>
            <button
              onClick={() => navigate('/maqtab/exam')}
              className="bg-teal-900 text-white font-bold rounded-xl py-2.5 px-6 text-sm"
            >
              {tGoExam}
            </button>
          </div>
        )}

        {!checking && ready && (
          <>
            <div className="text-center">
              <p className="text-2xl font-arabic font-bold text-teal-900">{tCongrats}</p>
              <p className="text-sm text-ink-muted mt-1 px-6">{tBody}</p>
            </div>

            <div className="bg-white border border-border rounded-2xl p-3 shadow-md overflow-hidden">
              <canvas ref={canvasRef} className="w-full h-auto rounded-lg" />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => canvasRef.current && saveCertificate(canvasRef.current)}
                className="flex-1 bg-teal-900 text-white font-bold rounded-xl py-3 text-sm"
              >
                ⬇ {tDownload}
              </button>
              <button
                onClick={() => canvasRef.current && shareCertificate(canvasRef.current, shareText)}
                className="flex-1 glossy-gold font-bold rounded-xl py-3 text-sm shadow"
              >
                📤 {tShare}
              </button>
            </div>

            <p className="text-[11px] text-ink-muted text-center px-6">
              Share on WhatsApp, Facebook and more. App link: {APP_LINK}
            </p>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
