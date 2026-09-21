import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import { useTrList } from '../i18n/useTr'

type MaqtabNotificationType = 'incomplete' | 'start'

interface MaqtabProgressNotificationProps {
  isOpen: boolean
  type: MaqtabNotificationType
  onClose: () => void
}

const HADITH_QUOTES = [
  {
    text: 'The best of you are those who learn the Qur\'an and teach it.',
    source: 'Tirmidhi',
  },
  {
    text: 'Seek knowledge from the cradle to the grave.',
    source: 'Islamic Teaching',
  },
  {
    text: 'Whoever walks a path in search of knowledge, Allah will make easy for him the path to Paradise.',
    source: 'Muslim',
  },
  {
    text: 'Knowledge is better than wealth. Knowledge protects you; you must protect wealth.',
    source: 'Islamic Teaching',
  },
  {
    text: 'The seekers of knowledge are the inheritors of the prophets.',
    source: 'Tirmidhi',
  },
]

export function MaqtabProgressNotification({
  isOpen,
  type,
  onClose,
}: MaqtabProgressNotificationProps) {
  const navigate = useNavigate()
  const { setShowMaqtabNotification } = useAppStore()

  const L = useTrList([
    'Continue Your Journey', // 0
    'You have an incomplete lesson. Complete it to unlock the next chapter!',
    'Start Learning Today', // 2
    'Begin your Islamic education journey with our first Maqtab lesson.',
    'Go to Maqtab', // 4
    'Maybe Later', // 5
    'Knowledge is the light of the heart',
  ])

  const [randomHadith] = useState(() =>
    HADITH_QUOTES[Math.floor(Math.random() * HADITH_QUOTES.length)]
  )

  const handleNavigate = () => {
    setShowMaqtabNotification(false)
    navigate('/maqtab')
  }

  const titles: Record<MaqtabNotificationType, string> = {
    incomplete: L[0],
    start: L[2],
  }

  const messages: Record<MaqtabNotificationType, string> = {
    incomplete: L[1],
    start: L[3],
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-cream rounded-3xl shadow-2xl max-w-md w-full p-6 border-2 border-gold">
        {/* Header with Islamic elements */}
        <div className="text-center mb-4">
          <div className="text-3xl mb-2">📖 ✨ 📖</div>
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

        {/* Islamic encouragement */}
        <p className="text-xs text-center text-ink-muted mb-5 leading-relaxed">
          {L[6]} 💡
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleNavigate}
            className="flex-1 bg-gradient-to-r from-teal-800 to-teal-900 text-white font-bold rounded-xl py-3 text-sm active:scale-[0.98] transition-transform shadow-md"
          >
            {L[4]}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-sand text-teal-900 font-semibold rounded-xl py-3 text-sm active:scale-[0.98] transition-transform border border-gold"
          >
            {L[5]}
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
