import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../assets/styles/MenuOverlay.css'

const ICONS = '/assets/images/icons.svg'

const MENU_LINKS = [
  { label: 'Our Projects', action: 'projects', mobileOnly: true },
  { label: 'About Us', href: '#about' },
  { label: 'Our Core Values', href: '#architecture' },
  { label: 'Our Vision', href: '#panorama' },
  { label: 'Choose Dayim', href: '#advantages' },
  { label: 'Careers', to: '/careers' },
  { label: 'Contact Us', href: '#contact' },
]

function getActiveHref() {
  const mid = window.innerHeight * 0.35
  let bestHref = MENU_LINKS.find((link) => link.href)?.href
  let bestDist = Number.POSITIVE_INFINITY
  const seen = new Set()

  for (const { href } of MENU_LINKS) {
    if (!href || seen.has(href)) continue
    seen.add(href)
    const el = document.querySelector(href)
    if (!el) continue
    const { top, bottom } = el.getBoundingClientRect()
    if (bottom < 0 || top > window.innerHeight) continue
    const dist = Math.abs(top - mid)
    if (dist < bestDist) {
      bestDist = dist
      bestHref = href
    }
  }

  return bestHref
}

function scrollToTarget(selector) {
  const target = document.querySelector(selector)
  if (!target) return

  window.dispatchEvent(
    new CustomEvent('dayim:scroll-to', {
      detail: { el: target },
    }),
  )
}

function MenuOverlay({ open, onClose }) {
  const navigate = useNavigate()
  const [activeHref, setActiveHref] = useState(
    () => MENU_LINKS.find((link) => link.href)?.href,
  )

  useEffect(() => {
    if (!open) return undefined

    setActiveHref(getActiveHref())

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  const handleNav = (event, href) => {
    event.preventDefault()
    setActiveHref(href)
    onClose()
    window.setTimeout(() => scrollToTarget(href), 120)
  }

  const handleAction = (event, action) => {
    event.preventDefault()
    onClose()
    if (action === 'projects') {
      window.setTimeout(() => {
        window.dispatchEvent(new CustomEvent('dayim:projects'))
      }, 120)
    }
  }

  const handleRoute = (event, to) => {
    event.preventDefault()
    onClose()
    window.setTimeout(() => navigate(to), 120)
  }

  return (
    <div
      className={`menu-overlay${open ? ' is-open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
      id="menu"
      onClick={onClose}
    >
      <div
        className="menu-overlay__panel"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="menu-overlay__atmosphere" aria-hidden="true" />

        <div className="menu-overlay__content">
          <header className="menu-overlay__header">
            <button
              className="menu-overlay__brand"
              type="button"
              aria-label="Close menu"
              onClick={onClose}
            >
              <span className="menu-overlay__brand-kicker">Menu</span>
              <span className="menu-overlay__brand-name">Dayim Developers</span>
            </button>

            <button
              className="menu-overlay__close"
              type="button"
              aria-label="Close"
              onClick={onClose}
            >
              <svg
                className="menu-overlay__close-icon"
                width="18"
                height="16"
                aria-hidden="true"
                viewBox="0 0 18 16"
              >
                <use href={`${ICONS}#close`} />
              </svg>
            </button>
          </header>

          <nav className="menu-overlay__nav" aria-label="Site sections">
            <ul className="menu-overlay__list">
              {MENU_LINKS.map(({ label, href, to, action, mobileOnly }, index) => {
                const isActive =
                  href === activeHref &&
                  MENU_LINKS.find((link) => link.href === activeHref)?.label ===
                    label

                return (
                  <li
                    key={label}
                    className={`menu-overlay__item${mobileOnly ? ' menu-overlay__item--mobile-only' : ''}`}
                    style={{ '--menu-i': index + 1 }}
                  >
                    <a
                      className={`menu-overlay__link${isActive ? ' is-active' : ''}`}
                      href={to ?? href ?? '#'}
                      aria-current={isActive ? 'true' : undefined}
                      onClick={(event) => {
                        if (action) return handleAction(event, action)
                        if (to) return handleRoute(event, to)
                        return handleNav(event, href)
                      }}
                    >
                      <span className="menu-overlay__link-text">{label}</span>
                      <span className="menu-overlay__link-arrow" aria-hidden="true">
                        <svg
                          className="menu-overlay__arrow-icon"
                          width="7"
                          height="12"
                          viewBox="0 0 7 12"
                          fill="none"
                        >
                          <path
                            pathLength="100"
                            d="M1.027 1 6 5.167v1.666L1.027 11"
                            stroke="currentColor"
                            strokeWidth="1.2"
                          />
                        </svg>
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default MenuOverlay
