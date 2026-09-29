import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import { sendLocalNotification } from '../lib/notificationService'
import {
  engagementCategoryForPath,
  randomEngagementNotification,
  type EngagementCategory,
} from '../content/engagementNotifications'
import { EngagementNotification } from './EngagementNotification'

const NOTIFICATION_INTERVAL_MS = 10 * 60 * 1000
const FIRST_PROMPT_DELAY_MS = 4000
const MODAL_RETRY_MS = 60 * 1000

export function EngagementNotificationManager() {
  const location = useLocation()
  const user = useAppStore((state) => state.user)
  const content = useAppStore((state) => state.engagementNotification)
  const setContent = useAppStore((state) => state.setEngagementNotification)

  useEffect(() => {
    const activeCategory = engagementCategoryForPath(location.pathname)
    if (content?.category === activeCategory) setContent(null)
  }, [content, location.pathname, setContent])

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

      const pathname = window.location.pathname
      const activeCategory = engagementCategoryForPath(pathname)
      const previousId = localStorage.getItem(lastContentKey)
      localStorage.setItem(lastShownKey, String(Date.now()))

      const choices: Array<{ kind: 'donation' | 'engagement'; weight: number; categories?: EngagementCategory[] }> = []
      if (!pathname.startsWith('/donate')) choices.push({ kind: 'donation', weight: 0.5 })
      if (activeCategory !== 'maqtab') {
        choices.push({ kind: 'engagement', weight: 0.3, categories: ['maqtab'] })
      }
      const otherCategoryPool: EngagementCategory[] = ['qa', 'hifz', 'masnoon', 'detoxify', 'masail']
      const otherCategories = otherCategoryPool
        .filter((category) => category !== activeCategory)
      if (otherCategories.length) {
        choices.push({ kind: 'engagement', weight: 0.2, categories: otherCategories })
      }

      const totalWeight = choices.reduce((sum, choice) => sum + choice.weight, 0)
      let pick = Math.random() * totalWeight
      const selected = choices.find((choice) => {
        pick -= choice.weight
        return pick <= 0
      }) ?? choices[choices.length - 1]
      if (!selected) {
        schedule(NOTIFICATION_INTERVAL_MS)
        return
      }

      if (selected.kind === 'donation') {
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
        const next = randomEngagementNotification(previousId, selected.categories)
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
