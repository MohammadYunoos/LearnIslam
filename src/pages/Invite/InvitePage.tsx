import { useEffect, useState } from 'react'
import { getInviteStatus } from '../../services/supabaseService'
import { Capacitor } from '@capacitor/core'

export function InvitePage() {
  const [code, setCode] = useState('')
  const [redeemed, setRedeemed] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStatus()
  }, [])

  async function fetchStatus() {
    try {
      const status = await getInviteStatus()
      setCode(status.code)
      setRedeemed(status.redeemedCount)
    } catch (e) {
      console.error('Failed to fetch invite status:', e)
    } finally {
      setLoading(false)
    }
  }

  async function handleShare() {
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.mymaqtab.app'
    const message = code
      ? `Join me on Islam Seekho!\n\nDownload: ${playStoreUrl}\nInvite code: ${code}`
      : `Join me on Islam Seekho!\n\n${playStoreUrl}`
    try {
      if (Capacitor.isNativePlatform()) {
        // @ts-ignore — lazy-load native plugin
        const { Share } = await import('@capacitor/share')
        await Share.share({
          title: 'Invite to Learn Islam',
          text: message,
          url: playStoreUrl,
          dialogTitle: 'Share invite',
        })
      } else if (navigator.share) {
        await navigator.share({
          title: 'Invite to Learn Islam',
          text: message,
          url: playStoreUrl,
        })
      } else {
        await navigator.clipboard.writeText(message)
        alert('Invite link copied to clipboard!')
      }
    } catch (e) {
      console.error('Share failed:', e)
    }
  }

  const unlocked = redeemed >= 2

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-md mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Invite Friends</h1>
          <p className="text-gray-600">Share your code and unlock Maqtab Intermediate/Advanced</p>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-blue-200 p-6 text-center">
              <p className="text-sm text-gray-600 mb-2">Your Invite Code</p>
              <p className="text-4xl font-bold font-mono text-blue-600 mb-4">{code}</p>
              <button
                onClick={handleShare}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition"
              >
                Share Code
              </button>
            </div>

            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-900">Progress</span>
                <span className={`text-2xl font-bold ${unlocked ? 'text-green-600' : 'text-orange-500'}`}>
                  {redeemed} / 2
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full transition-all ${unlocked ? 'bg-green-500' : 'bg-orange-500'}`}
                  style={{ width: `${Math.min(redeemed * 50, 100)}%` }}
                />
              </div>

              {unlocked && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                  <p className="text-green-700 font-semibold">🎉 Unlocked!</p>
                  <p className="text-green-600 text-sm">Intermediate & Advanced sections are now available</p>
                </div>
              )}

              {!unlocked && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                  <p className="text-blue-700 text-sm">
                    Invite {2 - redeemed} more friend{redeemed === 1 ? '' : 's'} to unlock premium sections
                  </p>
                </div>
              )}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
              <p className="font-semibold mb-2">How it works:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Share your code with friends</li>
                <li>They enter it during signup</li>
                <li>After 2 invites, you unlock advanced content</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
