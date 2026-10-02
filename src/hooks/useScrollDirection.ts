import { useEffect, useState } from 'react'

export function useScrollDirection() {
  const [isScrollingDown, setIsScrollingDown] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    let ticking = false

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentY = window.scrollY
          if (currentY > lastScrollY) {
            setIsScrollingDown(true)
          } else if (currentY < lastScrollY) {
            setIsScrollingDown(false)
          }
          setLastScrollY(currentY)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [lastScrollY])

  return isScrollingDown
}
