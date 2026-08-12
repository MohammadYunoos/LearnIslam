// src/components/ReportButton.tsx
// Floating "Report / suggest correction" button for Ulema + testers.
// Saves to the feedback table with the current screen captured automatically.
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import { sendFeedback } from '../services/supabaseService'

export function ReportButton() {
  const location = useLocation()
  const user = useAppStore((s) => s.user)
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)

  // Hidden on the login screen.
  if (location.pathname.startsWith('/login')) return null

  const submit = async () => {
    if (!message.trim()) return
    setSending(true)
    try {
      await sendFeedback({
        userId: user?.id,
        userName: user?.name,
        screen: location.pathname,
        message: message.trim(),
      })
      setDone(true)
      setMessage('')
    } catch {
      /* ignore */
    } finally {
      setSending(false)
    }
  }

  const close = () => {
    setOpen(false)
    setDone(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-3 z-40 bg-white border border-gold text-gold-dark rounded-full shadow-md px-3 py-2 text-xs font-bold"
        aria-label="Report or suggest correction"
      >
        ⚑ Report
      </button>

      {open && (
        <div className="fixed inset-0 z-[58] bg-black/50 flex items-end sm:items-center justify-center px-4 pb-24">
          <div className="bg-cream rounded-2xl p-5 w-full max-w-sm">
            {done ? (
              <div className="text-center py-4">
                <p className="text-3xl mb-2">✅</p>
                <p className="text-sm text-ink">JazakAllah — feedback sent for review.</p>
                <button
                  onClick={close}
                  className="mt-4 bg-teal-900 text-white font-bold rounded-xl py-2.5 px-6 text-sm"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm font-bold text-teal-900 mb-1">Report / suggest correction</p>
                <p className="text-[11px] text-ink-muted mb-3">Screen: {location.pathname}</p>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Describe the issue or a correction to the content…"
                  className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-teal-700 mb-3"
                />
                <div className="flex gap-2">
                  <button
                    onClick={submit}
                    disabled={sending || !message.trim()}
                    className="flex-1 bg-teal-900 text-white font-bold rounded-xl py-2.5 text-sm disabled:opacity-50"
                  >
                    {sending ? 'Sending…' : 'Send'}
                  </button>
                  <button
                    onClick={close}
                    className="bg-white border border-border text-ink-muted font-bold rounded-xl py-2.5 px-4 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
