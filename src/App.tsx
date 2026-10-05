// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import type { ReactElement } from 'react'
import { Capacitor } from '@capacitor/core'
import { App as CapacitorApp } from '@capacitor/app'
import { Browser } from '@capacitor/browser'
import { useAppStore } from './store/appStore'
import { supabase } from './lib/supabase'
import { getLocalUser, getSessionUser } from './services/authService'
import { Logo } from './components/Logo'
import { LoginPage } from './pages/Login/LoginPage'
import { HomePage } from './pages/Home/HomePage'
import { GuideHomePage } from './pages/Guide/GuideHomePage'
import { TopicPage } from './pages/Guide/TopicPage'
import { StepPlayerPage } from './pages/Guide/StepPlayerPage'
import { AdaabPage } from './pages/Adaab/AdaabPage'
import { AdaabDetailPage } from './pages/Adaab/AdaabDetailPage'
import { TaleemPage } from './pages/Taleem/TaleemPage'
import { MaqtabPage } from './pages/Maqtab/MaqtabPage'
import { LessonPage } from './pages/Maqtab/LessonPage'
import { QuizPage } from './pages/Maqtab/QuizPage'
import { ReviewPage } from './pages/Maqtab/ReviewPage'
import { KnowledgeCheckPage } from './pages/Maqtab/KnowledgeCheckPage'
import { ExamPage } from './pages/Maqtab/ExamPage'
import { CertificatePage } from './pages/Maqtab/CertificatePage'
import { TopScorersPage } from './pages/Maqtab/TopScorersPage'
import { HifzPage } from './pages/Hifz/HifzPage'
import { HifzSurahPage } from './pages/Hifz/HifzSurahPage'
import { WajifaListPage } from './pages/Wajifa/WajifaListPage'
import { TasbihPage } from './pages/Wajifa/TasbihPage'
import { DetoxifyPage } from './pages/Detoxify/DetoxifyPage'
import { AnalyzerPage } from './pages/Analyzer/AnalyzerPage'
import { InvitePage } from './pages/Invite/InvitePage'
import { DonationsPage } from './pages/Donations/DonationsPage'
import { PlansPage } from './pages/Plans/PlansPage'
import { SettingsPage } from './pages/Settings/SettingsPage'
import { AboutPage } from './pages/Settings/AboutPage'
import { TermsPage } from './pages/Settings/TermsPage'
import { DisclaimerPage } from './pages/Settings/DisclaimerPage'
import { ContactPage } from './pages/Settings/ContactPage'
import { DeleteAccountPage } from './pages/Settings/DeleteAccountPage'
import { FeedbackPage } from './pages/Admin/FeedbackPage'
import { TranslationsPage } from './pages/Admin/TranslationsPage'
import { TutorialPage } from './pages/Tutorial/TutorialPage'
import { QiblaPage } from './pages/Qibla/QiblaPage'
import { NamaazPage } from './pages/Namaaz/NamaazPage'
import { ErrorBoundary } from './components/ErrorBoundary'
import { UpdateBanner } from './components/UpdateBanner'
import { ReportButton } from './components/ReportButton'
import { TranslationOverlay } from './components/TranslationOverlay'
import { DonationNotification } from './components/DonationNotification'
import { MaqtabProgressNotification } from './components/MaqtabProgressNotification'
import { EngagementNotificationManager } from './components/EngagementNotificationManager'
import { engagementById } from './content/engagementNotifications'
import { useLang } from './i18n/useTr'
import { ensureLang } from './services/translate'
import { LocalNotifications } from '@capacitor/local-notifications'
import { logAnalyticsEvent, logScreenView, setAnalyticsUserId } from './lib/analytics'
import { registerForPushNotifications, addPushTapListener } from './lib/push'

