import { useEffect, useState } from 'react'
import menuDecor from '../../assets/images/deco.png'
import '../../assets/styles/MenuOverlay.css'

const ICONS = '/assets/images/icons.svg'

const MENU_LINKS = [
  { label: 'About Us', href: '#about' },
  { label: 'Our Story', href: '#architecture' },
  { label: 'Vision', href: '#panorama' },
  { label: 'Values', href: '#advantages' },
  { label: 'Why Choose Us', href: '#fitness' },
  { label: 'Signature Apartments', href: '#apartments' },
  { label: 'Investment', href: '#improvement' },
  { label: 'Construction', href: '#construction' },
]

function getActiveHref() {
  const mid = window.innerHeight * 0.35
  let bestHref = MENU_LINKS[0].href
  let bestDist = Number.POSITIVE_INFINITY
  const seen = new Set()

  for (const { href } of MENU_LINKS) {
    if (seen.has(href)) continue
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
  const [activeHref, setActiveHref] = useState(MENU_LINKS[0].href)

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
    // Allow close animation to start before scrolling
    window.setTimeout(() => scrollToTarget(href), 120)
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
        <div className="menu-overlay__side">
          <img
            className="menu-overlay__decor"
            src={menuDecor}
            alt=""
            draggable="false"
          />

          <button
            className="menu-overlay__logo"
            type="button"
            aria-label="Close"
            onClick={onClose}
          >
            <span className="menu-overlay__logo-mark" aria-hidden="true">
              <span>DAYIM DEVELOPERS</span>
            </span>
          </button>

          <div className="menu-overlay__side-footer">
            <a
              className="menu-overlay__gallery"
              href="#gallery"
              onClick={(event) => handleNav(event, '#gallery')}
            >
              <span className="menu-overlay__gallery-text">
                <span className="menu-overlay__gallery-clone">
                  <span>
                    Gallery of Completed
                    <br />
                    Residences
                  </span>
                  <span aria-hidden="true">
                    Gallery of Completed
                    <br />
                    Residences
                  </span>
                </span>
              </span>
              <span className="menu-overlay__gallery-arrow" aria-hidden="true">
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
          </div>
        </div>

        <div className="menu-overlay__content">
          <header className="menu-overlay__header">
            <button
              className="menu-overlay__mobile-logo"
              type="button"
              aria-label="Close"
              onClick={onClose}
            >
              <span className="menu-overlay__mobile-logo-mark" aria-hidden="true">
                <span>DAYIM DEVELOPERS</span>
              </span>
            </button>

            <div className="menu-overlay__header-actions">
              <a
                className="menu-overlay__apartment"
                href="#apartments"
                onClick={(event) => handleNav(event, '#apartments')}
              >
                <span className="menu-overlay__apartment-label">
                  <span>Signature Apartments</span>
                  <span aria-hidden="true">Signature Apartments</span>
                </span>
              </a>

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
            </div>
          </header>

          <nav className="menu-overlay__nav" aria-label="Site sections">
            <ul className="menu-overlay__list">
              {MENU_LINKS.map(({ label, href }) => {
                const isActive =
                  href === activeHref &&
                  MENU_LINKS.find((link) => link.href === activeHref)?.label === label
                return (
                  <li key={label} className="menu-overlay__item">
                    <a
                      className={`menu-overlay__link${isActive ? ' is-active' : ''}`}
                      href={href}
                      aria-current={isActive ? 'true' : undefined}
                      onClick={(event) => handleNav(event, href)}
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

          <div className="menu-overlay__divider" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}

export default MenuOverlay
