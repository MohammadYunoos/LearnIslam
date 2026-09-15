// src/pages/Settings/AboutPage.tsx
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { useTr } from '../../i18n/useTr'
import { APP_VERSION_NAME } from '../../version'

export function AboutPage() {
  const tAbout = useTr('About Islam Seeko')

  return (
    <div className="bg-cream min-h-screen pb-20">
      <PageHeader title={tAbout} backTo="/settings" />

      <div className="px-4 pt-4">
        <div className="bg-white border border-border rounded-2xl p-5 mb-4">
          <p className="text-sm text-ink leading-relaxed mb-3">
            Islam Seeko is your personal Islamic learning companion. Learn Qur'an, shariah, dua, and daily practices at your own pace.
          </p>
          <p className="text-sm text-ink leading-relaxed mb-3">
            Whether you're a beginner or advanced, our curated lessons, quizzes, and interactive tools help you deepen your Islamic knowledge and practice.
          </p>
          <p className="text-sm text-ink leading-relaxed">
            Built with dedication to make Islamic education accessible to everyone, everywhere.
          </p>
        </div>

        <div className="bg-gold/10 border border-gold/30 rounded-2xl p-5">
          <p className="text-xs text-ink-muted text-center">
            Version {APP_VERSION_NAME}
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
