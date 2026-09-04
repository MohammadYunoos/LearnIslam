// src/pages/Settings/SettingsPage.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { useAppStore } from '../../store/appStore'
import { logout as clearDevice } from '../../services/authService'
import { useTr, useTrList } from '../../i18n/useTr'
import { isAdmin } from '../../lib/admin'
import { APP_VERSION_NAME } from '../../version'
import { openExternal } from '../../lib/external'

const PRIVACY_URL = 'https://www.termsfeed.com/live/d0b04343-7a7a-4a59-8ff0-a0c223f09a3d'

const MADHAB_LABEL: Record<string, string> = {
  hanafi: 'Hanafi',
  shafi: "Shafi'i",
  maliki: 'Maliki',
  hanbali: 'Hanbali',
  salafi: 'Salafi',
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center px-4 py-3">
      <span className="text-sm text-ink-muted">{label}</span>
      <span className="text-sm font-semibold text-teal-900">{value}</span>
    </div>
  )
}

export function SettingsPage() {
  const navigate = useNavigate()
  const user = useAppStore((s) => s.user)
  const storeLogout = useAppStore((s) => s.logout)

  const [admin, setAdmin] = useState(false)
  useEffect(() => {
    isAdmin().then(setAdmin)
  }, [])

  const handleLogout = () => {
    clearDevice()
    storeLogout()
    navigate('/login', { replace: true })
  }

  const L = useTrList([
    'member',
    'Age',
    'Gender',
    'Madhab',
    'Language',
    'View plans',
    'Log out (clear this device)',
    'Male',
    'Female',
    'Premium',
    'Free',
  ])
  const tMadhabVal = useTr(user ? MADHAB_LABEL[user.madhab] ?? user.madhab : '')

  return (
    <div className="bg-cream min-h-screen pb-20">
      <PageHeader title="Settings" backTo="/home" />

      <div className="px-4 pt-4">
        <div className="bg-white border border-border rounded-2xl p-5 text-center mb-4">
          <div className="w-16 h-16 rounded-full bg-teal-900 text-gold font-arabic text-2xl font-bold flex items-center justify-center mx-auto mb-3">
            {user?.name?.charAt(0).toUpperCase() ?? '?'}
          </div>
          <p className="text-lg font-bold text-teal-900">{user?.name}</p>
          <p className="text-xs text-ink-muted">
            {user?.tier === 'premium' ? L[9] : L[10]} {L[0]}
          </p>
        </div>

        <div className="bg-white border border-border rounded-2xl divide-y divide-border mb-4">
          <Row label={L[1]} value={user?.age ? String(user.age) : '—'} />
          <Row label={L[2]} value={user?.gender === 'female' ? L[8] : user?.gender === 'male' ? L[7] : '—'} />
          <Row label={L[3]} value={user ? tMadhabVal : '—'} />
          <Row label={L[4]} value={user?.language?.toUpperCase() ?? '—'} />
        </div>

        <button
          onClick={() => navigate('/plans')}
          className="w-full bg-gold text-teal-900 font-bold rounded-xl py-3 text-sm mb-3"
        >
          {L[5]}
        </button>

        {admin && (
          <>
            <button
              onClick={() => navigate('/admin/feedback')}
              className="w-full bg-white border border-teal-700 text-teal-900 font-bold rounded-xl py-3 text-sm mb-3"
            >
              🛠 Admin: Feedback
            </button>
            <button
              onClick={() => navigate('/admin/translations')}
              className="w-full bg-white border border-teal-700 text-teal-900 font-bold rounded-xl py-3 text-sm mb-3"
            >
              🌐 Admin: Translations
            </button>
          </>
        )}

        <button
          onClick={handleLogout}
          className="w-full bg-white border border-red-300 text-red-500 font-bold rounded-xl py-3 text-sm"
        >
          {L[6]}
        </button>

        <button
          onClick={() => openExternal(PRIVACY_URL)}
          className="block mx-auto text-xs text-teal-700 underline mt-6"
        >
          Privacy Policy
        </button>
        <p className="text-center text-xs text-ink-muted mt-2">
          Alpha testing build · v{APP_VERSION_NAME}
        </p>
      </div>

      <BottomNav />
    </div>
  )
}
