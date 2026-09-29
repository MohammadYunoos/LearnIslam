import { useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'

interface Props {
  text: string
  className?: string
}

export function OverflowMarquee({ text, className = '' }: Props) {
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const textRef = useRef<HTMLSpanElement | null>(null)
  const [overflowing, setOverflowing] = useState(false)

  useLayoutEffect(() => {
    const viewport = viewportRef.current
    const title = textRef.current
    if (!viewport || !title) return

    const measure = () => setOverflowing(title.scrollWidth > viewport.clientWidth + 1)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(viewport)
    observer.observe(title)
    return () => observer.disconnect()
  }, [text])

  const marqueeStyle = {
    '--marquee-duration': `${Math.max(10, Math.min(20, text.length * 0.22))}s`,
  } as CSSProperties

  return (
    <div
      ref={viewportRef}
      className={`overflow-hidden whitespace-nowrap ${className}`}
      aria-label={text}
      title={text}
    >
      <div
        className={overflowing ? 'overflow-marquee-track' : 'w-max'}
        style={marqueeStyle}
        aria-hidden="true"
      >
        <span ref={textRef} className="inline-block" dir="auto">{text}</span>
        {overflowing && (
          <>
            <span className="overflow-marquee-gap" />
            <span className="inline-block" dir="auto">{text}</span>
            <span className="overflow-marquee-gap" />
          </>
        )}
      </div>
    </div>
  )
}
