import { useEffect, useRef, useState } from 'react'
import '../../assets/styles/ScrollIndicator.css'

const THUMB_HEIGHT = 28
const HIDE_DELAY_MS = 900

export default function ScrollIndicator() {
  const [visible, setVisible] = useState(false)
  const [thumbY, setThumbY] = useState(0)
  const [canScroll, setCanScroll] = useState(false)
  const hideTimeoutRef = useRef(null)

  useEffect(() => {
    const update = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight

      if (maxScroll <= 0) {
        setCanScroll(false)
        setVisible(false)
        return
      }

      setCanScroll(true)

      const progress = window.scrollY / maxScroll
      const travel = window.innerHeight - THUMB_HEIGHT
      setThumbY(progress * travel)
      setVisible(true)

      window.clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = window.setTimeout(() => {
        setVisible(false)
      }, HIDE_DELAY_MS)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      window.clearTimeout(hideTimeoutRef.current)
    }
  }, [])

  if (!canScroll) return null

  return (
    <div
      className={`scroll-indicator${visible ? ' is-visible' : ''}`}
      aria-hidden="true"
    >
      <span
        className="scroll-indicator-thumb"
        style={{ transform: `translate3d(0, ${thumbY}px, 0)` }}
      />
    </div>
  )
}
