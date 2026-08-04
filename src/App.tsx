// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import { useAppStore } from './store/appStore'
import { getLocalUser } from './services/authService'
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

function SplashScreen() {
  return (
    <div className="flex items-center justify-center h-screen bg-teal-900">
      <div className="text-center">
        <p className="font-arabic text-4xl text-gold font-bold">My Maqtab</p>
        <p className="text-sand text-sm mt-2">Loading...</p>
      </div>
    </div>
  )
}

function PrivateRoute({ element }: { element: ReactElement }) {
  const user = useAppStore((s) => s.user)
  return user ? element : <Navigate to="/login" replace />
}

export default function App() {
  const setUser = useAppStore((s) => s.setUser)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check localStorage for an existing user — no API call needed
    const local = getLocalUser()
    if (local) setUser(local)
    setLoading(false)
  }, [setUser])

  if (loading) return <SplashScreen />

  return (
    <BrowserRouter>
      <Routes>
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
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
