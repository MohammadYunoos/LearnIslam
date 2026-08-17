// src/pages/Admin/TranslationsPage.tsx
// Admin editor to curate translation wording (Urdu / Roman Urdu). Overrides win
// over machine translation because /translate reads the translations table first.
import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { isAdmin } from '../../lib/admin'
import { setTranslation, listTranslations, getFeedback } from '../../services/supabaseService'
import { clearCached } from '../../services/translate'

interface Row {
  hash: string
  target_lang: string
  source_text: string
  translated_text: string
}

const TARGETS = [
  { code: 'ur', label: 'Urdu (script)' },
  { code: 'ur-roman', label: 'Roman Urdu' },
  { code: 'hi', label: 'Hindi' },
]

export function TranslationsPage() {
  const [allowed, setAllowed] = useState<boolean | null>(null)
  const [target, setTarget] = useState('ur-roman')
  const [source, setSource] = useState('')
  const [text, setText] = useState('')
  const [saving, setSaving] = useState(false)
  const [rows, setRows] = useState<Row[]>([])
  const [feedback, setFeedback] = useState<{ message: string; screen?: string }[]>([])

  const load = () => {
    listTranslations(target).then((d) => setRows((d ?? []) as Row[]))
  }

  useEffect(() => {
    isAdmin().then((ok) => {
      setAllowed(ok)
      if (ok) {
        getFeedback().then((d) => setFeedback((d ?? []) as any))
      }
    })
  }, [])
  useEffect(() => {
    if (allowed) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowed, target])

  const save = async () => {
    if (!source.trim() || !text.trim()) return
    setSaving(true)
    try {
      await setTranslation(target, source.trim(), text.trim())
      clearCached(target, source.trim())
      setSource('')
      setText('')
      load()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-cream min-h-screen pb-20">
      <PageHeader title="Translations" subtitle="Curate Urdu / Roman wording" backTo="/settings" />

      <div className="px-4 pt-4">
        {allowed === false && (
          <p className="text-sm text-ink-muted text-center py-10">Not authorized.</p>
        )}

        {allowed && (
          <>
            <div className="bg-white border border-border rounded-2xl p-4 mb-4 space-y-3">
              <div className="flex gap-2">
                {TARGETS.map((t) => (
                  <button
                    key={t.code}
                    onClick={() => setTarget(t.code)}
                    className={`text-xs font-bold px-3 py-2 rounded-xl border ${
                      target === t.code
                        ? 'bg-teal-900 text-white border-teal-900'
                        : 'bg-white text-ink-muted border-border'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <textarea
                value={source}
                onChange={(e) => setSource(e.target.value)}
                rows={2}
                placeholder="English source text (paste exactly as shown in the app)"
                className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-teal-700"
              />
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={2}
                dir={target === 'ur' ? 'rtl' : 'ltr'}
                placeholder="Correct wording"
                className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-teal-700"
              />
              <button
                onClick={save}
                disabled={saving || !source.trim() || !text.trim()}
                className="w-full bg-teal-900 text-white font-bold rounded-xl py-2.5 text-sm disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save override'}
              </button>
            </div>

            {feedback.length > 0 && (
              <>
                <p className="text-xs font-bold text-ink-muted uppercase tracking-widest mb-2">
                  Tester reports
                </p>
                <div className="bg-white border border-border rounded-2xl divide-y divide-border mb-4">
                  {feedback.slice(0, 15).map((f, i) => (
                    <button
                      key={i}
                      onClick={() => setSource(f.message)}
                      className="w-full text-left px-4 py-2.5"
                    >
                      <p className="text-sm text-ink">{f.message}</p>
                      {f.screen && <p className="text-[10px] text-gold-dark">{f.screen}</p>}
                    </button>
                  ))}
                </div>
              </>
            )}

            <p className="text-xs font-bold text-ink-muted uppercase tracking-widest mb-2">
              Saved overrides ({rows.length})
            </p>
            <div className="space-y-2">
              {rows.map((r) => (
                <button
                  key={r.hash}
                  onClick={() => {
                    setSource(r.source_text)
                    setText(r.translated_text)
                  }}
                  className="w-full bg-white border border-border rounded-xl p-3 text-left"
                >
                  <p className="text-xs text-ink-muted truncate">{r.source_text}</p>
                  <p className="text-sm text-teal-900" dir={r.target_lang === 'ur' ? 'rtl' : 'ltr'}>
                    {r.translated_text}
                  </p>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
