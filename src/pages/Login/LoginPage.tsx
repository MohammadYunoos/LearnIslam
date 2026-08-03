// src/pages/Login/LoginPage.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginWithName } from '../../services/authService'
import { useAppStore } from '../../store/appStore'

export function LoginPage() {
  const navigate = useNavigate()
  const setUser = useAppStore((s) => s.setUser)
  const [step, setStep] = useState<'name' | 'profile' | 'done'>('name')
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [madhab, setMadhab] = useState('hanafi')
  const [lang, setLang] = useState('en')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleContinue = () => {
    if (!name.trim()) {
      setError('Please enter your name')
      return
    }
    setError('')
    setStep('profile')
  }

  const handleLogin = async () => {
    setLoading(true)
    try {
      const user = await loginWithName(name, parseInt(age) || 20, gender, madhab, lang)
      setUser(user)
      setStep('done')
      setTimeout(() => navigate('/home'), 1000)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Hero header */}
      <div className="bg-teal-900 px-6 pt-12 pb-16 text-center">
        <svg className="w-14 h-14 mx-auto mb-3" viewBox="0 0 100 100">
          <polygon
            points="50,5 61,38 96,38 67,59 78,92 50,71 22,92 33,59 4,38 39,38"
            fill="none"
            stroke="#C8962C"
            strokeWidth="3"
          />
        </svg>
        <h1 className="font-arabic text-3xl font-bold text-white">My Maqtab</h1>
        <p className="text-sand text-xs mt-1 tracking-widest uppercase">
          Begin your learning journey
        </p>
      </div>

      {/* Card */}
      <div className="bg-white mx-5 -mt-6 rounded-2xl shadow-lg px-5 py-6 relative z-10">
        {step === 'name' && (
          <>
            <p className="text-ink-muted text-sm mb-4 leading-relaxed">
              Enter your name to get started. No password needed.
            </p>
            <label className="block text-xs font-semibold text-teal-700 mb-1 uppercase tracking-wide">
              Your name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ahmed Khan"
              className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-cream text-ink focus:outline-none focus:border-teal-700 mb-4"
            />
            {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
            <button
              onClick={handleContinue}
              className="w-full bg-gold text-teal-900 font-bold rounded-xl py-3 text-sm"
            >
              Continue →
            </button>
            <div className="flex items-center gap-2 my-4">
              <div className="flex-1 h-px bg-border" />
              <svg width="14" height="14" viewBox="0 0 100 100">
                <polygon
                  points="50,5 61,38 96,38 67,59 78,92 50,71 22,92 33,59 4,38 39,38"
                  fill="#C8962C"
                />
              </svg>
              <div className="flex-1 h-px bg-border" />
            </div>
            <p className="text-xs text-ink-muted text-center">
              No account needed · No password · Free to use
            </p>
          </>
        )}

        {step === 'profile' && (
          <>
            <p className="text-gold-dark text-xs font-bold mb-1 uppercase tracking-wide">
              Welcome {name}! A few details.
            </p>
            <p className="text-ink-muted text-xs mb-4 leading-relaxed">
              This helps us show the correct rulings for your school of thought.
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
              <option value="shafi">Shafi&apos;i</option>
              <option value="maliki">Maliki</option>
              <option value="hanbali">Hanbali</option>
              <option value="salafi">Salafi</option>
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
              <option value="hi">हिन्दी Hindi</option>
              <option value="ms">Bahasa Melayu</option>
              <option value="bn">বাংলা Bengali</option>
              <option value="id">Bahasa Indonesia</option>
            </select>

            {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
            <button
              onClick={handleLogin}
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
            <h3 className="font-arabic text-teal-900 text-xl font-bold mb-1">
              Ahlan wa Sahlan!
            </h3>
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
