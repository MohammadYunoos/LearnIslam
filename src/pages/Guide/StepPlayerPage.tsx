// src/pages/Guide/StepPlayerPage.tsx
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { getTopic, itemsForGender } from '../../content/guide'
import { useNarration } from '../../hooks/useNarration'
import { useAppStore } from '../../store/appStore'
import { supabase } from '../../lib/supabase'
import { useTr, useTrList, useLang } from '../../i18n/useTr'
import { shortRef } from '../../components/RefChips'

export function StepPlayerPage() {
  const { slug } = useParams()
  const gender = useAppStore((s) => s.user?.gender)
  const topic = slug ? getTopic(slug) : undefined
  const steps = itemsForGender(topic?.steps ?? [], gender)
  const [index, setIndex] = useState(0)
  const [imgError, setImgError] = useState(false)
  const [useRemote, setUseRemote] = useState(false) // local image failed → try Supabase
  const narration = useNarration()
  // Roman Urdu TTS (via the ur-PK voice) reads the Latin text poorly — disable it.
  const narrationOff = useLang() === 'ur-roman'

  useEffect(() => {
    setImgError(false) // reset when the step changes
    setUseRemote(false)
  }, [index])

  const step = steps[index]

  // Translations (English until ready; no-op for lang 'en').
  const tTitle = useTr(step?.title ?? '')
  const tDesc = useTr(step?.description ?? '')
  const tStepsTitle = useTr(topic?.stepsTitle ?? (topic ? `Method — ${topic.title}` : ''))
  // Refs are proper nouns — shown as-is (no MT, which garbled "Qur'an").
  const tRefs = (step?.refs ?? []).map((r) => shortRef(r.source))
  const L = useTrList([
    'Narration On',
    'Narration Off',
    'Voice',
    'Replay',
    'Prev',
    'Next',
    'Step',
    'of',
    'Narration not supported on this device',
  ])

  // Narrate the current step (in the user's language) whenever it changes.
  useEffect(() => {
    if (step && narration.enabled && !narrationOff) {
      narration.speak(`${tTitle}. ${tDesc}`)
    } else {
      narration.cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, narration.enabled, tTitle, tDesc, narrationOff])

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
  // Serve step images from the bundled app first (fast, offline); fall back to
  // the Supabase bucket if a local file is missing, then to the emoji.
  const localSrc = step.image ? `${import.meta.env.BASE_URL}steps/${step.image}` : null
  const remoteSrc = step.image
    ? supabase.storage.from('LearnIslam').getPublicUrl(step.image).data.publicUrl
    : null
  const imgUrl = step.animationUrl || (useRemote ? remoteSrc : localSrc || remoteSrc)

  return (
    <div className="bg-cream min-h-screen flex flex-col">
      <PageHeader
        title={topic.title}
        subtitle={`${L[6]} ${index + 1} ${L[7]} ${steps.length}`}
        backTo={`/guide/${slug}`}
      />

      {/* Narration toggle (hidden for Roman Urdu — TTS reads it poorly) */}
      <div className="px-4 pt-3 flex flex-col items-end">
        {narrationOff ? null : narration.supported ? (
          <>
            <button
              onClick={narration.toggle}
              className={`text-xs font-bold rounded-full px-3 py-1.5 border ${
                narration.enabled
                  ? 'bg-teal-900 text-white border-teal-900'
                  : 'bg-white text-ink-muted border-border'
              }`}
            >
              {narration.enabled ? `🔊 ${L[0]}` : `🔈 ${L[1]}`}
              {narration.speaking ? ' …' : ''}
            </button>
            {narration.enabled && (
              <span className="text-[10px] text-ink-muted mt-1">
                {L[2]}: {narration.voiceLabel}
              </span>
            )}
          </>
        ) : (
          <span className="text-[11px] text-ink-muted">{L[8]}</span>
        )}
      </div>

      {/* Method title */}
      <div className="px-4 pt-2">
        <h2 className="text-base font-bold text-teal-900 text-center">{tStepsTitle}</h2>
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
              loading="lazy"
              className="w-full h-full object-contain"
              onError={() => {
                // local failed → try remote; remote failed → emoji fallback
                if (!useRemote && !step.animationUrl && remoteSrc) setUseRemote(true)
                else setImgError(true)
              }}
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
          <p className="text-lg font-bold text-teal-900">{tTitle}</p>
          <p className="text-sm text-ink-muted mt-2 leading-relaxed">{tDesc}</p>

          {step.refs && step.refs.length > 0 && (
            <div className="flex flex-wrap gap-1.5 justify-center mt-3">
              {step.refs.map((_, i) => (
                <span
                  key={i}
                  className="text-[10px] font-semibold text-teal-700 bg-teal-500/10 border border-teal-500/20 rounded-full px-2 py-0.5"
                >
                  {tRefs[i]}
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
              aria-label={`step ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="sticky bottom-0 bg-cream border-t border-border p-4 flex items-center justify-between gap-3 safe-bottom">
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={atStart}
          className="bg-white border border-border text-teal-900 font-bold rounded-xl py-3 px-6 text-sm disabled:opacity-40"
        >
          ← {L[4]}
        </button>
        {narration.supported && narration.enabled && (
          <button
            onClick={() => narration.speak(`${tTitle}. ${tDesc}`)}
            className="text-teal-900 font-bold text-sm"
          >
            ↻ {L[3]}
          </button>
        )}
        <button
          onClick={() => setIndex((i) => Math.min(steps.length - 1, i + 1))}
          disabled={atEnd}
          className="bg-teal-900 text-white font-bold rounded-xl py-3 px-6 text-sm disabled:opacity-40"
        >
          {L[5]} →
        </button>
      </div>
    </div>
  )
}
