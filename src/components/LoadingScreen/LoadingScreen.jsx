import { useEffect, useRef, useState } from 'react'
import '../../assets/styles/LoadingScreen.css'

const SCROLL_KEY = 'dayim-scroll-y'

function persistScroll() {
  try {
    const y = window.__dayimLenis?.scroll ?? window.scrollY ?? 0
    sessionStorage.setItem(SCROLL_KEY, String(Math.round(y)))
  } catch {
    /* ignore */
  }
}

function LoadingScreen({ onHidden }) {
  const [visible, setVisible] = useState(true)
  const [cookieVisible, setCookieVisible] = useState(
    () => localStorage.getItem('dayim-cookies-accepted') !== 'true'
  )
  const didNotifyHidden = useRef(false)

  useEffect(() => {
    window.addEventListener('scroll', persistScroll, { passive: true })
    window.addEventListener('pagehide', persistScroll)
    window.addEventListener('beforeunload', persistScroll)

    return () => {
      window.removeEventListener('scroll', persistScroll)
      window.removeEventListener('pagehide', persistScroll)
      window.removeEventListener('beforeunload', persistScroll)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 2800)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (visible || didNotifyHidden.current) return
    didNotifyHidden.current = true
    onHidden?.()
  }, [visible, onHidden])

  const hiddenClass = visible ? '' : 'loading-screen--hidden'

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
              localStorage.setItem('dayim-cookies-accepted', 'true')
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
        <div className="loading-frame" role="status" aria-label="Loading Dayim Developers">
          <span className="loading-logo">
            DAYIM
            <br />
            DEVELOPERS
          </span>
          <span className="loading-tagline">
            Building Trust.
            <br />
            Creating Lifestyles.
            <br />
            Shaping the Future.
          </span>
        </div>
      </div>
    </>
  )
}

export default LoadingScreen
