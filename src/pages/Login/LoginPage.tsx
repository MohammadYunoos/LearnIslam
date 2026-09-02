// src/pages/Login/LoginPage.tsx
import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { signInWithGoogle, continueAsGuest, saveProfile } from '../../services/authService'
import { useAppStore } from '../../store/appStore'
import { Logo } from '../../components/Logo'

export function LoginPage() {
  const navigate = useNavigate()
  const user = useAppStore((s) => s.user)
  const needsProfile = useAppStore((s) => s.needsProfile)
  const setUser = useAppStore((s) => s.setUser)
  const setNeedsProfile = useAppStore((s) => s.setNeedsProfile)

  // Google users land here with a session but no profile → complete profile.
  const isGoogle = !!(user && needsProfile)

  const [step, setStep] = useState<'name' | 'profile' | 'done'>('name')
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [madhab, setMadhab] = useState('hanafi')
  const [lang, setLang] = useState('en')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Already fully signed in → render a redirect (no login flash).
  const alreadyIn = !!(user && !needsProfile)

  // Google sign-in complete → jump straight to the profile step, prefill name.
  useEffect(() => {
    if (isGoogle) {
      setStep('profile')
      setName((n) => n || user!.name)
    }
  }, [isGoogle, user])

  const handleGoogle = async () => {
    setLoading(true)
    setError('')
    try {
      await signInWithGoogle()
      // Web redirects away; native opens the browser and returns via deep link.
    } catch {
      setError('Google sign-in failed. Please try again.')
      setLoading(false)
    }
  }

  const handleContinueGuest = () => {
    if (!name.trim()) {
      setError('Please enter your name')
      return
    }
    setError('')
    setStep('profile')
  }

  const handleSubmitProfile = async () => {
    setLoading(true)
    try {
      if (isGoogle && user) {
        const u = await saveProfile(user.id, name || user.name, parseInt(age) || 20, gender, madhab, lang)
        setUser(u)
        setNeedsProfile(false)
        navigate('/home', { replace: true })
      } else {
        const u = await continueAsGuest(name, parseInt(age) || 20, gender, madhab, lang)
        setUser(u)
        setStep('done')
        setTimeout(() => navigate('/home'), 1000)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (alreadyIn) return <Navigate to="/home" replace />

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Hero header */}
      <div className="bg-teal-900 px-6 pt-12 pb-16 text-center">
        <Logo size={56} className="mx-auto mb-3" />
        <h1 className="font-arabic text-3xl font-bold text-white">Islam Seeko</h1>
        <p className="text-sand text-xs mt-1 tracking-widest uppercase">
          Learn Islam · Begin your journey
        </p>
      </div>

      {/* Card */}
      <div className="bg-white mx-5 -mt-6 rounded-2xl shadow-lg px-5 py-6 relative z-10">
        {step === 'name' && (
          <>
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full bg-teal-900 text-white font-bold rounded-xl py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <span className="bg-white text-teal-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                G
              </span>
              {loading ? 'Please wait…' : 'Continue with Google'}
            </button>

            <div className="flex items-center gap-2 my-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[11px] text-ink-muted uppercase tracking-wide">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <label className="block text-xs font-semibold text-teal-700 mb-1 uppercase tracking-wide">
              Continue as guest
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (e.g. Ahmed Khan)"
              className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-cream text-ink focus:outline-none focus:border-teal-700 mb-3"
            />
            {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
            <button
              onClick={handleContinueGuest}
              className="w-full bg-gold text-teal-900 font-bold rounded-xl py-3 text-sm"
            >
              Continue as guest →
            </button>
            <p className="text-xs text-ink-muted text-center mt-4">
              Guest data stays on this device. Sign in with Google to sync your progress.
            </p>
          </>
        )}

        {step === 'profile' && (
          <>
            <p className="text-gold-dark text-xs font-bold mb-1 uppercase tracking-wide">
              Welcome {name}! A few details.
            </p>
            <p className="text-ink-muted text-xs mb-4 leading-relaxed">
              This helps us show the correct rulings and content for you.
            </p>

            <label className="block text-xs font-semibold text-teal-700 mb-1 uppercase tracking-wide">
              Age
            </label>
            <input
              value={age}
              onChange={(e) => setAge(e.target.value)}
              type="number"
              placeholder="e.g. 24"
              className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-cream text-ink focus:outline-none focus:border-teal-700 mb-3"
            />

            <label className="block text-xs font-semibold text-teal-700 mb-1 uppercase tracking-wide">
              Gender
            </label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {(['male', 'female'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`rounded-xl py-3 text-sm font-bold border ${
                    gender === g
                      ? 'bg-teal-900 text-white border-teal-900'
                      : 'bg-cream text-ink-muted border-border'
                  }`}
                >
                  {g === 'male' ? 'Male' : 'Female'}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-ink-muted mb-3 leading-relaxed">
              Used to show the correct method and posture for your gender.
            </p>

            <label className="block text-xs font-semibold text-teal-700 mb-1 uppercase tracking-wide">
              Madhab
            </label>
            <select
              value={madhab}
              onChange={(e) => setMadhab(e.target.value)}
              className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-cream text-ink focus:outline-none focus:border-teal-700 mb-3"
            >
              <option value="hanafi">Hanafi</option>
              <option value="salafi">Salafi(Under development)</option>
            </select>

            <label className="block text-xs font-semibold text-teal-700 mb-1 uppercase tracking-wide">
              Language
            </label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-cream text-ink focus:outline-none focus:border-teal-700 mb-4"
            >
              <option value="en">English</option>
              <option value="ur">اردو Urdu</option>
              <option value="ur-roman">Roman Urdu (English letters)</option>
              <option value="hi">हिन्दी Hindi</option>
              <option value="ms">Bahasa Melayu</option>
              <option value="bn">বাংলা Bengali</option>
              <option value="id">Bahasa Indonesia</option>
            </select>

            {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
            <button
              onClick={handleSubmitProfile}
              disabled={loading}
              className="w-full bg-teal-900 text-white font-bold rounded-xl py-3 text-sm disabled:opacity-60"
            >
              {loading ? 'Please wait...' : 'Enter My Maqtab →'}
            </button>
          </>
        )}

        {step === 'done' && (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="font-arabic text-teal-900 text-xl font-bold mb-1">Ahlan wa Sahlan!</h3>
            <p className="text-ink-muted text-sm">Taking you to your home page...</p>
          </div>
        )}
      </div>

      <p className="text-center text-xs text-ink-muted mt-6 px-8">
        Alpha testing build · No personal data shared externally
      </p>
    </div>
  )
}
