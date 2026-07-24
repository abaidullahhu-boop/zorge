import { useEffect, useRef, useState } from 'react'
import '../../assets/styles/LoadingScreen.css'

const SCROLL_KEY = 'zorge-scroll-y'

function readScrollHint() {
  try {
    const saved = sessionStorage.getItem(SCROLL_KEY)
    if (saved != null) {
      const value = Number(saved)
      if (Number.isFinite(value)) return value
    }
  } catch {
    /* private mode / blocked storage */
  }
  return window.__zorgeLenis?.scroll ?? window.scrollY ?? window.pageYOffset ?? 0
}

function isAtHeroSection(scrollY = readScrollHint()) {
  const hash = window.location.hash
  if (hash && hash !== '#' && hash !== '#top') return false
  return scrollY < window.innerHeight * 0.5
}

function persistScroll() {
  try {
    const y = window.__zorgeLenis?.scroll ?? window.scrollY ?? 0
    sessionStorage.setItem(SCROLL_KEY, String(Math.round(y)))
  } catch {
    /* ignore */
  }
}

function LoadingScreen({ onHidden }) {
  const [atHero, setAtHero] = useState(() => isAtHeroSection())
  const [visible, setVisible] = useState(true)
  const [cookieVisible, setCookieVisible] = useState(true)
  const [exitMode, setExitMode] = useState(null)
  const didNotifyHidden = useRef(false)

  useEffect(() => {
    const syncHeroState = () => {
      if (exitMode) return
      const y = window.__zorgeLenis?.scroll ?? window.scrollY ?? 0
      // Prefer the larger of saved vs live so mid-page restore wins over a stale 0.
      let saved = 0
      try {
        saved = Number(sessionStorage.getItem(SCROLL_KEY)) || 0
      } catch {
        saved = 0
      }
      const scrollY = Math.max(y, saved)
      if (y > 0) persistScroll()
      setAtHero(isAtHeroSection(scrollY))
    }

    syncHeroState()
    const t0 = window.setTimeout(syncHeroState, 0)
    const t1 = window.setTimeout(syncHeroState, 120)
    window.addEventListener('pageshow', syncHeroState)
    window.addEventListener('scroll', persistScroll, { passive: true })
    window.addEventListener('pagehide', persistScroll)
    window.addEventListener('beforeunload', persistScroll)

    return () => {
      window.clearTimeout(t0)
      window.clearTimeout(t1)
      window.removeEventListener('pageshow', syncHeroState)
      window.removeEventListener('scroll', persistScroll)
      window.removeEventListener('pagehide', persistScroll)
      window.removeEventListener('beforeunload', persistScroll)
    }
  }, [exitMode])

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 2800)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (visible || didNotifyHidden.current) return
    didNotifyHidden.current = true
    setExitMode(atHero ? 'hero' : 'dismiss')
    onHidden?.()
  }, [visible, atHero, onHidden])

  const mode = exitMode ?? (atHero ? 'hero' : 'dismiss')
  const hiddenClass = visible
    ? ''
    : mode === 'hero'
      ? 'loading-screen--hidden'
      : 'loading-screen--hidden loading-screen--dismiss'

  return (
    <>
      {cookieVisible && (
        <div className="loading-cookie text-white">
          <span className="loading-cookie__message">
            This site collects{' '}
            <span className="loading-cookie__word">
              <span data-text="cookie">cookie</span>
            </span>{' '}
            files
          </span>
          <button
            type="button"
            onClick={() => {
              setCookieVisible(false)
              setVisible(false)
            }}
          >
            Accept
          </button>
        </div>
      )}

      <div
        className={`loading-screen ${hiddenClass}`.trim()}
        aria-hidden={!visible}
      >
        <div className="loading-frame" role="status" aria-label="Loading Zorge">
          <span className="loading-logo">
            ZORGE <small>Nº9</small>
          </span>
          <span className="loading-tagline">
            The luxury
            <br />
            of experience
          </span>
        </div>
      </div>
    </>
  )
}

export default LoadingScreen
