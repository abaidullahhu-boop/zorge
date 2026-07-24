import { useCallback, useEffect, useRef, useState } from 'react'
import heroModel from '../../assets/images/decor.webp'
import MenuOverlay from '../MenuOverlay/MenuOverlay'
import { gsap } from '../../lib/gsap'
import '../../assets/styles/HeroSection.css'

function HeroSection({ introReady = false }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const frameRef = useRef(null)
  const heroRef = useRef(null)
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    const heroActions = document.querySelector('.hero-actions')
    const locationSection = document.querySelector('.location-section')
    const locationImage = document.querySelector('.location-image-wrap')
    const architectureSection = document.querySelector('.architecture-section')

    if (!heroActions) return undefined

    const updateNavColor = () => {
      const navRect = heroActions.getBoundingClientRect()
      const navY = navRect.top + navRect.height / 2
      let isOnLight = false

      if (architectureSection) {
        const architectureRect = architectureSection.getBoundingClientRect()
        const isOnArchitecture =
          architectureRect.top <= navY && architectureRect.bottom > navY

        if (isOnArchitecture) {
          isOnLight = true
        }
      }

      if (!isOnLight && locationSection && locationImage) {
        const locationRect = locationSection.getBoundingClientRect()
        const imageRect = locationImage.getBoundingClientRect()
        const isOnLocation =
          locationRect.top <= navY && locationRect.bottom > navY
        const isOverImage =
          imageRect.top <= navY && imageRect.bottom > navY

        isOnLight = isOnLocation && !isOverImage
      }

      heroActions.classList.toggle('is-on-light', isOnLight)
    }

    updateNavColor()
    window.addEventListener('scroll', updateNavColor, { passive: true })
    window.addEventListener('resize', updateNavColor)

    return () => {
      window.removeEventListener('scroll', updateNavColor)
      window.removeEventListener('resize', updateNavColor)
    }
  }, [])

  useEffect(() => {
    const frame = frameRef.current
    const hero = heroRef.current
    if (!frame || !hero) return undefined

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }

    const ctx = gsap.context(() => {
      gsap.to(hero, {
        y: () => -window.innerHeight * 0.22,
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          trigger: frame,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })
    }, frame)

    return () => ctx.revert()
  }, [])

  return (
    <>
      <div className="hero-scroll-frame" ref={frameRef}>
        <section
          ref={heroRef}
          className={`zorge-hero${introReady ? ' is-intro-ready' : ''}`}
          aria-labelledby="hero-title"
        >
        <div className="building" aria-hidden="true">
          <div className="building__layer building__layer--primary" />
          <div className="building__layer building__layer--alt" />
        </div>
        <img
          className="hero-model"
          src={heroModel}
          alt=""
          aria-hidden="true"
        />

        <header className="hero-header">
          <h1 id="hero-title">
            <span className="hero-title-line">
              <span>Premium residence —</span>
            </span>
            <span className="hero-title-line">
              <span>the embodiment of your</span>
            </span>
            <span className="hero-title-line">
              <span>status</span>
            </span>
          </h1>
        </header>

        <button
          className="scroll-cue"
          type="button"
          aria-label="Scroll to explore"
          onClick={() => {
            document.querySelector('#about')?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            })
          }}
        >
          <span className="scroll-cue__line" aria-hidden="true" />
          <span className="scroll-cue__head" aria-hidden="true">
            <span className="scroll-cue__arm scroll-cue__arm--left" />
            <span className="scroll-cue__arm scroll-cue__arm--right" />
          </span>
        </button>

        <p className="intro__logo" aria-label="Zorge number nine">
          <span aria-hidden="true">Z</span>
          <span aria-hidden="true">O</span>
          <span aria-hidden="true">R</span>
          <span aria-hidden="true">G</span>
          <span aria-hidden="true">E</span>
          <span className="intro__logo-no" aria-hidden="true">
            <span className="intro__logo-n">N</span>
            <span className="intro__logo-mark">
              <span className="intro__logo-mark-ring">º</span>
              <span className="intro__logo-mark-dot" />
            </span>
            <span>9</span>
          </span>
        </p>
      </section>
      </div>

      <div className="hero-actions">
        <button
          className="apartment-button"
          type="button"
          onClick={() => {
            const target = document.querySelector('#apartments')
            if (!target) return
            window.dispatchEvent(
              new CustomEvent('zorge:scroll-to', { detail: { el: target } }),
            )
          }}
        >
          <span className="apartment-button-label">
            <span>Choose an apartment</span>
            <span aria-hidden="true">Choose an apartment</span>
          </span>
        </button>
        <button
          className={`menu-button ${menuOpen ? 'is-open' : ''}`}
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <span />
          <span />
        </button>
      </div>
      <MenuOverlay open={menuOpen} onClose={closeMenu} />
    </>
  )
}

export default HeroSection
