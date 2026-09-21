// src/components/BottomNav.tsx
import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import { useTrList } from '../i18n/useTr'

const NAV_ITEMS = [
  { label: 'Home', icon: '🏠', path: '/home' },
  { label: 'Maqtab', icon: '📖', path: '/maqtab' },
  { label: 'Hifz', icon: '⭐', path: '/hifz' },
  { label: 'Donate', icon: '💗', path: '/donate' },
  { label: 'Invite', icon: '🎁', path: '/invite' },
  { label: 'Muhasaba', icon: '📊', path: '/analyzer' },
]

export function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const labels = useTrList(NAV_ITEMS.map((i) => i.label))
  const { setShowDonationNotification, setDonationNotificationType } = useAppStore()

  // Show donation notification randomly when navigating (once per session only)
  useEffect(() => {
    const currentPath = location.pathname
    const isValidPath = !['/donate', '/login'].includes(currentPath)
    const sessionId = sessionStorage.getItem('mymaqtab_session_id') || String(Date.now())
    if (!sessionStorage.getItem('mymaqtab_session_id')) {
      sessionStorage.setItem('mymaqtab_session_id', sessionId)
    }

    const notificationShownKey = `mymaqtab_donation_shown_${sessionId}`
    const alreadyShown = sessionStorage.getItem(notificationShownKey)

    if (isValidPath && !alreadyShown && Math.random() < 0.1) {
      sessionStorage.setItem(notificationShownKey, 'true')
      setTimeout(() => {
        setDonationNotificationType('session')
        setShowDonationNotification(true)
      }, 500)
    }
  }, [location.pathname, setShowDonationNotification, setDonationNotificationType])

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border flex z-40 max-w-lg mx-auto safe-bottom">
      {NAV_ITEMS.map((item, idx) => {
        const active = location.pathname.startsWith(item.path)
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex-1 flex flex-col items-center py-2 pb-4 text-xs font-semibold transition-colors ${
              active ? 'text-teal-900' : 'text-ink-muted'
            }`}
          >
            <span className="text-base mb-0.5">{item.icon}</span>
            {labels[idx]}
          </button>
        )
      })}
    </div>
  )
}
