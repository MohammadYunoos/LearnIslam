import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { openExternal } from '../../lib/external'
import { logAnalyticsEvent } from '../../lib/analytics'

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.mymaqtab.app'
const RATING_PROMPT_KEY = 'islamseeko_rating_prompt_dismissed_at'

export function AppRatingPage() {
  const navigate = useNavigate()
  const { lessonId } = useParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRate = async () => {
    setLoading(true)
    setError('')
    try {
      void logAnalyticsEvent('app_rating_initiated', {})
      await openExternal(PLAY_STORE_URL)
      localStorage.setItem(RATING_PROMPT_KEY, String(Date.now()))
      // Go to review page
      navigate(`/maqtab/${lessonId}/review`)
    } catch (e) {
      console.error('Failed to open Play Store:', e)
      setError('Could not open Play Store. Please try again.')
      setLoading(false)
    }
  }

  const handleDismiss = () => {
    localStorage.setItem(RATING_PROMPT_KEY, String(Date.now()))
    void logAnalyticsEvent('app_rating_dismissed', {})
    navigate(`/maqtab/${lessonId}/review`)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-6">
      <div className="bg-cream rounded-2xl p-6 text-center border-t-4 border-gold w-full max-w-sm relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 flex justify-around text-2xl opacity-10">
          <span>⭐</span>
          <span>⭐</span>
          <span>⭐</span>
        </div>

        <div className="text-5xl mb-4">⭐</div>

        <h2 className="text-2xl font-bold text-teal-900 mb-2">Rate Islam Seeko</h2>
        <p className="text-sm text-ink mb-6">
          Help us improve by rating on Play Store. Your feedback helps other learners discover this app.
        </p>

        {error && (
          <p className="text-xs text-red-600 mb-4 bg-red-50 p-2 rounded">{error}</p>
        )}

        <div className="space-y-3">
          <button
            onClick={handleRate}
            disabled={loading}
            className="w-full bg-gradient-to-r from-gold to-gold text-teal-900 font-bold rounded-xl py-3 text-sm active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            {loading ? 'Opening…' : 'Rate Now ⭐'}
          </button>

          <button
            onClick={handleDismiss}
            disabled={loading}
            className="w-full bg-sand text-teal-900 font-semibold rounded-xl py-3 text-sm border border-gold active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            Maybe Later
          </button>
        </div>

        <p className="text-xs text-ink-muted mt-4 leading-relaxed">
          Rating is optional and does not affect your learning.
        </p>
      </div>
    </div>
  )
}
