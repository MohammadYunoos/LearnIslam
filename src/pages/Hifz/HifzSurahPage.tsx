// src/pages/Hifz/HifzSurahPage.tsx
// Memorisation player for one surah: listen per ayah (with Arabic + meaning),
// loop an ayah to memorise, tick off memorised ayahs, mark the surah completed.
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { getSurah, ayahAudioUrl } from '../../content/surahs'
import {
  getStatus,
  setStatus,
  getMemorised,
  toggleMemorised,
} from '../../services/hifzLocal'
import { getSurahTranslation, getSurahTransliteration } from '../../services/quranText'
import { useAppStore } from '../../store/appStore'

type Mode = 'single' | 'all'

export function HifzSurahPage() {
  const { slug } = useParams()
  const surah = slug ? getSurah(slug) : undefined
  const lang = useAppStore((s) => s.user?.language)

  const [translation, setTranslation] = useState<string[] | null>(null)
  const [translit, setTranslit] = useState<string[] | null>(null)
  const [current, setCurrent] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [loop, setLoop] = useState(false)
  const [audioError, setAudioError] = useState(false)
  const [memorised, setMemorised] = useState<number[]>(slug ? getMemorised(slug) : [])
  const [status, setStatusState] = useState(slug ? getStatus(slug) : 'NotStarted')

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const modeRef = useRef<Mode>('single')
  const loopRef = useRef(false)
  const currentRef = useRef<number | null>(null)

  loopRef.current = loop

  // Create the audio element once and wire sequence handling.
  useEffect(() => {
    const a = new Audio()
    audioRef.current = a
    a.onended = () => {
      if (modeRef.current === 'all') {
        const next = (currentRef.current ?? 0) + 1
        if (surah && next < surah.ayahs.length) playIndex(next, 'all')
        else if (loopRef.current) playIndex(0, 'all')
        else stop()
      } else {
        stop()
      }
    }
    a.onerror = () => {
      setAudioError(true)
      setIsPlaying(false)
    }
    return () => {
      a.pause()
      a.src = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  // Fetch transliteration (always) + preferred-language translation.
  useEffect(() => {
    let alive = true
    setTranslation(null)
    setTranslit(null)
    if (surah) {
      getSurahTransliteration(surah.number).then((arr) => {
        if (alive) setTranslit(arr)
      })
      if (lang && lang !== 'en') {
        getSurahTranslation(surah.number, lang).then((arr) => {
          if (alive) setTranslation(arr)
        })
      }
    }
    return () => {
      alive = false
    }
  }, [surah, lang])

  if (!surah) {
    return (
      <div className="bg-cream min-h-screen">
        <PageHeader title="Surah" backTo="/hifz" />
        <p className="text-sm text-ink-muted text-center py-10">Surah not found.</p>
      </div>
    )
  }

  function markInProgress() {
    if (slug && getStatus(slug) === 'NotStarted') {
      setStatus(slug, 'InProgress')
      setStatusState('InProgress')
    }
  }

  function stop() {
    const a = audioRef.current
    if (a) a.pause()
    setIsPlaying(false)
    setCurrent(null)
    currentRef.current = null
  }

  function playIndex(i: number, mode: Mode) {
    const a = audioRef.current
    if (!a || !surah) return
    const src = ayahAudioUrl(surah, i + 1)
    // Skip ayahs with no audio (e.g. Fatiha Bismillah) during sequential play.
    if (!src) {
      if (mode === 'all' && i + 1 < surah.ayahs.length) {
        playIndex(i + 1, 'all')
      } else {
        stop()
      }
      return
    }
    setAudioError(false)
    modeRef.current = mode
    currentRef.current = i
    setCurrent(i)
    a.pause()
    a.src = src
    a.loop = mode === 'single' && loopRef.current
    a.currentTime = 0
    a
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        setAudioError(true)
        setIsPlaying(false)
      })
    markInProgress()
  }

  function onToggleMemorised(ayahNo: number) {
    if (!slug) return
    setMemorised(toggleMemorised(slug, ayahNo))
    markInProgress()
  }

  function markCompleted() {
    if (!slug) return
    setStatus(slug, 'Completed')
    setStatusState('Completed')
  }

  const memoCount = memorised.length
  const total = surah.ayahs.length

  return (
    <div className="bg-cream min-h-screen pb-40">
      <PageHeader title={surah.name} subtitle={`${surah.arabicName} · ${surah.meaning}`} backTo="/hifz" />

      <div className="px-4 pt-4">
        {/* Progress */}
        <div className="bg-white border border-border rounded-2xl p-4 mb-3">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-semibold text-teal-900">Memorised</p>
            <p className="text-xs font-bold text-gold-dark">
              {memoCount} / {total}
              {status === 'Completed' ? ' · ✓ Completed' : ''}
            </p>
          </div>
          <div className="h-2 bg-sand rounded-full overflow-hidden">
            <div
              className="h-full bg-gold rounded-full transition-all"
              style={{ width: `${(memoCount / total) * 100}%` }}
            />
          </div>
        </div>

        {audioError && (
          <p className="text-xs text-red-500 mb-3">
            Audio could not load. Check the storage bucket/path config (see surahs.ts).
          </p>
        )}

        {/* Ayah list */}
        <div className="space-y-3">
          {surah.ayahs.map((ayah, i) => {
            const isActive = current === i
            const done = memorised.includes(i + 1)
            return (
              <div
                key={i}
                className={`bg-white border rounded-2xl p-4 ${
                  isActive ? 'border-teal-700 ring-1 ring-teal-500/30' : 'border-border'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold text-white bg-teal-900 rounded-full w-6 h-6 flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  {!ayah.noAudio && (
                    <button
                      onClick={() => (isActive && isPlaying ? stop() : playIndex(i, 'single'))}
                      className="text-teal-900 text-xl shrink-0"
                      aria-label="Play ayah"
                    >
                      {isActive && isPlaying ? '⏸️' : '🔊'}
                    </button>
                  )}
                </div>
                <p className="font-arabic text-2xl text-teal-900 leading-loose text-right mb-2">
                  {ayah.arabic}
                </p>
                {translit?.[i] && (
                  <p className="text-sm italic text-gold-dark leading-relaxed mb-1">
                    {translit[i]}
                  </p>
                )}
                <p className="text-sm text-ink leading-relaxed mb-1">{ayah.translation}</p>
                {lang && lang !== 'en' && translation?.[i] && (
                  <p className="text-sm text-teal-900 leading-relaxed mb-2">{translation[i]}</p>
                )}
                <button
                  onClick={() => onToggleMemorised(i + 1)}
                  className={`w-full text-xs font-bold rounded-xl py-2 border ${
                    done
                      ? 'bg-teal-900 text-white border-teal-900'
                      : 'bg-cream text-ink-muted border-border'
                  }`}
                >
                  {done ? '✓ Memorised' : 'Mark as memorised'}
                </button>
              </div>
            )
          })}
        </div>

        <button
          onClick={markCompleted}
          disabled={status === 'Completed'}
          className="w-full bg-teal-900 text-white font-bold rounded-xl py-3 text-sm mt-4 disabled:opacity-60"
        >
          {status === 'Completed' ? '✓ Surah completed' : 'Mark surah as completed'}
        </button>
      </div>

      {/* Playback bar */}
      <div className="fixed bottom-16 left-0 right-0 max-w-lg mx-auto bg-cream border-t border-border p-3 flex items-center gap-2">
        <button
          onClick={() => (isPlaying ? stop() : playIndex(0, 'all'))}
          className="flex-1 bg-teal-900 text-white font-bold rounded-xl py-2.5 text-sm"
        >
          {isPlaying ? '⏹ Stop' : '▶ Play surah'}
        </button>
        <button
          onClick={() => {
            const next = !loop
            setLoop(next)
            if (audioRef.current && modeRef.current === 'single') audioRef.current.loop = next
          }}
          className={`rounded-xl py-2.5 px-4 text-sm font-bold border ${
            loop ? 'bg-gold text-teal-900 border-gold' : 'bg-white text-ink-muted border-border'
          }`}
        >
          🔁 Repeat
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
