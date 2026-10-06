import { useState } from 'react'
import { openExternal } from '../lib/external'
import { useTr } from '../i18n/useTr'

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.mymaqtab.app'
const RATING_PROMPT_KEY = 'islamseeko_rating_prompt_dismissed_at'
const RATING_PROMPT_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

interface AppRatingPromptProps {
  isOpen: boolean
  onClose: () => void
}

export function AppRatingPrompt({ isOpen, onClose }: AppRatingPromptProps) {
  const [opening, setOpening] = useState(false)
  const [error, setError] = useState('')

  const rateTitle = useTr('Rate Islam Seeko')
  const rateDesc = useTr('Your honest Play Store feedback helps other learners and helps us improve.')
  const rateNow = useTr('Rate now')
  const mayBeLater = useTr('Maybe later')

  const handleRate = async () => {
    setOpening(true)
    setError('')
    try {
      await openExternal(PLAY_STORE_URL)
      localStorage.setItem(RATING_PROMPT_KEY, String(Date.now()))
      onClose()
    } catch (e) {
      console.error('Failed to open Play Store:', e)
      setError('The Play Store could not be opened. Please try again.')
    } finally {
      setOpening(false)
    }
  }

  const handleDismiss = () => {
    localStorage.setItem(RATING_PROMPT_KEY, String(Date.now()))
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-cream rounded-2xl shadow-2xl max-w-sm w-full p-6 border-2 border-gold">
        <div className="text-center mb-4">
          <div className="text-3xl mb-2">⭐</div>
          <h2 className="text-xl font-bold text-teal-900">{rateTitle}</h2>
        </div>

        <p className="text-sm text-ink-muted mb-4 text-center leading-relaxed">{rateDesc}</p>

        {error && <p className="text-xs text-red-600 mb-3 text-center">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={handleRate}
            disabled={opening}
            className="flex-1 bg-gradient-to-r from-gold to-gold text-teal-900 font-bold rounded-xl py-3 text-sm disabled:opacity-50 active:scale-[0.98] transition-transform"
          >
            {opening ? 'Opening…' : rateNow}
          </button>
          <button
            onClick={handleDismiss}
            className="flex-1 bg-sand text-teal-900 font-semibold rounded-xl py-3 text-sm border border-gold active:scale-[0.98] transition-transform"
          >
            {mayBeLater}
          </button>
        </div>
      </div>
    </div>
  )
}

export function shouldShowRatingPrompt(): boolean {
  const dismissedAt = Number(localStorage.getItem(RATING_PROMPT_KEY)) || 0
  return Date.now() - dismissedAt >= RATING_PROMPT_INTERVAL_MS
}
