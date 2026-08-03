// src/pages/Masail/MasailPage.tsx
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { useAppStore } from '../../store/appStore'
import { askMasail } from '../../services/supabaseService'

const FREE_LIMIT = 5
const USAGE_KEY = 'mymaqtab_masail_usage'

const MADHAB_LABEL: Record<string, string> = {
  hanafi: 'Hanafi',
  shafi: "Shafi'i",
  maliki: 'Maliki',
  hanbali: 'Hanbali',
  salafi: 'Salafi',
}

interface Msg {
  role: 'user' | 'assistant'
  text: string
}

function currentMonthKey() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}`
}

function getUsage(): number {
  try {
    const raw = JSON.parse(localStorage.getItem(USAGE_KEY) ?? '{}')
    return raw.month === currentMonthKey() ? raw.count ?? 0 : 0
  } catch {
    return 0
  }
}

function bumpUsage() {
  const count = getUsage() + 1
  localStorage.setItem(USAGE_KEY, JSON.stringify({ month: currentMonthKey(), count }))
  return count
}

export function MasailPage() {
  const user = useAppStore((s) => s.user)
  const isPremium = user?.tier === 'premium'
  const madhabLabel = MADHAB_LABEL[user?.madhab ?? 'hanafi'] ?? 'Hanafi'
  const [params] = useSearchParams()
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState(params.get('q') ?? '')
  const [loading, setLoading] = useState(false)
  const [usage, setUsage] = useState(getUsage())

  const limitReached = !isPremium && usage >= FREE_LIMIT

  const send = async () => {
    const question = input.trim()
    if (!question || loading || limitReached) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', text: question }])
    setLoading(true)
    try {
      const answer = await askMasail(question, user?.madhab ?? 'hanafi')
      setMessages((m) => [...m, { role: 'assistant', text: answer }])
      if (!isPremium) setUsage(bumpUsage())
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'assistant', text: 'Unable to answer right now. Please consult your local Alim.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-cream min-h-screen pb-40 flex flex-col">
      <PageHeader title="Masail" subtitle="Basic fiqh questions" backTo="/home" />

      <div className="px-4 pt-4 flex-1 space-y-3">
        {messages.length === 0 && (
          <div className="bg-white border border-border rounded-2xl p-5 text-center">
            <p className="text-3xl mb-2">❓</p>
            <p className="text-sm text-ink leading-relaxed mb-3">
              Ask a basic question about Wudhu, Gusl, Tayammum, Namaaz or daily Adaab. For anything
              beyond basic fiqh, please consult your local Alim.
            </p>
            <span className="inline-block text-[11px] font-bold text-teal-900 bg-teal-500/10 border border-teal-500/20 rounded-full px-3 py-1">
              ✓ Answers according to your selected fiqh: {madhabLabel}
            </span>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              m.role === 'user'
                ? 'bg-teal-900 text-white ml-auto rounded-br-sm'
                : 'bg-white border border-border text-ink rounded-bl-sm'
            }`}
          >
            {m.text}
          </div>
        ))}

        {loading && (
          <div className="bg-white border border-border rounded-2xl px-4 py-2.5 text-sm text-ink-muted w-max">
            Thinking…
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="fixed bottom-16 left-0 right-0 max-w-lg mx-auto bg-cream border-t border-border p-3">
        {!isPremium && (
          <p className="text-[11px] text-ink-muted text-center mb-2">
            {limitReached
              ? 'Free monthly limit reached. Upgrade to premium for unlimited questions.'
              : `${FREE_LIMIT - usage} free question${FREE_LIMIT - usage === 1 ? '' : 's'} left this month`}
          </p>
        )}
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            disabled={limitReached}
            placeholder={limitReached ? 'Monthly limit reached' : 'Type your question…'}
            className="flex-1 border border-border rounded-xl px-4 py-2.5 text-sm bg-white text-ink focus:outline-none focus:border-teal-700 disabled:opacity-60"
          />
          <button
            onClick={send}
            disabled={loading || limitReached || !input.trim()}
            className="bg-gold text-teal-900 font-bold rounded-xl px-5 text-sm disabled:opacity-50"
          >
            Ask
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
