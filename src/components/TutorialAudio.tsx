import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'

const AUDIO_URL = supabase.storage
  .from('LearnIslam')
  .getPublicUrl('allahu_allahu_best.mp3').data.publicUrl

/** Shared background recitation for the app and Maqtab tutorials. */
export function TutorialAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    const audio = new Audio(AUDIO_URL)
    audio.loop = true
    audio.preload = 'auto'
    audioRef.current = audio

    const start = () => {
      void audio.play().catch(() => {
        // Browsers may wait for the first user gesture before allowing audio.
      })
    }
    start()
    const onFirstGesture = () => {
      start()
      window.removeEventListener('pointerdown', onFirstGesture)
      window.removeEventListener('keydown', onFirstGesture)
    }
    window.addEventListener('pointerdown', onFirstGesture, { once: true })
    window.addEventListener('keydown', onFirstGesture, { once: true })

    return () => {
      window.removeEventListener('pointerdown', onFirstGesture)
      window.removeEventListener('keydown', onFirstGesture)
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
      audioRef.current = null
    }
  }, [])

  const toggleMute = () => {
    const next = !muted
    setMuted(next)
    const audio = audioRef.current
    if (!audio) return
    audio.muted = next
    if (!next) void audio.play().catch(() => undefined)
  }

  return (
    <button
      type="button"
      onClick={toggleMute}
      className="tutorial-audio-toggle"
      aria-label={muted ? 'Unmute tutorial audio' : 'Mute tutorial audio'}
      aria-pressed={muted}
      title={muted ? 'Unmute tutorial audio' : 'Mute tutorial audio'}
    >
      <span aria-hidden="true">{muted ? 'Muted' : 'Sound on'}</span>
    </button>
  )
}
