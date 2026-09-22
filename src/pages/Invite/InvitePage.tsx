import { useEffect, useState } from 'react'
import { generateUserCoupon } from '../../services/supabaseService'
import { Capacitor } from '@capacitor/core'

export function InvitePage() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStatus()
  }, [])

  async function fetchStatus() {
    try {
      const result = await generateUserCoupon()
      if (result.ok && result.code) {
        setCode(result.code)
      } else {
        setError(result.error || 'Failed to generate coupon')
      }
    } catch (e) {
      console.error('Failed to generate coupon:', e)
      setError('Failed to generate coupon')
    } finally {
      setLoading(false)
    }
  }

  async function handleShare() {
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.mymaqtab.app'
    const message = code
      ? `Join me on Islam Seekho!\n\nCoupon code: ${code}\n\nDownload: ${playStoreUrl}`
      : `Join me on Islam Seekho!\n\n${playStoreUrl}`
    try {
      if (Capacitor.isNativePlatform()) {
        const { Share } = await import('@capacitor/share')
        await Share.share({
          title: 'Invite to Learn Islam',
          text: message,
          dialogTitle: 'Share coupon',
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-md mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Share Coupon</h1>
          <p className="text-gray-600">Give 2 friends your coupon to unlock content</p>
        </div>

        {loading ? (
          <div className="text-center py-8">Generating coupon...</div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-700 font-semibold">{error}</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-blue-200 p-6 text-center">
              <p className="text-sm text-gray-600 mb-2">Your Coupon Code</p>
              <p className="text-4xl font-bold font-mono text-blue-600 mb-4">{code}</p>
              <button
                onClick={handleShare}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition"
              >
                Share Coupon
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
              <p className="font-semibold mb-2">How it works:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Share this coupon code with friends</li>
                <li>They redeem it during signup or settings</li>
                <li>Each code can be used by 2 people</li>
                <li>You get content unlocked</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
