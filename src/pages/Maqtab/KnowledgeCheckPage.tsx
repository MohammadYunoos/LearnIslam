// src/pages/Maqtab/KnowledgeCheckPage.tsx
// Quick informal pre-test (5 questions) from the Beginner pool. Client-scored.
// Encourages the user to start the Beginner lessons based on the result.
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { getKnowledgeCheck } from '../../services/supabaseService'
import { useTr, useLang } from '../../i18n/useTr'
import { contentDbLang } from '../../i18n/contentLang'

interface Q {
  id: string
  question: string
  options: string[]
  correct_idx: number
}

export function KnowledgeCheckPage() {
  const navigate = useNavigate()
  const lang = useLang()
  const [questions, setQuestions] = useState<Q[]>([])
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getKnowledgeCheck('Beginner', 5, contentDbLang(lang))
      .then((rows) => setQuestions((rows as Q[]) ?? []))
      .catch(() => setQuestions([]))
      .finally(() => setLoading(false))
  }, [lang])

  const total = questions.length
  const score = questions.reduce((a, q) => a + (answers[q.id] === q.correct_idx ? 1 : 0), 0)
  const percent = total ? Math.round((score / total) * 100) : 0

  const tTitle = useTr('Knowledge Check')
  const tIntro = useTr('A quick 5-question check from the Beginner section — no marks, just to see where you stand.')
  const tSubmit = useTr('See result')
  const tLoading = useTr('Loading…')
  const tNone = useTr('No questions available yet. Please check back soon, In sha Allah.')
  const tStart = useTr('Start Beginner lessons')
  const tRetry = useTr('Try again')
  const tScored = useTr('You scored')

  const encourage =
    percent >= 70
      ? 'Mashallah, strong basics! Take the full lessons to lock it in and unlock the exam.'
      : percent >= 40
        ? 'Good start! Strengthen it — begin the Beginner lessons from Chapter 1.'
        : 'Perfect place to begin! Start the Beginner lessons from Chapter 1, In sha Allah.'

  return (
    <div className="bg-cream min-h-screen pb-24">
      <PageHeader title="Knowledge Check" subtitle="Beginner · quick check" backTo="/maqtab" />

      <div className="px-4 pt-4 space-y-4">
        {loading && <p className="text-ink-muted text-sm text-center py-8">{tLoading}</p>}

        {!loading && total === 0 && (
          <div className="bg-white border border-border rounded-2xl p-5 text-center">
            <p className="text-sm text-ink-muted">{tNone}</p>
          </div>
        )}

        {!loading && total > 0 && !submitted && (
          <>
            <div className="glossy-sky rounded-2xl p-4 shadow">
              <p className="text-sm font-bold text-teal-900">{tTitle}</p>
              <p className="text-xs text-teal-900/80 mt-1">{tIntro}</p>
            </div>

            {questions.map((q, qi) => (
              <div key={q.id} className="bg-white border border-border rounded-2xl p-4">
                <p className="text-sm font-bold text-teal-900 mb-3">
                  {qi + 1}. {q.question}
                </p>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => {
                    const chosen = answers[q.id] === oi
                    return (
                      <button
                        key={oi}
                        onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                        className={`w-full text-left border rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                          chosen
                            ? 'border-teal-700 bg-teal-500/10 text-teal-900'
                            : 'border-border bg-cream text-ink'
                        }`}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

            <button
              onClick={() => setSubmitted(true)}
              disabled={Object.keys(answers).length < total}
              className="w-full bg-teal-900 text-white font-bold rounded-xl py-3 text-sm disabled:opacity-50"
            >
              {tSubmit}
            </button>
          </>
        )}

        {submitted && (
          <div className="bg-white border-t-4 border-gold rounded-2xl p-6 text-center">
            <p className="text-4xl font-bold text-teal-900">{percent}%</p>
            <p className="text-sm text-ink-muted mt-1">
              {tScored} {score} / {total}
            </p>
            <p className="text-sm text-ink leading-relaxed mt-4">{encourage}</p>
            <button
              onClick={() => navigate('/maqtab')}
              className="w-full bg-teal-900 text-white font-bold rounded-xl py-3 text-sm mt-5"
            >
              {tStart} →
            </button>
            <button
              onClick={() => {
                setAnswers({})
                setSubmitted(false)
              }}
              className="w-full text-ink-muted text-xs font-semibold mt-3"
            >
              {tRetry}
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
