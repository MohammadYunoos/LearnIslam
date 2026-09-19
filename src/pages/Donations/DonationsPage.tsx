import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { useTr, useTrList } from '../../i18n/useTr'
import { openExternal } from '../../lib/external'
import { getDonationConfig } from '../../services/supabaseService'

export function DonationsPage() {
  const tTitle = useTr('Support Islam Seeko')
  const [config, setConfig] = useState<{ paypal_link: string; upi_vpa: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [paypalAmount, setPaypalAmount] = useState(5)
  const [paypalCustom, setPaypalCustom] = useState('')
  const [upiAmount, setUpiAmount] = useState(50)
  const [upiCustom, setUpiCustom] = useState('')
  const [copiedUpi, setCopiedUpi] = useState(false)

  const L = useTrList([
    'International Donations',
    'India Donations',
    'UPI ID copied to clipboard',
    'Copy UPI ID',
    'Donate via PayPal',
    'Custom amount',
    'Donate via UPI',
    'Other amount',
  ])

  useEffect(() => {
    fetchConfig()
  }, [])

  async function fetchConfig() {
    try {
      const data = await getDonationConfig()
      setConfig(data)
    } catch (e) {
      console.error('Failed to fetch donation config:', e)
    } finally {
      setLoading(false)
    }
  }

  const paypalPresets = [1, 5, 10, 25]
  const upiPresets = [25, 50, 100, 500, 1000]

  const handlePaypalCustomChange = (val: string) => {
    setPaypalCustom(val)
    setPaypalAmount(0)
  }

  const handlePaypalPresetClick = (amount: number) => {
    setPaypalAmount(amount)
    setPaypalCustom('')
  }

  const handlePaypalDonate = async () => {
    if (!config) return
    const amount = paypalCustom ? parseFloat(paypalCustom) : paypalAmount
    if (amount > 0) {
      const url = `${config.paypal_link}/${amount}`
      await openExternal(url)
    }
  }

  const handleUpiCustomChange = (val: string) => {
    setUpiCustom(val)
    setUpiAmount(0)
  }

  const handleUpiPresetClick = (amount: number) => {
    setUpiAmount(amount)
    setUpiCustom('')
  }

  const handleUpiDonate = () => {
    if (!config) return
    const amount = upiCustom ? parseInt(upiCustom) : upiAmount
    if (amount > 0) {
      const upiUrl = `upi://pay?pa=${encodeURIComponent(config.upi_vpa)}&pn=Islam%20Seeko&am=${amount}&cu=INR&tn=Donation`
      window.location.href = upiUrl
    }
  }

  const handleCopyUpi = () => {
    if (!config) return
    navigator.clipboard.writeText(config.upi_vpa)
    setCopiedUpi(true)
    setTimeout(() => setCopiedUpi(false), 2000)
  }

  return (
    <div className="bg-cream min-h-screen pb-20">
      <PageHeader title={tTitle} />

      <div className="px-4 pt-4">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4">
          <p className="text-xs text-blue-900 leading-relaxed mb-3">
            Islam Seeko is provided free of charge. Your voluntary donations help support app development, content creation, hosting, and maintenance.
          </p>
          <p className="text-xs text-blue-900 leading-relaxed">
            Donations are optional and do not provide any additional features, content, or benefits.
          </p>
        </div>

        {!loading && config ? (
          <>
            {/* PayPal Card */}
            <div className="bg-white border border-border rounded-2xl p-5 mb-4">
              <label className="block text-xs font-semibold text-teal-700 mb-3 uppercase tracking-wide">
                {L[0]}
              </label>

              <div className="mb-4">
                <p className="text-xs text-ink-muted mb-2">Quick amounts (USD)</p>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {paypalPresets.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handlePaypalPresetClick(amount)}
                      className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                        paypalAmount === amount && !paypalCustom
                          ? 'bg-teal-900 text-white'
                          : 'bg-gray-100 text-ink border border-gray-300 active:scale-[0.95]'
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs font-semibold text-teal-700 mb-1 block uppercase tracking-wide">
                  {L[5]}
                </label>
                <input
                  type="number"
                  placeholder="Enter amount in USD"
                  value={paypalCustom}
                  onChange={(e) => handlePaypalCustomChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <button
                onClick={handlePaypalDonate}
                disabled={!config || (paypalAmount === 0 && !paypalCustom)}
                className="w-full bg-teal-900 text-white font-bold rounded-xl py-3 text-sm active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                💳 {L[4]}
              </button>
            </div>

            {/* UPI Card */}
            <div className="bg-white border border-border rounded-2xl p-5 mb-4">
              <label className="block text-xs font-semibold text-teal-700 mb-3 uppercase tracking-wide">
                {L[1]}
              </label>

              <div className="mb-4">
                <p className="text-xs text-ink-muted mb-2">Quick amounts (INR)</p>
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {upiPresets.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleUpiPresetClick(amount)}
                      className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                        upiAmount === amount && !upiCustom
                          ? 'bg-teal-900 text-white'
                          : 'bg-gray-100 text-ink border border-gray-300 active:scale-[0.95]'
                      }`}
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs font-semibold text-teal-700 mb-1 block uppercase tracking-wide">
                  {L[7]}
                </label>
                <input
                  type="number"
                  placeholder="Enter amount in INR"
                  value={upiCustom}
                  onChange={(e) => handleUpiCustomChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <button
                onClick={handleUpiDonate}
                disabled={!config || (upiAmount === 0 && !upiCustom)}
                className="w-full bg-teal-900 text-white font-bold rounded-xl py-3 text-sm active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed mb-3"
              >
                📱 {L[6]}
              </button>

              <div className="border-t border-gray-200 pt-3">
                <p className="text-xs text-ink-muted mb-2 text-center">Or manually enter this UPI ID:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={config.upi_vpa}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs bg-gray-50"
                  />
                  <button
                    onClick={handleCopyUpi}
                    className="bg-gold text-teal-900 font-bold rounded-xl px-3 py-2 text-xs active:scale-[0.98] transition-transform"
                  >
                    {copiedUpi ? '✓' : L[3]}
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : loading ? (
          <div className="text-center py-8 text-ink-muted">Loading donation options...</div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <p className="text-xs text-red-900">
              Unable to load donation options at this time. Please try again later.
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
