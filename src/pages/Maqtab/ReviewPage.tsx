// src/pages/Maqtab/ReviewPage.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logAnalyticsEvent } from '../../lib/analytics'

export function ReviewPage() {
  const navigate = useNavigate()
  const [rating, setRating] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const handleRate = async (stars: number) => {
    setRating(stars)
    void logAnalyticsEvent('lesson_review_submitted', { rating: stars })
    setSubmitted(true)
    setTimeout(() => navigate('/maqtab'), 1500)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-6">
      <div className="bg-cream rounded-2xl p-6 text-center border-t-4 border-gold w-full max-w-sm">
        <div className="text-5xl mb-4">🌟</div>

        <h2 className="text-2xl font-bold text-teal-900 mb-2">Mashallah!</h2>
        <p className="text-sm text-ink mb-6">You completed the lesson successfully</p>

        {!submitted ? (
          <>
            <p className="text-xs font-semibold text-ink-muted mb-4">How would you rate this lesson?</p>

            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRate(star)}
                  className="text-4xl transition-transform hover:scale-110 active:scale-95"
                >
                  {star <= rating ? '⭐' : '☆'}
                </button>
              ))}
            </div>

            <button
              onClick={() => navigate('/maqtab')}
              className="text-xs text-ink-muted font-semibold hover:text-ink"
            >
              Skip
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-ink-muted mb-3">Thank you for your feedback! 🙏</p>
            <div className="flex justify-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-2xl">
                  {star <= rating ? '⭐' : ''}
                </span>
              ))}
            </div>
            <p className="text-xs text-gold font-semibold">Returning to lessons…</p>
          </>
        )}
      </div>
    </div>
  )
}
