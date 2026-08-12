// src/pages/Maqtab/QuizPage.tsx
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { useAppStore } from '../../store/appStore'
import { getQuiz, completeLesson } from '../../services/supabaseService'
import { useTrList } from '../../i18n/useTr'

interface RawQuiz {
  id: string
  question: string
  options?: string[]
  option_a?: string
  option_b?: string
  option_c?: string
  option_d?: string
  correct_idx?: number // actual DB column
  correct_index?: number
  correct_answer?: string
  explanation?: string
}

interface Question {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation?: string
}

function normalise(row: RawQuiz): Question {
  const options =
    row.options && row.options.length
      ? row.options
      : [row.option_a, row.option_b, row.option_c, row.option_d].filter(
          (o): o is string => typeof o === 'string' && o.length > 0
        )
  // DB uses `correct_idx`. Fall back to other shapes just in case.
  let correctIndex = row.correct_idx ?? row.correct_index ?? -1
  if (correctIndex < 0 && row.correct_answer != null) {
    const asNum = Number(row.correct_answer)
    correctIndex = Number.isNaN(asNum)
      ? options.findIndex((o) => o === row.correct_answer)
      : asNum
  }
  // Guard against out-of-range seed values (e.g. 1-based or bad data).
  if (correctIndex >= options.length && options.length > 0) {
    correctIndex = options.length - 1
  }
  return {
    id: row.id,
    question: row.question,
    options,
    correctIndex,
    explanation: row.explanation,
  }
}

// Short celebratory chime via Web Audio API — no audio asset needed, works in
// the browser and the Android WebView. Triggered by a user click (submit).
function playCelebration() {
  try {
    const Ctx = window.AudioContext || (window as unknown as any).webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    const now = ctx.currentTime
    const notes = [523.25, 659.25, 783.99, 1046.5] // C5 E5 G5 C6
    notes.forEach((f, i) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'triangle'
      o.frequency.value = f
      o.connect(g)
      g.connect(ctx.destination)
      const t = now + i * 0.15
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(0.3, t + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4)
      o.start(t)
      o.stop(t + 0.42)
    })
  } catch {
    /* ignore audio errors */
  }
  try {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance('Mashallah! Good job!')
      u.rate = 0.95
      window.speechSynthesis.speak(u)
    }
  } catch {
    /* ignore tts errors */
  }
}

