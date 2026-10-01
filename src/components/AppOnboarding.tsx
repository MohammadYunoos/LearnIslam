import { useEffect, useRef, useState } from 'react'
import { TutorialAudio } from './TutorialAudio'

interface Slide {
  title: string
  description: string
  images: { src: string; label: string }[]
  points?: string[]
}

const menuImage = (name: string) => `${import.meta.env.BASE_URL}menu/${name}`
const onboardingImage = (name: string) => `${import.meta.env.BASE_URL}onboarding/${name}`

const SLIDES: Slide[] = [
  {
    title: 'Welcome to Islam Seeko',
    description: 'A practical companion for learning, worship, remembrance, and everyday Islamic living.',
    images: [
      { src: menuImage('maqtab.jpg'), label: 'Maqtab' },
      { src: menuImage('qa.jpg'), label: 'Islamic Q & A' },
      { src: menuImage('hifz.jpg'), label: 'Hifz' },
      { src: menuImage('masnoon.jpg'), label: 'Dua and Zikr' },
    ],
  },
  {
    title: 'Learn with Structure',
    description: 'Follow Maqtab lessons, pass quizzes, and explore clear Islamic question-and-answer volumes.',
    images: [
      { src: menuImage('maqtab.jpg'), label: 'Maqtab learning' },
      { src: menuImage('qa.jpg'), label: 'Islamic Q & A' },
    ],
    points: ['Lessons and quizzes', 'Beginner to advanced', 'Islamic Q & A books'],
  },
  {
    title: 'Build Worship with Clarity',
    description: 'Review practical Masail and daily Adaab with readable steps and useful references.',
    images: [
      { src: menuImage('masail.jpg'), label: 'Masail' },
      { src: menuImage('adaab.jpg'), label: 'Adaab' },
    ],
    points: ['Wudu and Ghusl', 'Salah guidance', 'Daily etiquette'],
  },
  {
    title: 'Quran, Dua, and Dhikr',
    description: 'Memorise short Surahs, listen ayah by ayah, learn daily duas, and keep count with Tasbih.',
    images: [
      { src: menuImage('hifz.jpg'), label: 'Hifz' },
      { src: menuImage('masnoon.jpg'), label: 'Masnoon Dua and Zikr' },
    ],
    points: ['Ayah audio and revision', 'Kalimas and duas', 'Tasbih counter'],
  },
  {
    title: 'Support Daily Worship',
    description: 'Find the Qibla and keep prayer and fasting times close throughout the day.',
    images: [
      { src: menuImage('qibla.jpg'), label: 'Qibla direction' },
      { src: menuImage('namaaz.jpg'), label: 'Prayer times' },
    ],
    points: ['Qibla compass', 'Prayer schedule', 'Sehri and Iftar times'],
  },
  {
    title: 'Ask, Reflect, and Improve',
    description: 'Use Detoxify to reflect on habits, character, and spiritual growth with small daily actions.',
    images: [{ src: menuImage('detoxify.jpg'), label: 'Detoxify' }],
    points: ['Daily reflection', 'Private progress', 'Heart and Akhlaq'],
  },
  {
    title: 'Track Meaningful Progress',
    description: 'Complete levels, earn certificates, and celebrate consistent learning with the community.',
    images: [
      { src: onboardingImage('certificate.jpg'), label: 'Learning certificate' },
      { src: onboardingImage('leaderboard.jpg'), label: 'Maqtab leaderboard' },
    ],
    points: ['Progress tracking', 'Certificates', 'Leaderboard'],
  },
  {
    title: 'Begin Your Journey',
    description: 'Choose one small step today. Learn consistently, practise sincerely, and grow at your own pace.',
    images: [{ src: onboardingImage('begin-journey.jpg'), label: 'Begin learning with Islam Seeko' }],
    points: ['Learn', 'Practise', 'Remember', 'Grow'],
  },
]

interface Props {
  onComplete: () => void
}

