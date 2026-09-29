import { useEffect, useState } from 'react'
import { getInviteStatus } from '../../services/supabaseService'
import { getSessionUser } from '../../services/authService'
import { Capacitor } from '@capacitor/core'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { useAppStore } from '../../store/appStore'

export function InvitePage() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [redeemedCount, setRedeemedCount] = useState(0)
  const [unlocked, setUnlocked] = useState(false)
  const setUser = useAppStore((state) => state.setUser)

  useEffect(() => {
    fetchStatus()
  }, [])

  async function fetchStatus() {
    try {
      const result = await getInviteStatus()
      if (result.ok && result.code) {
        setCode(result.code)
        setRedeemedCount(result.redeemedCount)
        setUnlocked(result.maqtabUnlocked)
        if (result.maqtabUnlocked) {
          const refreshed = await getSessionUser(true)
          if (refreshed) setUser(refreshed.user)
        }
      } else {
        setError(result.error || 'Failed to load invite status')
      }
    } catch (e) {
      console.error('Failed to load invite status:', e)
      setError(e instanceof Error ? e.message : 'Failed to load invite status')
    } finally {
      setLoading(false)
    }
  }

  async function handleShare() {
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.mymaqtab.app'
    const message = code
      ? `Join me on Islam Seeko!\n\nInvite code: ${code}\n\nDownload: ${playStoreUrl}`
      : `Join me on Islam Seekho!\n\n${playStoreUrl}`
    try {
      if (Capacitor.isNativePlatform()) {
        const { Share } = await import('@capacitor/share')
        await Share.share({
          title: 'Invite to Learn Islam',
          text: message,
          dialogTitle: 'Share invite',
        })
      } else if (navigator.share) {
        await navigator.share({
          title: 'Invite to Learn Islam',
          text: message,
        })
      } else {
        await navigator.clipboard.writeText(message)
        alert('Coupon code copied to clipboard!')
      }
    } catch (e) {
      console.error('Share failed:', e)
    }
  }

  return (
    <div className="min-h-screen bg-cream pb-24">
      <PageHeader title="Invite Friends" backTo="/home" />
      <div className="max-w-md mx-auto p-4 pt-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Share Your Invite Code</h1>
          <p className="text-gray-600">Two successful invites unlock Intermediate and Advanced Maqtab</p>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading invite code...</div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-700 font-semibold">{error}</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-blue-200 p-6 text-center">
              <p className="text-sm text-gray-600 mb-2">Your Invite Code</p>
              <p className="text-4xl font-bold font-mono text-blue-600 mb-4">{code}</p>
              <button
                onClick={handleShare}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition"
              >
                Share Invite
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
              <p className="font-semibold mb-2">Invite progress: {Math.min(redeemedCount, 2)} / 2</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Share this invite code with friends</li>
                <li>They redeem it during signup or settings</li>
                <li>Each person can redeem only one invite code</li>
                <li>{unlocked ? 'Maqtab levels are unlocked' : 'Two distinct friends unlock your Maqtab levels'}</li>
              </ul>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
