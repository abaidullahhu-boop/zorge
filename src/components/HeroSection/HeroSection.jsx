import { useCallback, useEffect, useRef, useState } from 'react'
import aboutVideo from '../../assets/images/about.mp4'
import MenuOverlay from '../MenuOverlay/MenuOverlay'
import ProjectsOverlay from '../ProjectsOverlay/ProjectsOverlay'
import { SITE_CONTACT } from '../../data/siteContact'
import { gsap } from '../../lib/gsap'
import '../../assets/styles/HeroSection.css'

function HeroSection({ introReady = false }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [projectsOpen, setProjectsOpen] = useState(false)
  const closeProjects = useCallback(() => setProjectsOpen(false), [])
  const frameRef = useRef(null)
  const heroRef = useRef(null)
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    const handleOpenProjects = () => setProjectsOpen(true)
    const handleGoHome = () => {
      setProjectsOpen(false)
      setMenuOpen(false)
    }
    window.addEventListener('dayim:projects', handleOpenProjects)
    window.addEventListener('dayim:home', handleGoHome)
    return () => {
      window.removeEventListener('dayim:projects', handleOpenProjects)
      window.removeEventListener('dayim:home', handleGoHome)
    }
  }, [])

  useEffect(() => {
    const heroActions = document.querySelector('.hero-actions')
    const heroProjects = document.querySelector('.hero-projects')
    const locationSection = document.querySelector('.location-section')
    const locationImage = document.querySelector('.location-image-wrap')
    const architectureSection = document.querySelector('.architecture-section')
    const projectsSection = document.querySelector('.projects-section')

    if (!heroActions) return undefined

    const updateNavColor = () => {
      const navRect = heroActions.getBoundingClientRect()
      const navY = navRect.top + navRect.height / 2
      let isOnLight = false
      let isOnProjects = false

      if (projectsSection) {
        const projectsRect = projectsSection.getBoundingClientRect()
        isOnProjects =
          projectsRect.top <= navY && projectsRect.bottom > navY

        if (isOnProjects) {
          isOnLight = true
        }
      }

      if (!isOnLight && architectureSection) {
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
      heroActions.classList.toggle('is-on-projects', isOnProjects)

      if (heroProjects) {
        heroProjects.setAttribute('aria-hidden', isOnProjects ? 'true' : 'false')
        heroProjects.toggleAttribute('inert', isOnProjects)
      }
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

    if (window.matchMedia('(max-width: 980px)').matches) {
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
          className={`dayim-hero${introReady ? ' is-intro-ready' : ''}`}
          aria-labelledby="hero-title"
        >
        <div className="hero-video-bg" aria-hidden="true">
          <video autoPlay muted loop playsInline preload="metadata">
            <source src={aboutVideo} type="video/mp4" />
          </video>
        </div>
        <div className="building" aria-hidden="true">
          <div className="building__layer building__layer--primary" />
          <div className="building__layer building__layer--alt" />
        </div>
        <header className="hero-header">
          <h1 id="hero-title">
            <span className="hero-title-line">
              <span>Building Your Vision.</span>
            </span>
            <span className="hero-title-line">
              <span>Creating Reality.</span>
            </span>
          </h1>

         
        </header>

        <p className="intro__logo" aria-label="Dayim Developers">
          <span aria-hidden="true">DAYIM</span>
          <span aria-hidden="true">DEVELOPERS</span>
        </p>
      </section>
      </div>

      <div className="hero-actions">
        <div className="hero-projects" aria-label="Quick actions">
          <a
            className="hero-project-btn hero-project-btn--whatsapp"
            href={SITE_CONTACT.phone.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
          >
            <svg
              className="hero-whatsapp-icon"
              viewBox="-1 -1 26 26"
              fill="currentColor"
              overflow="visible"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>
          <button
            className="hero-project-btn hero-project-btn--projects"
            type="button"
            onClick={() => setProjectsOpen(true)}
          >
            <span className="hero-project-btn__label">
              <span>Our Projects</span>
              <span aria-hidden="true">Our Projects</span>
            </span>
          </button>
        </div>
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
      <ProjectsOverlay open={projectsOpen} onClose={closeProjects} />
    </>
  )
}

export default HeroSection