export function AppOnboarding({ onComplete }: Props) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState<'next' | 'previous'>('next')
  const touchStart = useRef<number | null>(null)
  const slide = SLIDES[index]
  const isLast = index === SLIDES.length - 1

  const goTo = (nextIndex: number) => {
    const safeIndex = Math.max(0, Math.min(SLIDES.length - 1, nextIndex))
    setDirection(safeIndex >= index ? 'next' : 'previous')
    setIndex(safeIndex)
  }

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' && index < SLIDES.length - 1) goTo(index + 1)
      if (event.key === 'ArrowLeft' && index > 0) goTo(index - 1)
      if (event.key === 'Escape') onComplete()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  return (
    <div
      className="maqtab-onboarding fixed inset-0 z-[80] flex justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Islam Seeko app tutorial"
      onTouchStart={(event) => {
        touchStart.current = event.touches[0]?.clientX ?? null
      }}
      onTouchEnd={(event) => {
        if (touchStart.current == null) return
        const distance = event.changedTouches[0].clientX - touchStart.current
        if (distance < -55 && index < SLIDES.length - 1) goTo(index + 1)
        if (distance > 55 && index > 0) goTo(index - 1)
        touchStart.current = null
      }}
    >
      <div className="relative w-full max-w-lg min-h-[100dvh] flex flex-col px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] overflow-hidden">
        <header className="h-10 flex items-center justify-between shrink-0">
          <p className="text-white text-sm font-bold">Islam Seeko</p>
          <div className="flex items-center gap-2">
            <TutorialAudio />
            <button type="button" onClick={onComplete} className="text-white/80 text-xs font-semibold px-2 py-2">
              Skip Tutorial
            </button>
          </div>
        </header>

        <div key={index} className={`onboarding-slide onboarding-slide-${direction} flex-1 min-h-0 flex flex-col justify-center`}>
          <div className={`app-guide-visual mx-auto w-full max-w-[350px] ${slide.images.length === 1 ? 'app-guide-visual-single' : 'grid-cols-2'}`}>
            {slide.images.map((item) => (
              <figure key={item.label} className="relative overflow-hidden rounded-lg border border-white/25 bg-cream shadow-lg">
                <img src={item.src} alt="" className="w-full h-full object-cover" draggable={false} />
                <figcaption className="absolute inset-x-0 bottom-0 bg-teal-900/90 text-white text-[10px] font-bold px-2 py-1.5 text-center">
                  {item.label}
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="text-center mt-5 min-h-[176px] flex flex-col items-center">
            <h1 className="text-white font-arabic font-bold text-2xl leading-tight">{slide.title}</h1>
            <p className="text-white/85 text-sm leading-relaxed mt-3 max-w-sm">{slide.description}</p>
            {slide.points && (
              <ul className="flex flex-wrap justify-center gap-2 mt-3" aria-label="Highlights">
                {slide.points.map((point) => (
                  <li key={point} className="bg-white/10 border border-white/20 rounded-full px-3 py-1.5 text-xs font-semibold text-white">
                    {point}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <nav className="shrink-0" aria-label="Tutorial navigation">
          <div className="h-5 flex justify-center items-center gap-1.5 mb-3">
            {SLIDES.map((item, dotIndex) => (
              <button
                key={item.title}
                type="button"
                onClick={() => goTo(dotIndex)}
                className={`h-2 rounded-full transition-all duration-300 ${dotIndex === index ? 'w-6 bg-gold' : 'w-2 bg-white/35'}`}
                aria-label={`Go to slide ${dotIndex + 1}`}
                aria-current={dotIndex === index ? 'step' : undefined}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 h-12">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              className="border border-white/35 text-white font-bold rounded-lg text-sm disabled:opacity-0"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => (isLast ? onComplete() : goTo(index + 1))}
              className="bg-gold text-teal-900 font-bold rounded-lg text-sm shadow-lg"
            >
              {isLast ? 'Get Started' : 'Next'}
            </button>
          </div>
        </nav>
      </div>
    </div>
  )
}
