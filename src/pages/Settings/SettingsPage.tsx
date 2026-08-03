// src/pages/Settings/SettingsPage.tsx
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { useAppStore } from '../../store/appStore'
import { logout as clearDevice } from '../../services/authService'

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

  const handleLogout = () => {
    clearDevice()
    storeLogout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="bg-cream min-h-screen pb-20">
      <PageHeader title="Settings" backTo="/home" />

      <div className="px-4 pt-4">
        <div className="bg-white border border-border rounded-2xl p-5 text-center mb-4">
          <div className="w-16 h-16 rounded-full bg-teal-900 text-gold font-arabic text-2xl font-bold flex items-center justify-center mx-auto mb-3">
            {user?.name?.charAt(0).toUpperCase() ?? '?'}
          </div>
          <p className="text-lg font-bold text-teal-900">{user?.name}</p>
          <p className="text-xs text-ink-muted">{user?.tier === 'premium' ? 'Premium' : 'Free'} member</p>
        </div>

        <div className="bg-white border border-border rounded-2xl divide-y divide-border mb-4">
          <Row label="Age" value={user?.age ? String(user.age) : '—'} />
          <Row label="Gender" value={user?.gender === 'female' ? 'Female' : user?.gender === 'male' ? 'Male' : '—'} />
          <Row label="Madhab" value={user ? MADHAB_LABEL[user.madhab] ?? user.madhab : '—'} />
          <Row label="Language" value={user?.language?.toUpperCase() ?? '—'} />
        </div>

        <button
          onClick={() => navigate('/plans')}
          className="w-full bg-gold text-teal-900 font-bold rounded-xl py-3 text-sm mb-3"
        >
          View plans
        </button>

        <button
          onClick={handleLogout}
          className="w-full bg-white border border-red-300 text-red-500 font-bold rounded-xl py-3 text-sm"
        >
          Log out (clear this device)
        </button>

        <p className="text-center text-xs text-ink-muted mt-6">
          Alpha testing build · v0.0.0
        </p>
      </div>

      <BottomNav />
    </div>
  )
}
