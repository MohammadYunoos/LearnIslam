// src/pages/Settings/DeleteAccountPage.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { useAppStore } from '../../store/appStore'
import { useTr, useTrList } from '../../i18n/useTr'
import { supabase } from '../../lib/supabase'
import { logout as clearDevice } from '../../services/authService'

export function DeleteAccountPage() {
  const navigate = useNavigate()
  const user = useAppStore((s) => s.user)
  const storeLogout = useAppStore((s) => s.logout)

  const [confirmText, setConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const getEmail = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user.email) {
        setUserEmail(session.user.email)
      }
    }
    getEmail()
  }, [])

  const tDelete = useTr('Delete Account')
  const L = useTrList([
    'Delete Account',
    'This action cannot be undone',
    'Deleting your account will:',
    'Remove all your personal data',
    'Cancel all active subscriptions',
    'Delete all your progress and certificates',
    'Erase all your saved content',
    'To confirm, type your email address',
    'Delete',
    'Deleting…',
    'Cancel',
  ])

  const handleDelete = async () => {
    if (!user || !userEmail || confirmText !== userEmail) {
      alert('Email does not match. Account not deleted.')
      return
    }

    setDeleting(true)
    try {
      // Call backend to delete user account
      const { error } = await supabase.auth.admin.deleteUser(user.id)
      if (error) throw error

      clearDevice()
      storeLogout()
      navigate('/login', { replace: true })
    } catch (err) {
      console.error('Delete account failed:', err)
      alert('Failed to delete account. Please try again or contact support.')
    } finally {
      setDeleting(false)
    }
  }

  if (!showConfirm) {
    return (
      <div className="bg-cream min-h-screen pb-20">
        <PageHeader title={tDelete} backTo="/settings" />

        <div className="px-4 pt-4">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-4">
            <h2 className="font-bold text-red-900 text-sm mb-3">Warning: {L[1]}</h2>
            <p className="text-sm text-red-900 leading-relaxed mb-3">
              {L[2]}
            </p>
            <ul className="text-sm text-red-900 space-y-1 list-disc list-inside">
              <li>{L[3]}</li>
              <li>{L[4]}</li>
              <li>{L[5]}</li>
              <li>{L[6]}</li>
            </ul>
          </div>

          <button
            onClick={() => setShowConfirm(true)}
            className="w-full bg-red-500 text-white font-bold rounded-xl py-3 text-sm active:scale-[0.98] transition-transform mb-3"
          >
            {L[0]}
          </button>

          <button
            onClick={() => navigate('/settings')}
            className="w-full bg-white border border-border text-ink-muted font-bold rounded-xl py-3 text-sm"
          >
            {L[10]}
          </button>
        </div>

        <BottomNav />
      </div>
    )
  }

  return (
    <div className="bg-cream min-h-screen pb-20">
      <PageHeader title={tDelete} backTo="/settings" />

      <div className="px-4 pt-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-4">
          <p className="text-sm text-red-900 font-bold mb-3">{L[1]}</p>
          <p className="text-sm text-red-900 leading-relaxed">
            {L[7]}
          </p>

          <div className="mt-4">
            <input
              type="email"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={userEmail ?? ''}
              className="w-full border border-red-300 rounded-xl px-4 py-3 text-sm bg-white text-ink focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        <button
          onClick={handleDelete}
          disabled={deleting || confirmText !== userEmail}
          className="w-full bg-red-500 text-white font-bold rounded-xl py-3 text-sm active:scale-[0.98] transition-transform mb-3 disabled:opacity-60"
        >
          {deleting ? L[9] : L[8]}
        </button>

        <button
          onClick={() => setShowConfirm(false)}
          disabled={deleting}
          className="w-full bg-white border border-border text-ink-muted font-bold rounded-xl py-3 text-sm disabled:opacity-60"
        >
          {L[10]}
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
