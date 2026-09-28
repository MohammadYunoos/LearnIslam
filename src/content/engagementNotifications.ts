export type EngagementCategory =
  | 'maqtab'
  | 'qa'
  | 'hifz'
  | 'masnoon'
  | 'detoxify'
  | 'masail'

export interface EngagementNotificationContent {
  id: string
  category: EngagementCategory
  icon: string
  title: string
  message: string
  benefit: string
  action: string
  path: string
}

export const ENGAGEMENT_NOTIFICATIONS: EngagementNotificationContent[] = [
  {
    id: 'maqtab-step-by-step',
    category: 'maqtab',
    icon: '📖',
    title: 'Continue Your Maqtab Journey',
    message: 'A short lesson today keeps your learning journey moving forward.',
    benefit: 'Build Islamic knowledge step by step and retain it through quizzes.',
    action: 'Open Maqtab',
    path: '/maqtab',
  },
  {
    id: 'maqtab-consistency',
    category: 'maqtab',
    icon: '🎓',
    title: 'Make Progress Today',
    message: 'Return to your chapters and complete the next lesson.',
    benefit: 'Consistent learning turns small efforts into lasting understanding.',
    action: 'Continue Learning',
    path: '/maqtab',
  },
  {
    id: 'qa-understanding',
    category: 'qa',
    icon: '📚',
    title: 'Explore Islamic Q & A',
    message: 'Take a few minutes to explore a question and its detailed answer.',
    benefit: 'Clear explanations help strengthen understanding and remove confusion.',
    action: 'Read Q & A',
    path: '/taleem',
  },
  {
    id: 'qa-curiosity',
    category: 'qa',
    icon: '💡',
    title: 'Turn Curiosity Into Knowledge',
    message: 'Discover answers to practical questions about Islamic life.',
    benefit: 'Regular reading helps you make informed choices with confidence.',
    action: 'Explore Answers',
    path: '/taleem',
  },
  {
    id: 'hifz-revision',
    category: 'hifz',
    icon: '⭐',
    title: 'Keep Your Hifz Strong',
    message: 'Revise a few ayahs now and protect what you have memorized.',
    benefit: 'Frequent revision strengthens recall and builds consistency with the Qur’an.',
    action: 'Start Revision',
    path: '/hifz',
  },
  {
    id: 'hifz-small-steps',
    category: 'hifz',
    icon: '🌙',
    title: 'One Ayah at a Time',
    message: 'A small memorization session can make meaningful progress.',
    benefit: 'Short, repeated practice makes memorization easier to sustain.',
    action: 'Open Hifz',
    path: '/hifz',
  },
  {
    id: 'masnoon-routine',
    category: 'masnoon',
    icon: '🤲',
    title: 'Bring Duas Into Your Day',
    message: 'Learn one Masnoon dua and connect it to your daily routine.',
    benefit: 'Daily duas turn ordinary moments into remembrance and worship.',
    action: 'Learn a Dua',
    path: '/wajifa',
  },
  {
    id: 'masnoon-zikr',
    category: 'masnoon',
    icon: '📿',
    title: 'Pause for Zikr',
    message: 'Take a quiet moment to remember Allah with a short zikr.',
    benefit: 'Regular remembrance brings focus, gratitude, and calm to the heart.',
    action: 'Begin Zikr',
    path: '/wajifa',
  },
  {
    id: 'detoxify-heart',
    category: 'detoxify',
    icon: '🌿',
    title: 'Nurture a Healthier Heart',
    message: 'Reflect on one habit and take a small step toward better character.',
    benefit: 'Self-reflection helps identify harmful habits and strengthen good qualities.',
    action: 'Open Detoxify',
    path: '/detoxify',
  },
  {
    id: 'detoxify-akhlaq',
    category: 'detoxify',
    icon: '✨',
    title: 'Improve Your Akhlaq',
    message: 'Choose one character lesson to practice today.',
    benefit: 'Intentional practice builds patience, sincerity, and kindness over time.',
    action: 'Start Reflection',
    path: '/detoxify',
  },
  {
    id: 'masail-practice',
    category: 'masail',
    icon: '💧',
    title: 'Refresh Your Masail',
    message: 'Review a practical topic such as wudu, ghusl, or salah.',
    benefit: 'Knowing essential rulings helps you perform daily worship with confidence.',
    action: 'Study Masail',
    path: '/guide',
  },
  {
    id: 'masail-foundations',
    category: 'masail',
    icon: '🕌',
    title: 'Strengthen the Foundations',
    message: 'Spend a few minutes reviewing an essential practice of worship.',
    benefit: 'Regular revision keeps important steps clear and easy to remember.',
    action: 'Review a Topic',
    path: '/guide',
  },
]

export function engagementById(id: string | undefined) {
  return ENGAGEMENT_NOTIFICATIONS.find((item) => item.id === id)
}

export function randomEngagementNotification(
  previousId?: string | null,
  categories?: EngagementCategory[],
) {
  const choices = ENGAGEMENT_NOTIFICATIONS.filter(
    (item) => item.id !== previousId && (!categories || categories.includes(item.category)),
  )
  return choices[Math.floor(Math.random() * choices.length)] ?? ENGAGEMENT_NOTIFICATIONS[0]
}