// Shared by local-notification taps and FCM push taps so both sources drive
// the same in-app modals via one dispatch contract (actionTypeId/type + extra/data).
function dispatchNotificationAction(actionTypeId: string | undefined, extra: any) {
  if (actionTypeId === 'maqtab-progress') {
    const { setShowMaqtabNotification, setMaqtabNotificationType } = useAppStore.getState()
    setMaqtabNotificationType(extra?.type === 'incomplete' ? 'incomplete' : 'start')
    setShowMaqtabNotification(true)
  } else if (actionTypeId === 'engagement') {
    const content = engagementById(extra?.id)
    if (content) useAppStore.getState().setEngagementNotification(content)
  } else if (actionTypeId === 'donation-reminder') {
    const state = useAppStore.getState()
    state.setDonationNotificationType('reminder')
    state.setShowDonationNotification(true)
  }
}

// Prime the offline translation cache + background-sync whenever the language
// changes (no-op for English).
function LangSync() {
  const lang = useLang()
  useEffect(() => {
    void ensureLang(lang)
  }, [lang])
  return null
}

// Named sections that get their own analytics event (in addition to the
// generic screen_view fired for every route) — fires once per section entry,
// not on every sub-page navigation within the same section.
const SECTION_EVENTS: Array<{ prefix: string; event: string }> = [
  { prefix: '/guide', event: 'masail_viewed' },
  { prefix: '/detoxify', event: 'detoxify_viewed' },
  { prefix: '/adaab', event: 'adaab_viewed' },
  { prefix: '/namaaz-timings', event: 'namaaz_viewed' },
  { prefix: '/qibla', event: 'qibla_viewed' },
]

function AnalyticsRouteTracker() {
  const location = useLocation()
  const lastSection = useRef<string | null>(null)

  useEffect(() => {
    void logScreenView(location.pathname)

    const section = SECTION_EVENTS.find((s) => location.pathname.startsWith(s.prefix))
    if (section && lastSection.current !== section.prefix) {
      void logAnalyticsEvent(section.event)
    }
    lastSection.current = section?.prefix ?? null
  }, [location.pathname])

  return null
}

function DonationNotificationContainer() {
  const location = useLocation()
  const { showDonationNotification, setShowDonationNotification, donationNotificationType, firstRunSuppressed } =
    useAppStore()
  const isDonationPage = location.pathname.startsWith('/donate')
  useEffect(() => {
    if (isDonationPage && showDonationNotification) setShowDonationNotification(false)
  }, [isDonationPage, setShowDonationNotification, showDonationNotification])
  return (
    <DonationNotification
      isOpen={showDonationNotification && !isDonationPage && !firstRunSuppressed}
      type={donationNotificationType}
      onClose={() => setShowDonationNotification(false)}
    />
  )
}

function MaqtabProgressNotificationContainer() {
  const location = useLocation()
  const { showMaqtabNotification, setShowMaqtabNotification, maqtabNotificationType, appOpenSuppressed, firstRunSuppressed } =
    useAppStore()
  const isMaqtabPage = location.pathname.startsWith('/maqtab')
  useEffect(() => {
    if (isMaqtabPage && showMaqtabNotification) setShowMaqtabNotification(false)
  }, [isMaqtabPage, setShowMaqtabNotification, showMaqtabNotification])
  return (
    <MaqtabProgressNotification
      isOpen={showMaqtabNotification && !isMaqtabPage && !appOpenSuppressed && !firstRunSuppressed}
      type={maqtabNotificationType}
      onClose={() => setShowMaqtabNotification(false)}
    />
  )
}

function SplashScreen() {
  return (
    <div className="flex items-center justify-center h-screen bg-teal-900">
      <div className="text-center">
        <Logo size={72} className="mx-auto mb-4" />
        <p className="font-arabic text-4xl text-gold font-bold">Islam Seeko</p>
        <p className="text-sand text-xs mt-1 tracking-widest uppercase">Learn Islam</p>
        <p className="text-sand text-sm mt-3">Loading...</p>
      </div>
    </div>
  )
}

// Decide the landing route from auth state: logged in → Home, else Login.
function RootRedirect() {
  const user = useAppStore((s) => s.user)
  const needsProfile = useAppStore((s) => s.needsProfile)
  if (user && !needsProfile) return <Navigate to="/home" replace />
  return <Navigate to="/login" replace />
}

