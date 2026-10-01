// src/pages/Settings/AboutPage.tsx
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { useTr } from '../../i18n/useTr'
import { APP_VERSION_NAME } from '../../version'
import { FirebaseCrashlytics } from '@capacitor-firebase/crashlytics'
import { useState } from 'react'

export function AboutPage() {
  const tAbout = useTr('About Islam Seeko')
  const [throwOnRender, setThrowOnRender] = useState(false)
  if (throwOnRender) throw new Error('Test JS crash (ErrorBoundary)')

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

        {/* TEMP: Crashlytics test buttons — REMOVE before shipping. */}
        <div className="bg-red-50 border border-red-300 rounded-2xl p-5 mt-4 space-y-2">
          <p className="text-xs text-red-600 font-semibold text-center mb-2">
            Crashlytics test (remove before release)
          </p>
          <button
            onClick={() => FirebaseCrashlytics.crash({ message: 'Test native crash' })}
            className="w-full bg-red-600 text-white font-bold rounded-xl py-2 text-sm"
          >
            Trigger native crash
          </button>
          <button
            onClick={() => setThrowOnRender(true)}
            className="w-full bg-red-600 text-white font-bold rounded-xl py-2 text-sm"
          >
            Trigger JS crash
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
