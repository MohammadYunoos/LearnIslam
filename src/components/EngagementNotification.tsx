import { useNavigate } from 'react-router-dom'
import { useTrList } from '../i18n/useTr'
import type { EngagementNotificationContent } from '../content/engagementNotifications'

interface Props {
  content: EngagementNotificationContent | null
  onClose: () => void
}

export function EngagementNotification({ content, onClose }: Props) {
  const navigate = useNavigate()
  const L = useTrList([
    content?.title ?? '',
    content?.message ?? '',
    content?.benefit ?? '',
    content?.action ?? '',
    'Benefit',
    'Maybe Later',
  ])

  if (!content) return null

  const openSection = () => {
    onClose()
    navigate(content.path)
  }

  return (
    <div className="fixed inset-0 z-[59] bg-black/50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={L[0]}>
      <div className="relative w-full max-w-sm bg-cream border border-gold rounded-lg shadow-2xl overflow-hidden">
        <div className="bg-teal-900 px-5 pt-5 pb-4 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-white/10 flex items-center justify-center text-2xl mb-2" aria-hidden="true">
            {content.icon}
          </div>
          <h2 className="font-arabic text-xl font-bold text-white">{L[0]}</h2>
        </div>

        <div className="px-5 py-5">
          <p className="text-sm text-ink text-center leading-relaxed">{L[1]}</p>
          <div className="mt-4 border-l-4 border-gold bg-white rounded-r-lg px-4 py-3">
            <p className="text-[10px] font-bold uppercase text-gold-dark mb-1">{L[4]}</p>
            <p className="text-xs text-ink-muted leading-relaxed">{L[2]}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-5">
            <button type="button" onClick={openSection} className="bg-teal-900 text-white font-bold rounded-lg py-3 text-sm">
              {L[3]}
            </button>
            <button type="button" onClick={onClose} className="bg-sand border border-border text-teal-900 font-semibold rounded-lg py-3 text-sm">
              {L[5]}
            </button>
          </div>
        </div>

        <button type="button" onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 text-white text-lg" aria-label="Close notification">
          ×
        </button>
      </div>
    </div>
  )
}
