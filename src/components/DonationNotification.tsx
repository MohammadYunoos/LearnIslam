// src/components/DonationNotification.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import { useTrList } from '../i18n/useTr'

type NotificationType = 'reminder' | 'post-lesson' | 'session'

interface DonationNotificationProps {
  isOpen: boolean
  type: NotificationType
  onClose: () => void
}

const HADITH_QUOTES = [
  {
    text: 'Charity extinguishes the anger of the Lord.',
    source: 'Tirmidhi',
  },
  {
    text: 'The best of you are those who are best to their families, and I am the best among you to my family.',
    source: 'Tirmidhi',
  },
  {
    text: 'Every act of charity is a sadaqah, even meeting your brother with a cheerful face.',
    source: 'Tirmidhi',
  },
  {
    text: 'Wealth and children are adornments of life, but the everlasting good deeds are better.',
    source: 'Quran 18:46',
  },
  {
    text: 'The best charity is given when one is in need yet gives.',
    source: 'Islamic Teaching',
  },
]

export function DonationNotification({ isOpen, type, onClose }: DonationNotificationProps) {
  const navigate = useNavigate()
  const { setShowDonationNotification } = useAppStore()

  const L = useTrList([
    'Support Islam Seeko', // 0
    'Help us continue providing free Islamic education.',
    'Your donations help support app development, content creation, and maintenance.',
    'Donate Now', // 3
    'Maybe Later', // 4
    'Thank You for Your Support!', // 5
    'Congratulations on completing this lesson! 🎉',
    'Consider supporting Islam Seeko to help us create more content.',
    'Your support helps us continue providing free Islamic education.', // 8
  ])

  const [randomHadith] = useState(() =>
    HADITH_QUOTES[Math.floor(Math.random() * HADITH_QUOTES.length)]
  )

  const handleDonate = () => {
    setShowDonationNotification(false)
    navigate('/donate')
  }

  const titles: Record<NotificationType, string> = {
    session: L[0],
    'post-lesson': L[5],
    reminder: L[0],
  }

  const messages: Record<NotificationType, string> = {
    session: L[1],
    'post-lesson': L[6],
    reminder: L[8],
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-cream rounded-3xl shadow-2xl max-w-md w-full p-6 border-2 border-gold">
        {/* Header with floral elements */}
        <div className="text-center mb-4">
          <div className="text-3xl mb-2">🌸 ❤️ 🌸</div>
          <h2 className="text-2xl font-bold text-teal-900">{titles[type]}</h2>
        </div>

        {/* Message */}
        <p className="text-sm text-ink-muted mb-4 text-center leading-relaxed">
          {messages[type]}
        </p>

        {/* Hadith Quote */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-gold rounded-lg p-4 mb-4">
          <p className="text-xs text-teal-900 italic leading-relaxed">
            "{randomHadith.text}"
          </p>
          <p className="text-xs text-ink-muted mt-2 text-right">
            — {randomHadith.source}
          </p>
        </div>

        {/* Islamic encouragement text */}
        <p className="text-xs text-center text-ink-muted mb-5 leading-relaxed">
          "The best among you are those who are best to others. Help us spread Islamic knowledge to millions."
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleDonate}
            className="flex-1 bg-gradient-to-r from-teal-800 to-teal-900 text-white font-bold rounded-xl py-3 text-sm active:scale-[0.98] transition-transform shadow-md"
          >
            {L[3]}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-sand text-teal-900 font-semibold rounded-xl py-3 text-sm active:scale-[0.98] transition-transform border border-gold"
          >
            {L[4]}
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-ink-muted hover:text-ink text-lg"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
