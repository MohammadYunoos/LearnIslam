// src/pages/Guide/StepPlayerPage.tsx
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { getTopic, itemsForGender } from '../../content/guide'
import { useNarration } from '../../hooks/useNarration'
import { useAppStore } from '../../store/appStore'
import { supabase } from '../../lib/supabase'

export function StepPlayerPage() {
  const { slug } = useParams()
  const gender = useAppStore((s) => s.user?.gender)
  const topic = slug ? getTopic(slug) : undefined
  const steps = itemsForGender(topic?.steps ?? [], gender)
  const [index, setIndex] = useState(0)
  const [imgError, setImgError] = useState(false)
  const narration = useNarration()

  useEffect(() => {
    setImgError(false) // reset when the step changes
  }, [index])

  const step = steps[index]

  // Narrate the current step whenever it changes (if narration is on).
  useEffect(() => {
    if (step && narration.enabled) {
      narration.speak(`${step.title}. ${step.description}`)
    } else {
      narration.cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, narration.enabled])

  if (!topic || steps.length === 0) {
    return (
      <div className="bg-cream min-h-screen">
        <PageHeader title="Steps" backTo="/guide" />
        <p className="text-sm text-ink-muted text-center py-10">No steps available.</p>
      </div>
    )
  }

  const atStart = index === 0
  const atEnd = index === steps.length - 1
  const imgUrl =
    step.animationUrl ||
    (step.image
      ? supabase.storage.from('LearnIslam').getPublicUrl(step.image).data.publicUrl
      : null)

  return (
    <div className="bg-cream min-h-screen flex flex-col">
      <PageHeader title={topic.title} subtitle={`Step ${index + 1} of ${steps.length}`} backTo={`/guide/${slug}`} />

      {/* Narration toggle */}
      <div className="px-4 pt-3 flex flex-col items-end">
        {narration.supported ? (
          <>
            <button
              onClick={narration.toggle}
              className={`text-xs font-bold rounded-full px-3 py-1.5 border ${
                narration.enabled
                  ? 'bg-teal-900 text-white border-teal-900'
                  : 'bg-white text-ink-muted border-border'
              }`}
            >
              {narration.enabled ? '🔊 Narration On' : '🔈 Narration Off'}
              {narration.speaking ? ' …' : ''}
            </button>
            {narration.enabled && (
              <span className="text-[10px] text-ink-muted mt-1">Voice: {narration.voiceLabel}</span>
            )}
          </>
        ) : (
          <span className="text-[11px] text-ink-muted">Narration not supported on this device</span>
        )}
      </div>

      {/* Method title */}
      <div className="px-4 pt-2">
        <h2 className="text-base font-bold text-teal-900 text-center">
          {topic.stepsTitle ?? `Method — ${topic.title}`}
        </h2>
      </div>

      {/* Animation / image frame */}
      <div className="px-4 pt-3 flex-1 flex flex-col items-center">
        {imgUrl && !imgError ? (
          <div
            key={index}
            className="step-enter w-60 h-64 rounded-2xl overflow-hidden bg-white border border-gold/30 shadow-md flex items-center justify-center"
          >
            <img
              src={imgUrl}
              alt={step.title}
              className="w-full h-full object-contain"
              onError={() => setImgError(true)}
            />
          </div>
        ) : (
          <div className="relative w-56 h-56 flex items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-sand animate-ping opacity-40" />
            <span className="absolute inset-4 rounded-full bg-white border border-border" />
            <div key={index} className="step-enter relative text-7xl">
              {step.icon ?? '🕌'}
            </div>
          </div>
        )}

        <div className="mt-6 text-center px-2">
          <p className="text-lg font-bold text-teal-900">{step.title}</p>
          <p className="text-sm text-ink-muted mt-2 leading-relaxed">{step.description}</p>

          {step.refs && step.refs.length > 0 && (
            <div className="flex flex-wrap gap-1.5 justify-center mt-3">
              {step.refs.map((r, i) => (
                <span
                  key={i}
                  className="text-[10px] font-semibold text-teal-700 bg-teal-500/10 border border-teal-500/20 rounded-full px-2 py-0.5"
                >
                  {r.source}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Progress dots */}
        <div className="flex flex-wrap gap-1.5 justify-center mt-6">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full ${i === index ? 'bg-gold' : 'bg-border'}`}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="sticky bottom-0 bg-cream border-t border-border p-4 flex items-center justify-between gap-3">
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={atStart}
          className="bg-white border border-border text-teal-900 font-bold rounded-xl py-3 px-6 text-sm disabled:opacity-40"
        >
          ← Prev
        </button>
        {narration.supported && narration.enabled && (
          <button
            onClick={() => narration.speak(`${step.title}. ${step.description}`)}
            className="text-teal-900 font-bold text-sm"
          >
            ↻ Replay
          </button>
        )}
        <button
          onClick={() => setIndex((i) => Math.min(steps.length - 1, i + 1))}
          disabled={atEnd}
          className="bg-teal-900 text-white font-bold rounded-xl py-3 px-6 text-sm disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  )
}