function PrivateRoute({ element }: { element: ReactElement }) {
  const user = useAppStore((s) => s.user)
  const needsProfile = useAppStore((s) => s.needsProfile)
  if (!user) return <Navigate to="/login" replace />
  // Signed in but profile not completed → force the login/profile screen.
  if (needsProfile) return <Navigate to="/login" replace />
  return element
}

export default function App() {
  const setUser = useAppStore((s) => s.setUser)
  const setNeedsProfile = useAppStore((s) => s.setNeedsProfile)
  const setAppOpenSuppressed = useAppStore((s) => s.setAppOpenSuppressed)
  const setFirstRunSuppressed = useAppStore((s) => s.setFirstRunSuppressed)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    // Suppress notifications for 5 min on app open
    setAppOpenSuppressed(true)
    const suppressTimer = setTimeout(() => {
      if (active) setAppOpenSuppressed(false)
    }, 5 * 60 * 1000)

    // Check if first run
    let firstRunTimer: ReturnType<typeof setTimeout> | undefined
    const isFirstRun = !localStorage.getItem('app_launched_before')
    if (isFirstRun) {
      setFirstRunSuppressed(true)
      firstRunTimer = setTimeout(() => {
        if (active) setFirstRunSuppressed(false)
      }, 5 * 60 * 1000)
      localStorage.setItem('app_launched_before', 'true')
    }

    async function loadSession(forceRefresh = false) {
      const res = await getSessionUser(forceRefresh)
      if (!active) return
      if (res) {
        setUser(res.user)
        setNeedsProfile(!res.hasProfile)
        void setAnalyticsUserId(res.user.id)
        void registerForPushNotifications()
        return true
      }
      return false
    }

    async function bootstrap() {
      const local = getLocalUser()
      if (local) {
        setUser(local)
        setLoading(false)
      }
      const signedIn = await loadSession(true)
      if (!signedIn && local && active) setUser(local)
      if (active) setLoading(false)
    }
    bootstrap()

    // React to sign-in / sign-out.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') loadSession(true)
      if (event === 'SIGNED_OUT') {
        setUser(null)
        setNeedsProfile(false)
        void setAnalyticsUserId(null)
      }
    })

    // Native: handle the OAuth deep-link return and complete the PKCE exchange.
    let removeListener: (() => void) | undefined
    let removeNotificationListener: (() => void) | undefined
    let removePushListener: (() => void) | undefined
    if (Capacitor.isNativePlatform()) {
      CapacitorApp.addListener('appUrlOpen', async ({ url }) => {
        if (url && url.startsWith('com.mymaqtab.app://auth')) {
          // Pull the PKCE code out of the deep-link. exchangeCodeForSession
          // wants the raw code, NOT the whole URL (passing the URL throws and
          // leaves the browser stuck on "Please wait…").
          let code: string | null = null
          try {
            code = new URL(url).searchParams.get('code')
          } catch {
            const m = url.match(/[?&]code=([^&]+)/)
            code = m ? decodeURIComponent(m[1]) : null
          }
          try {
            if (code) {
              await supabase.auth.exchangeCodeForSession(code)
              await loadSession()
            }
          } catch (e) {
            console.error('OAuth exchange failed', e)
          } finally {
            // Always dismiss the system browser so the app comes back to front.
            try {
              await Browser.close()
            } catch {
              /* no-op on web */
            }
          }
        }
      }).then((h) => {
        removeListener = () => h.remove()
      })

      // Listen for local notification taps
      LocalNotifications.addListener(
        'localNotificationActionPerformed',
        async (notification: any) => {
          dispatchNotificationAction(
            notification.notification.actionTypeId,
            notification.notification.extra
          )
        }
      ).then((h: any) => {
        removeNotificationListener = () => h.remove()
      })

      // Push notification taps (FCM) drive the same modals as local
      // notifications — see dispatchNotificationAction.
      removePushListener = addPushTapListener((data) => {
        dispatchNotificationAction(data.type, data)
      })
    }

    return () => {
      active = false
      clearTimeout(suppressTimer)
      if (firstRunTimer) clearTimeout(firstRunTimer)
      sub.subscription.unsubscribe()
      removeListener?.()
      removeNotificationListener?.()
      removePushListener?.()
    }
  }, [setUser, setNeedsProfile])

  if (loading) return <SplashScreen />

  return (
    <ErrorBoundary>
    <BrowserRouter>
      <LangSync />
      <AnalyticsRouteTracker />
      <TranslationOverlay />
      <UpdateBanner />
      <ReportButton />
      <DonationNotificationContainer />
      <MaqtabProgressNotificationContainer />
      <EngagementNotificationManager />
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<PrivateRoute element={<HomePage />} />} />
        <Route path="/tutorial" element={<PrivateRoute element={<TutorialPage />} />} />
        <Route path="/guide" element={<PrivateRoute element={<GuideHomePage />} />} />
        <Route path="/guide/:slug" element={<PrivateRoute element={<TopicPage />} />} />
        <Route path="/guide/:slug/steps" element={<PrivateRoute element={<StepPlayerPage />} />} />
        <Route path="/adaab" element={<PrivateRoute element={<AdaabPage />} />} />
        <Route path="/adaab/:slug" element={<PrivateRoute element={<AdaabDetailPage />} />} />
        <Route path="/taleem" element={<PrivateRoute element={<TaleemPage />} />} />
        <Route path="/maqtab" element={<PrivateRoute element={<MaqtabPage />} />} />
        <Route path="/maqtab/knowledge-check" element={<PrivateRoute element={<KnowledgeCheckPage />} />} />
        <Route path="/maqtab/exam" element={<PrivateRoute element={<ExamPage />} />} />
        <Route path="/maqtab/certificate" element={<PrivateRoute element={<CertificatePage />} />} />
        <Route path="/maqtab/top-scorers" element={<PrivateRoute element={<TopScorersPage />} />} />
        <Route path="/maqtab/:lessonId" element={<PrivateRoute element={<LessonPage />} />} />
        <Route
          path="/maqtab/:lessonId/quiz"
          element={<PrivateRoute element={<QuizPage />} />}
        />
        <Route
          path="/maqtab/:lessonId/review"
          element={<PrivateRoute element={<ReviewPage />} />}
        />
        <Route path="/hifz" element={<PrivateRoute element={<HifzPage />} />} />
        <Route path="/hifz/:slug" element={<PrivateRoute element={<HifzSurahPage />} />} />
        <Route path="/wajifa" element={<PrivateRoute element={<WajifaListPage />} />} />
        <Route path="/wajifa/:slug" element={<PrivateRoute element={<TasbihPage />} />} />
        <Route path="/detoxify" element={<PrivateRoute element={<DetoxifyPage />} />} />
        <Route path="/qibla" element={<PrivateRoute element={<QiblaPage />} />} />
        <Route path="/namaaz-timings" element={<PrivateRoute element={<NamaazPage />} />} />
        <Route path="/analyzer" element={<PrivateRoute element={<AnalyzerPage />} />} />
        <Route path="/invite" element={<PrivateRoute element={<InvitePage />} />} />
        <Route path="/plans" element={<PrivateRoute element={<PlansPage />} />} />
        <Route path="/donate" element={<DonationsPage />} />
        <Route path="/settings" element={<PrivateRoute element={<SettingsPage />} />} />
        <Route path="/settings/about" element={<PrivateRoute element={<AboutPage />} />} />
        <Route path="/settings/terms" element={<PrivateRoute element={<TermsPage />} />} />
        <Route path="/settings/disclaimer" element={<PrivateRoute element={<DisclaimerPage />} />} />
        <Route path="/settings/contact" element={<PrivateRoute element={<ContactPage />} />} />
        <Route path="/settings/delete-account" element={<PrivateRoute element={<DeleteAccountPage />} />} />
        <Route path="/admin/feedback" element={<PrivateRoute element={<FeedbackPage />} />} />
        <Route path="/admin/translations" element={<PrivateRoute element={<TranslationsPage />} />} />
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
    </ErrorBoundary>
  )
}
