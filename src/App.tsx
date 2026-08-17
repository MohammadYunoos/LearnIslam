// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import { Capacitor } from '@capacitor/core'
import { App as CapacitorApp } from '@capacitor/app'
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
import { HifzPage } from './pages/Hifz/HifzPage'
import { HifzSurahPage } from './pages/Hifz/HifzSurahPage'
import { WajifaListPage } from './pages/Wajifa/WajifaListPage'
import { TasbihPage } from './pages/Wajifa/TasbihPage'
import { DetoxifyPage } from './pages/Detoxify/DetoxifyPage'
import { MasailPage } from './pages/Masail/MasailPage'
import { AnalyzerPage } from './pages/Analyzer/AnalyzerPage'
import { UlemaListPage } from './pages/Ulema/UlemaListPage'
import { UlemaProfilePage } from './pages/Ulema/UlemaProfilePage'
import { MessagesPage } from './pages/Messages/MessagesPage'
import { ThreadPage } from './pages/Messages/ThreadPage'
import { PlansPage } from './pages/Plans/PlansPage'
import { SettingsPage } from './pages/Settings/SettingsPage'
import { FeedbackPage } from './pages/Admin/FeedbackPage'
import { TranslationsPage } from './pages/Admin/TranslationsPage'
import { UpdateBanner } from './components/UpdateBanner'
import { ReportButton } from './components/ReportButton'

function SplashScreen() {
  return (
    <div className="flex items-center justify-center h-screen bg-teal-900">
      <div className="text-center">
        <Logo size={72} className="mx-auto mb-4" />
        <p className="font-arabic text-4xl text-gold font-bold">Islam Seekho</p>
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadSession() {
      const res = await getSessionUser()
      if (!active) return
      if (res) {
        setUser(res.user)
        setNeedsProfile(!res.hasProfile)
        return true
      }
      return false
    }

    async function bootstrap() {
      const signedIn = await loadSession()
      if (!signedIn) {
        const local = getLocalUser()
        if (local) setUser(local)
      }
      if (active) setLoading(false)
    }
    bootstrap()

    // React to sign-in / sign-out.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') loadSession()
      if (event === 'SIGNED_OUT') {
        setUser(null)
        setNeedsProfile(false)
      }
    })

    // Native: handle the OAuth deep-link return and complete the PKCE exchange.
    let removeListener: (() => void) | undefined
    if (Capacitor.isNativePlatform()) {
      CapacitorApp.addListener('appUrlOpen', async ({ url }) => {
        if (url && url.startsWith('com.learnislam.app://auth')) {
          try {
            await supabase.auth.exchangeCodeForSession(url)
          } catch {
            /* ignore */
          }
        }
      }).then((h) => {
        removeListener = () => h.remove()
      })
    }

    return () => {
      active = false
      sub.subscription.unsubscribe()
      removeListener?.()
    }
  }, [setUser, setNeedsProfile])

  if (loading) return <SplashScreen />

  return (
    <BrowserRouter>
      <UpdateBanner />
      <ReportButton />
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<PrivateRoute element={<HomePage />} />} />
        <Route path="/guide" element={<PrivateRoute element={<GuideHomePage />} />} />
        <Route path="/guide/:slug" element={<PrivateRoute element={<TopicPage />} />} />
        <Route path="/guide/:slug/steps" element={<PrivateRoute element={<StepPlayerPage />} />} />
        <Route path="/adaab" element={<PrivateRoute element={<AdaabPage />} />} />
        <Route path="/adaab/:slug" element={<PrivateRoute element={<AdaabDetailPage />} />} />
        <Route path="/taleem" element={<PrivateRoute element={<TaleemPage />} />} />
        <Route path="/maqtab" element={<PrivateRoute element={<MaqtabPage />} />} />
        <Route path="/maqtab/:lessonId" element={<PrivateRoute element={<LessonPage />} />} />
        <Route
          path="/maqtab/:lessonId/quiz"
          element={<PrivateRoute element={<QuizPage />} />}
        />
        <Route path="/hifz" element={<PrivateRoute element={<HifzPage />} />} />
        <Route path="/hifz/:slug" element={<PrivateRoute element={<HifzSurahPage />} />} />
        <Route path="/wajifa" element={<PrivateRoute element={<WajifaListPage />} />} />
        <Route path="/wajifa/:slug" element={<PrivateRoute element={<TasbihPage />} />} />
        <Route path="/detoxify" element={<PrivateRoute element={<DetoxifyPage />} />} />
        <Route path="/masail" element={<PrivateRoute element={<MasailPage />} />} />
        <Route path="/analyzer" element={<PrivateRoute element={<AnalyzerPage />} />} />
        <Route path="/ulema" element={<PrivateRoute element={<UlemaListPage />} />} />
        <Route path="/ulema/:id" element={<PrivateRoute element={<UlemaProfilePage />} />} />
        <Route path="/messages" element={<PrivateRoute element={<MessagesPage />} />} />
        <Route
          path="/messages/:ulemaId"
          element={<PrivateRoute element={<ThreadPage />} />}
        />
        <Route path="/plans" element={<PrivateRoute element={<PlansPage />} />} />
        <Route path="/settings" element={<PrivateRoute element={<SettingsPage />} />} />
        <Route path="/admin/feedback" element={<PrivateRoute element={<FeedbackPage />} />} />
        <Route path="/admin/translations" element={<PrivateRoute element={<TranslationsPage />} />} />
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  )
}
