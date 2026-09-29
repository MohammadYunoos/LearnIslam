// src/pages/Settings/SettingsPage.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { useAppStore } from '../../store/appStore'
import { logout as clearDevice, saveProfile } from '../../services/authService'
import { redeemInviteCode } from '../../services/supabaseService'
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
  const setUser = useAppStore((s) => s.setUser)
  const storeLogout = useAppStore((s) => s.logout)

  const [admin, setAdmin] = useState(false)
  useEffect(() => {
    isAdmin().then(setAdmin)
  }, [])

  // ── Edit profile (name, age, language) ──────────────────
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [lang, setLang] = useState('en')
  const [saving, setSaving] = useState(false)

  // ── Coupon redemption ──────────────────────────────────
  const [showCouponModal, setShowCouponModal] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponMessage, setCouponMessage] = useState('')
  const [couponError, setCouponError] = useState('')

  const startEdit = () => {
    if (!user) return
    setName(user.name ?? '')
    setAge(user.age ? String(user.age) : '')
    setLang(user.language || 'en')
    setEditing(true)
  }
  const handleSave = async () => {
    if (!user || !name.trim()) return
    setSaving(true)
    try {
      const u = await saveProfile(
        user.id,
        name,
        parseInt(age) || user.age || 20,
        user.gender,
        user.madhab || 'hanafi',
        lang
      )
      setUser(u)
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    clearDevice()
    storeLogout()
    navigate('/login', { replace: true })
  }

  const handleRedeemCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code')
      return
    }
    setCouponLoading(true)
    setCouponError('')
    setCouponMessage('')
    try {
      const result = await redeemInviteCode(couponCode.trim())
      if (result.ok) {
        setCouponCode('')
        setCouponMessage('Invite accepted. Your friend received referral credit.')
      } else {
        setCouponError(result.error || 'Failed to redeem invite code')
      }
    } catch (e) {
      setCouponError(e instanceof Error ? e.message : 'Error redeeming invite code. Please try again.')
      console.error('Invite redemption error:', e)
    } finally {
      setCouponLoading(false)
    }
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
    'Edit profile', // 11
    'Name', // 12
    'Save', // 13
    'Saving…', // 14
    'Cancel', // 15
    'Redeem Invite Code', // 16
    'Invite Code', // 17
    'Redeem', // 18
    'Redeeming…', // 19
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

        {!editing ? (
          <>
            <div className="bg-white border border-border rounded-2xl divide-y divide-border mb-3">
              <Row label={L[1]} value={user?.age ? String(user.age) : '—'} />
              <Row label={L[2]} value={user?.gender === 'female' ? L[8] : user?.gender === 'male' ? L[7] : '—'} />
              <Row label={L[3]} value={user ? tMadhabVal : '—'} />
              <Row label={L[4]} value={user?.language?.toUpperCase() ?? '—'} />
            </div>
            <button
              onClick={startEdit}
              className="w-full bg-white border border-teal-700 text-teal-900 font-bold rounded-xl py-3 text-sm mb-4"
            >
              {L[11]}
            </button>
          </>
        ) : (
          <div className="bg-white border border-border rounded-2xl p-4 mb-4 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-teal-700 mb-1 uppercase tracking-wide">
                {L[12]}
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-cream text-ink focus:outline-none focus:border-teal-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-teal-700 mb-1 uppercase tracking-wide">
                {L[1]}
              </label>
              <input
                value={age}
                onChange={(e) => setAge(e.target.value)}
                type="number"
                placeholder="e.g. 24"
                className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-cream text-ink focus:outline-none focus:border-teal-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-teal-700 mb-1 uppercase tracking-wide">
                {L[4]}
              </label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-cream text-ink focus:outline-none focus:border-teal-700"
              >
                <option value="en">English</option>
                <option value="ur-roman">Roman Urdu (English letters)</option>
              </select>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleSave}
                disabled={saving || !name.trim()}
                className="flex-1 bg-teal-900 text-white font-bold rounded-xl py-3 text-sm disabled:opacity-60"
              >
                {saving ? L[14] : L[13]}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="flex-1 bg-white border border-border text-ink-muted font-bold rounded-xl py-3 text-sm"
              >
                {L[15]}
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => navigate('/plans')}
          className="w-full bg-gold text-teal-900 font-bold rounded-xl py-3 text-sm mb-3"
        >
          {L[5]}
        </button>

        <button
          onClick={() => setShowCouponModal(true)}
          className="w-full bg-white border border-teal-700 text-teal-900 font-bold rounded-xl py-3 text-sm mb-3"
        >
          🎟️ {L[16]}
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
          className="w-full bg-white border border-red-300 text-red-500 font-bold rounded-xl py-3 text-sm mb-4"
        >
          {L[6]}
        </button>

        {/* Settings Menu */}
        <div className="bg-white border border-border rounded-2xl divide-y divide-border mb-4">
          <button
            onClick={() => navigate('/tutorial')}
            className="w-full text-left px-4 py-3 text-sm font-semibold text-teal-900 active:bg-sand transition-colors"
          >
            App Tutorial
          </button>
          <button
            onClick={() => navigate('/settings/about')}
            className="w-full text-left px-4 py-3 text-sm font-semibold text-teal-900 active:bg-sand transition-colors"
          >
            About Islam Seeko
          </button>
          <button
            onClick={() => openExternal(PRIVACY_URL)}
            className="w-full text-left px-4 py-3 text-sm font-semibold text-teal-900 active:bg-sand transition-colors"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => navigate('/settings/terms')}
            className="w-full text-left px-4 py-3 text-sm font-semibold text-teal-900 active:bg-sand transition-colors"
          >
            Terms & Conditions
          </button>
          <button
            onClick={() => navigate('/settings/disclaimer')}
            className="w-full text-left px-4 py-3 text-sm font-semibold text-teal-900 active:bg-sand transition-colors"
          >
            Disclaimer
          </button>
          <button
            onClick={() => navigate('/settings/contact')}
            className="w-full text-left px-4 py-3 text-sm font-semibold text-teal-900 active:bg-sand transition-colors"
          >
            Contact Us
          </button>
          <button
            onClick={() => navigate('/settings/delete-account')}
            className="w-full text-left px-4 py-3 text-sm font-semibold text-red-500 active:bg-sand transition-colors"
          >
            Delete Account
          </button>
        </div>

        <p className="text-center text-xs text-ink-muted mt-2">
          Alpha testing build · v{APP_VERSION_NAME}
        </p>
      </div>

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h2 className="text-lg font-bold text-teal-900 mb-4">{L[16]}</h2>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-teal-700 mb-2 uppercase tracking-wide">
                {L[17]}
              </label>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Enter code"
                disabled={couponLoading}
                className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-cream text-ink focus:outline-none focus:border-teal-700 uppercase disabled:opacity-60"
              />
            </div>

            {couponError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {couponError}
              </div>
            )}

            {couponMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
                {couponMessage}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleRedeemCoupon}
                disabled={couponLoading || !couponCode.trim()}
                className="flex-1 bg-teal-900 text-white font-bold rounded-xl py-3 text-sm disabled:opacity-60"
              >
                {couponLoading ? L[19] : L[18]}
              </button>
              <button
                onClick={() => {
                  setShowCouponModal(false)
                  setCouponCode('')
                  setCouponError('')
                  setCouponMessage('')
                }}
                disabled={couponLoading}
                className="flex-1 bg-white border border-border text-ink-muted font-bold rounded-xl py-3 text-sm disabled:opacity-60"
              >
                {L[15]}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
