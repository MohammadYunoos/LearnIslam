// src/pages/Maqtab/ExamPage.tsx
// Beginner exam: disclaimer + past attempts → timed paper → server-scored result.
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { useAppStore } from '../../store/appStore'
import {
  getExamQuestions,
  submitExam,
  getExamAttempts,
  type ExamQuestion,
  type ExamAttempt,
} from '../../services/supabaseService'
import { useTr, useLang } from '../../i18n/useTr'
import { contentDbLang } from '../../i18n/contentLang'

type Phase = 'intro' | 'exam' | 'result'

function mmss(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })
  } catch {
    return iso.slice(0, 10)
  }
}

export function ExamPage() {
  const navigate = useNavigate()
  const user = useAppStore((s) => s.user)
  const lang = useLang()
  const [phase, setPhase] = useState<Phase>('intro')
  const [questions, setQuestions] = useState<ExamQuestion[]>([])
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [attempts, setAttempts] = useState<ExamAttempt[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [result, setResult] = useState<{ score: number; total: number; percent: number; passed: boolean } | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    getExamAttempts('Beginner')
      .then((a) => setAttempts(a ?? []))
      .catch(() => setAttempts([]))
      .finally(() => setLoading(false))
  }, [])

  // Count-up timer while the exam is running.
  useEffect(() => {
    if (phase === 'exam') {
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000)
      return () => {
        if (timerRef.current) clearInterval(timerRef.current)
      }
    }
  }, [phase])

  const tTitle = useTr('Beginner Exam')
  const tDisc = useTr(
    'Before you begin: Allah is always watching (Muraqabah). Please answer honestly, from your own knowledge, without any help or searching. There is barakah in honesty — and this certificate only benefits you if it is truly earned.'
  )
  const tRules = useTr('Up to 50 questions · split across chapters · 75% to pass · unlimited attempts.')
  const tBegin = useTr('Begin exam (Bismillah)')
  const tPast = useTr('Your previous attempts')
  const tNoPast = useTr('No attempts yet.')
  const tLoading = useTr('Loading…')
  const tPassed = useTr('Passed')
  const tFailed = useTr('Failed')
  const tSubmit = useTr('Submit exam')
  const tSubmitting = useTr('Scoring…')
  const tTime = useTr('Time')
  const tNoQ = useTr('No exam questions available yet. Please check back soon, In sha Allah.')
  const tViewCert = useTr('View certificate →')
  const tTryAgain = useTr('Try again')
  const tBack = useTr('Back to Maqtab')

  async function begin() {
    setLoading(true)
    try {
      const res = await getExamQuestions('Beginner', contentDbLang(lang))
      setQuestions(res?.questions ?? [])
      setAnswers({})
      setElapsed(0)
      setResult(null)
      setPhase('exam')
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit() {
    if (timerRef.current) clearInterval(timerRef.current)
    setSubmitting(true)
    try {
      const res = await submitExam({ answers, elapsedSeconds: elapsed })
      setResult({ score: res.score, total: res.total, percent: res.percent, passed: res.passed })
      if (res.passed) {
        localStorage.setItem(
          'exam_pass_beginner',
          JSON.stringify({ name: user?.name ?? 'Student', percent: res.percent, date: new Date().toISOString() })
        )
      }
      setPhase('result')
      // refresh history
      getExamAttempts('Beginner').then((a) => setAttempts(a ?? []))
    } finally {
      setSubmitting(false)
    }
  }

  const total = questions.length
  const answeredAll = total > 0 && Object.keys(answers).length >= total

  return (
    <div className="bg-cream min-h-screen pb-28">
      <PageHeader title="Beginner Exam" subtitle="Maqtab · certificate exam" backTo="/maqtab" />

      <div className="px-4 pt-4 space-y-4">
        {loading && phase === 'intro' && (
          <p className="text-ink-muted text-sm text-center py-8">{tLoading}</p>
        )}

        {/* ── Intro + disclaimer + past attempts ── */}
        {phase === 'intro' && !loading && (
          <>
            <div className="glossy-sky rounded-2xl p-4 shadow">
              <p className="text-sm font-bold text-teal-900">{tTitle}</p>
              <p className="text-xs text-teal-900/80 mt-1">{tRules}</p>
            </div>

            <div className="bg-white border-l-4 border-gold rounded-2xl p-4">
              <p className="text-sm text-ink leading-relaxed">🤲 {tDisc}</p>
            </div>

            <div className="bg-white border border-border rounded-2xl p-4">
              <p className="text-xs font-bold text-ink-muted uppercase tracking-wide mb-2">{tPast}</p>
              {attempts.length === 0 ? (
                <p className="text-sm text-ink-muted">{tNoPast}</p>
              ) : (
                <div className="divide-y divide-border">
                  {attempts.map((a) => (
                    <div key={a.id} className="flex items-center justify-between py-2 text-sm">
                      <span className="text-ink-muted">{fmtDate(a.created_at)}</span>
                      <span className="font-bold text-teal-900">{a.percent}%</span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          a.passed ? 'bg-teal-900 text-white' : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {a.passed ? `✓ ${tPassed}` : tFailed}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={begin}
              className="w-full bg-teal-900 text-white font-bold rounded-xl py-3 text-sm"
            >
              {tBegin}
            </button>
          </>
        )}

        {/* ── Exam ── */}
        {phase === 'exam' && (
          <>
            <div className="sticky top-0 z-10 -mx-4 px-4 py-2 bg-cream/95 backdrop-blur flex items-center justify-between border-b border-border">
              <span className="text-xs font-bold text-ink-muted">
                {Object.keys(answers).length} / {total}
              </span>
              <span className="text-sm font-bold text-teal-900">
                ⏱ {tTime} {mmss(elapsed)}
              </span>
            </div>

            {total === 0 && (
              <div className="bg-white border border-border rounded-2xl p-5 text-center">
                <p className="text-sm text-ink-muted">{tNoQ}</p>
              </div>
            )}

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

            {total > 0 && (
              <button
                onClick={onSubmit}
                disabled={!answeredAll || submitting}
                className="w-full bg-teal-900 text-white font-bold rounded-xl py-3 text-sm disabled:opacity-50"
              >
                {submitting ? tSubmitting : tSubmit}
              </button>
            )}
          </>
        )}

        {/* ── Result ── */}
        {phase === 'result' && result && (
          <div className="bg-white border-t-4 border-gold rounded-2xl p-6 text-center">
            <p className="text-5xl font-bold text-teal-900">{result.percent}%</p>
            <p className="text-sm text-ink-muted mt-1">
              {result.score} / {result.total} · ⏱ {mmss(elapsed)}
            </p>
            <span
              className={`inline-block mt-3 text-xs font-bold px-3 py-1 rounded-full ${
                result.passed ? 'bg-teal-900 text-white' : 'bg-red-100 text-red-600'
              }`}
            >
              {result.passed ? `✓ ${tPassed}` : tFailed}
            </span>

            {result.passed ? (
              <button
                onClick={() => navigate('/maqtab/certificate')}
                className="w-full bg-gold text-teal-900 font-bold rounded-xl py-3 text-sm mt-5"
              >
                {tViewCert}
              </button>
            ) : (
              <button
                onClick={() => setPhase('intro')}
                className="w-full bg-teal-900 text-white font-bold rounded-xl py-3 text-sm mt-5"
              >
                {tTryAgain}
              </button>
            )}
            <button
              onClick={() => navigate('/maqtab')}
              className="w-full text-ink-muted text-xs font-semibold mt-3"
            >
              {tBack}
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
