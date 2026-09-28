import { useEffect, useRef, useState } from 'react'

interface Slide {
  image: string
  title: string
  description: string
  highlight?: string
  points?: string[]
}

const SLIDES: Slide[] = [
  {
    image: '/onboarding/learning-path.jpg',
    title: '📚 Start Your Maqtab Journey',
    description: 'Select a level and begin your learning journey. Choose Beginner, Intermediate, or Advanced.',
  },
  {
    image: '/onboarding/chapters-lessons.jpg',
    title: '📖 Explore Chapters & Lessons',
    description: 'Open each chapter and study lessons in sequence. Build your Islamic knowledge step by step.',
  },
  {
    image: '/onboarding/study-lesson.jpg',
    title: '🕌 Study Every Lesson',
    description: 'Read carefully and understand each concept before moving forward. Learn at your own pace.',
  },
  {
    image: '/onboarding/lesson-quiz.jpg',
    title: '✅ Pass the Lesson Quiz',
    description: 'Complete the quiz after every lesson to continue your learning journey.',
    highlight: '🎯 Required Score: 80%',
  },
  {
    image: '/onboarding/finish-level.jpg',
    title: '🚀 Finish Your Level',
    description: 'Complete every lesson in your selected level before the final exam becomes available.',
    points: ['Beginner', 'Intermediate', 'Advanced'],
  },
  {
    image: '/onboarding/final-exam.jpg',
    title: '📝 Attempt the Final Exam',
    description: 'Test everything you have learned in one comprehensive level exam.',
    highlight: '🎯 Pass Score: 75%',
  },
  {
    image: '/onboarding/certificate.jpg',
    title: '🏆 Receive Your Certificate',
    description: 'Pass the final exam with 75% or above to generate your personalized certificate.',
    points: ['View Certificate', 'Download Certificate', 'Share Certificate'],
  },
  {
    image: '/onboarding/leaderboard.jpg',
    title: '⭐ Be Recognized',
    description: 'Join the Islam Seeko leaderboard and inspire others on their learning journey.',
    points: ['Rank Tracking', 'Learning Badges', 'Community Recognition'],
  },
  {
    image: '/onboarding/begin-journey.jpg',
    title: '🌟 Begin Your Learning Journey Today',
    description: 'Seek knowledge, complete lessons, pass exams, earn certificates, and grow your understanding of Islam.',
  },
]

interface Props {
  open: boolean
  onComplete: () => void
}

export function MaqtabOnboarding({ open, onComplete }: Props) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState<'next' | 'previous'>('next')
  const touchStart = useRef<number | null>(null)
  const slide = SLIDES[index]
  const isLast = index === SLIDES.length - 1

  useEffect(() => {
    if (!open) return
    setIndex(0)
    setDirection('next')
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  const goTo = (nextIndex: number) => {
    const safeIndex = Math.max(0, Math.min(SLIDES.length - 1, nextIndex))
    setDirection(safeIndex >= index ? 'next' : 'previous')
    setIndex(safeIndex)
  }

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' && index < SLIDES.length - 1) goTo(index + 1)
      if (event.key === 'ArrowLeft' && index > 0) goTo(index - 1)
      if (event.key === 'Escape') onComplete()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  if (!open) return null

  return (
    <div
      className="maqtab-onboarding fixed inset-0 z-[80] flex justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Maqtab tutorial"
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
          <p className="text-white text-sm font-bold">Islam Seeko Maqtab</p>
          <button type="button" onClick={onComplete} className="text-white/80 text-xs font-semibold px-2 py-2">
            Skip Tutorial
          </button>
        </header>

        <div key={index} className={`onboarding-slide onboarding-slide-${direction} flex-1 min-h-0 flex flex-col justify-center`}>
          <div className="onboarding-visual relative w-full max-w-[340px] mx-auto aspect-square overflow-hidden rounded-lg shadow-xl border border-white/30 bg-cream">
            <img src={slide.image} alt="" className="w-full h-full object-cover" draggable={false} />
          </div>

          <div className="text-center mt-5 min-h-[184px] flex flex-col items-center">
            <h2 className="text-white font-arabic font-bold text-2xl leading-tight">{slide.title}</h2>
            <p className="text-white/85 text-sm leading-relaxed mt-3 max-w-sm">{slide.description}</p>
            {slide.highlight && (
              <p className="mt-3 bg-gold text-teal-900 rounded-full px-4 py-2 text-sm font-bold shadow-sm">
                {slide.highlight}
              </p>
            )}
            {slide.points && (
              <ul className="flex flex-wrap justify-center gap-2 mt-3" aria-label="Features">
                {slide.points.map((point) => (
                  <li key={point} className="bg-white/10 border border-white/20 rounded-full px-3 py-1.5 text-xs font-semibold text-white">
                    ✓ {point}
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
          {isLast && (
            <button type="button" onClick={onComplete} className="w-full text-white/75 text-xs font-semibold mt-2 py-1">
              Skip Tutorial
            </button>
          )}
        </nav>
      </div>
    </div>
  )
}