export function QuizPage() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const user = useAppStore((s) => s.user)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [celebrate, setCelebrate] = useState(false)

  useEffect(() => {
    if (!lessonId) return
    getQuiz(lessonId).then((rows) => {
      setQuestions((rows as RawQuiz[]).map(normalise))
      setLoading(false)
    })
  }, [lessonId])

  const score = questions.reduce(
    (acc, q) => acc + (answers[q.id] === q.correctIndex ? 1 : 0),
    0
  )
  const total = questions.length
  const percent = total ? Math.round((score / total) * 100) : 0

  const allCorrect = total > 0 && score === total

  const L = useTrList([
    'Loading quiz…', // 0
    'No quiz for this lesson yet.', // 1
    'Back to Maqtab', // 2
    'Lesson completed', // 3
    'Saving progress…', // 4
    'Submit answers', // 5
    'Try again', // 6
    'Back', // 7
    'Finish → Back to Maqtab', // 8
    'Mashallah!', // 9
    'Good job — all answers correct!', // 10
    'Alhamdulillah, continue →', // 11
    'Review answers', // 12
    'correct', // 13
  ])
  const qTexts = useTrList(questions.map((q) => q.question))
  const qMap = new Map(questions.map((q, i) => [q.question, qTexts[i]]))
  const optList = questions.flatMap((q) => q.options)
  const trOpt = useTrList(optList)
  const optMap = new Map(optList.map((o, i) => [o, trOpt[i]]))
  const explList = questions.map((q) => q.explanation ?? '')
  const trExpl = useTrList(explList)
  const explMap = new Map(explList.map((e, i) => [e, trExpl[i]]))

  const handleSubmit = async () => {
    setSubmitted(true)
    // Only mark the lesson completed when every answer is correct.
    if (allCorrect) {
      playCelebration()
      setCelebrate(true)
      if (user && lessonId) {
        setSaving(true)
        await completeLesson(user.id, lessonId, percent)
        setSaving(false)
      }
    }
  }

  return (
    <div className="bg-cream min-h-screen pb-28">
      <PageHeader title="Quiz" backTo={`/maqtab/${lessonId}`} />

      <div className="px-4 pt-4 space-y-4">
        {loading && <p className="text-ink-muted text-sm text-center py-8">{L[0]}</p>}

        {!loading && total === 0 && (
          <div className="bg-white border border-border rounded-2xl p-5 text-center">
            <p className="text-sm text-ink-muted mb-4">{L[1]}</p>
            <button
              onClick={() => navigate('/maqtab')}
              className="bg-teal-900 text-white font-bold rounded-xl py-2.5 px-6 text-sm"
            >
              {L[2]}
            </button>
          </div>
        )}

        {submitted && total > 0 && (
          <div className="bg-white border-t-4 border-gold rounded-2xl p-5 text-center">
            <p className="text-3xl font-bold text-teal-900">{percent}%</p>
            <p className="text-sm text-ink-muted mt-1">
              {score} / {total} {L[13]}
            </p>
            {allCorrect && (
              <span className="inline-block mt-2 text-xs font-bold text-white bg-teal-900 rounded-full px-3 py-1">
                ✓ {L[3]}
              </span>
            )}
            {saving && <p className="text-xs text-ink-muted mt-2">{L[4]}</p>}
          </div>
        )}

        {questions.map((q, qi) => (
          <div key={q.id} className="bg-white border border-border rounded-2xl p-4">
            <p className="text-sm font-bold text-teal-900 mb-3">
              {qi + 1}. {qMap.get(q.question) ?? q.question}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => {
                const chosen = answers[q.id] === oi
                const isCorrect = q.correctIndex === oi
                let cls = 'border-border bg-cream text-ink'
                if (submitted) {
                  if (isCorrect) cls = 'border-teal-700 bg-teal-500/10 text-teal-900'
                  else if (chosen) cls = 'border-red-400 bg-red-50 text-red-600'
                } else if (chosen) {
                  cls = 'border-teal-700 bg-teal-500/10 text-teal-900'
                }
                return (
                  <button
                    key={oi}
                    disabled={submitted}
                    onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                    className={`w-full text-left border rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${cls}`}
                  >
                    {optMap.get(opt) ?? opt}
                    {submitted && isCorrect && ' ✓'}
                  </button>
                )
              })}
            </div>
            {submitted && q.explanation && (
              <p className="text-xs text-ink-muted mt-3 bg-sand rounded-xl px-3 py-2 leading-relaxed">
                💡 {explMap.get(q.explanation ?? '') ?? q.explanation}
              </p>
            )}
          </div>
        ))}
      </div>

      {!loading && total > 0 && (
        <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-cream border-t border-border p-4">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < total}
              className="w-full bg-teal-900 text-white font-bold rounded-xl py-3 text-sm disabled:opacity-50"
            >
              {L[5]}
            </button>
          ) : allCorrect ? (
            <button
              onClick={() => navigate('/maqtab')}
              className="w-full bg-gold text-teal-900 font-bold rounded-xl py-3 text-sm"
            >
              {L[8]}
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setAnswers({})
                  setSubmitted(false)
                }}
                className="flex-1 bg-teal-900 text-white font-bold rounded-xl py-3 text-sm"
              >
                {L[6]}
              </button>
              <button
                onClick={() => navigate('/maqtab')}
                className="flex-1 bg-white border border-border text-teal-900 font-bold rounded-xl py-3 text-sm"
              >
                {L[7]}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Celebration overlay — all answers correct */}
      {celebrate && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-6">
          <div className="bg-cream rounded-2xl p-6 text-center border-t-4 border-gold w-full max-w-sm relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 flex justify-around text-2xl">
              <span className="step-enter">🎉</span>
              <span className="step-enter">✨</span>
              <span className="step-enter">🎊</span>
              <span className="step-enter">⭐</span>
            </div>
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="font-arabic text-teal-900 text-2xl font-bold mb-1">{L[9]}</h3>
            <p className="text-sm text-ink font-semibold mb-1">{L[10]}</p>
            <span className="inline-block my-3 text-xs font-bold text-white bg-teal-900 rounded-full px-3 py-1">
              ✓ {L[3]}
            </span>
            <button
              onClick={() => navigate('/maqtab')}
              className="w-full bg-gold text-teal-900 font-bold rounded-xl py-2.5 text-sm mt-2"
            >
              {L[11]}
            </button>
            <button
              onClick={() => setCelebrate(false)}
              className="w-full text-ink-muted text-xs font-semibold mt-2"
            >
              {L[12]}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
