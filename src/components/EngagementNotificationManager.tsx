import { useEffect } from 'react'
import { useAppStore } from '../store/appStore'
import { sendLocalNotification } from '../lib/notificationService'
import { randomEngagementNotification } from '../content/engagementNotifications'
import { EngagementNotification } from './EngagementNotification'

const NOTIFICATION_INTERVAL_MS = 10 * 60 * 1000
const FIRST_PROMPT_DELAY_MS = 4000
const MODAL_RETRY_MS = 60 * 1000

export function EngagementNotificationManager() {
  const user = useAppStore((state) => state.user)
  const content = useAppStore((state) => state.engagementNotification)
  const setContent = useAppStore((state) => state.setEngagementNotification)

  useEffect(() => {
    if (!user) return

    const lastShownKey = `islamseeko_engagement_last_${user.id}`
    const lastContentKey = `islamseeko_engagement_content_${user.id}`
    let timer = 0

    const schedule = (delay: number) => {
      window.clearTimeout(timer)
      timer = window.setTimeout(showWhenAvailable, delay)
    }

    const showWhenAvailable = () => {
      const state = useAppStore.getState()
      const anotherModalIsOpen =
        state.showDonationNotification ||
        state.showMaqtabNotification ||
        state.engagementNotification !== null ||
        (window.location.pathname === '/home' && state.showHadeesPopup)

      if (anotherModalIsOpen) {
        schedule(MODAL_RETRY_MS)
        return
      }

      const previousId = localStorage.getItem(lastContentKey)
      const roll = Math.random()
      localStorage.setItem(lastShownKey, String(Date.now()))

      if (roll < 0.5) {
        localStorage.setItem(lastContentKey, 'donation')
        state.setDonationNotificationType('reminder')
        state.setShowDonationNotification(true)
        void sendLocalNotification({
          title: 'Support Islam Seeko',
          body: 'Help us continue providing free Islamic education and useful learning resources.',
          actionTypeId: 'donation-reminder',
          data: { path: '/donate' },
        })
      } else {
        const categories = roll < 0.8
          ? (['maqtab'] as const)
          : (['qa', 'hifz', 'masnoon', 'detoxify', 'masail'] as const)
        const next = randomEngagementNotification(previousId, [...categories])
        localStorage.setItem(lastContentKey, next.id)
        setContent(next)
        void sendLocalNotification({
          title: next.title,
          body: `${next.message} ${next.benefit}`,
          actionTypeId: 'engagement',
          data: { id: next.id, path: next.path },
        })
      }

      schedule(NOTIFICATION_INTERVAL_MS)
    }

    const lastShown = Number(localStorage.getItem(lastShownKey)) || 0
    const elapsed = Date.now() - lastShown
    const initialDelay = lastShown
      ? Math.max(FIRST_PROMPT_DELAY_MS, NOTIFICATION_INTERVAL_MS - elapsed)
      : FIRST_PROMPT_DELAY_MS
    schedule(initialDelay)

    return () => window.clearTimeout(timer)
  }, [user, setContent])

  return <EngagementNotification content={content} onClose={() => setContent(null)} />
}
