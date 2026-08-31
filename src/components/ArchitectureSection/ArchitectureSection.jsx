import { useEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'
import heroImage from '../../assets/images/core1.png'
import '../../assets/styles/ArchitectureSection.css'

const HOVER_MQ = '(hover: hover) and (pointer: fine)'

function canHover() {
  return window.matchMedia(HOVER_MQ).matches
}

const CORE_VALUES = [
  {
    id: 'integrity',
    title: 'Integrity',
    text: 'We conduct every project with honesty, transparency, and ethical business practices.',
    placement: 'bottom',
    x: 50,
    y: 36.5,
  },
  {
    id: 'innovation',
    title: 'Innovation',
    text: 'We embrace modern technology, creative design, and smart solutions to shape the future of real estate.',
    placement: 'left',
    x: 71,
    y: 45,
  },
  {
    id: 'trust',
    title: 'Trust',
    text: 'Every relationship is built on credibility, accountability, and long-term commitment.',
    placement: 'left',
    x: 76,
    y: 64,
  },
  {
    id: 'quality',
    title: 'Quality Excellence',
    text: 'We never compromise on construction standards, craftsmanship, or attention to detail.',
    placement: 'top',
    x: 64,
    y: 80.5,
  },
  {
    id: 'commitment',
    title: 'Commitment',
    text: 'We honor our promises by delivering projects on time while maintaining the highest standards of excellence.',
    placement: 'top',
    x: 34.8,
    y: 80.5,
  },
  {
    id: 'growth',
    title: 'Growth Through People',
    text: 'We believe in empowering young talent, fostering leadership, and creating opportunities for future generations.',
    placement: 'right',
    x: 24,
    y: 64,
  },
  {
    id: 'customer',
    title: 'Customer First',
    text: 'Our clients are at the heart of every decision we make, and their trust is our greatest achievement.',
    placement: 'right',
    x: 29,
    y: 45,
  },
]

function ArchitectureSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeId, setActiveId] = useState(null)
  const sectionRef = useRef(null)
  const slideRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.12 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    const slide = slideRef.current
    if (!section || !slide) return undefined

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(slide, { y: 0, clearProps: 'transform' })
      return undefined
    }

    if (window.matchMedia('(max-width: 980px)').matches) {
      gsap.set(slide, { y: 0, clearProps: 'transform' })
      return undefined
    }

    const ctx = gsap.context(() => {
      // Climb over the map while both sections scroll together.
      const getLift = () => Math.min(window.innerHeight * 0.2, 180)

      gsap.fromTo(
        slide,
        {
          y: getLift,
          force3D: true,
        },
        {
          y: 0,
          ease: 'none',
          force3D: true,
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'top top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      )
    }, section)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const close = () => setActiveId(null)

    const onPointerDown = (event) => {
      if (!(event.target instanceof Node)) return
      if (!section.contains(event.target)) {
        close()
        return
      }
      if (!event.target.closest('.architecture-hotspot')) close()
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') close()
    }

    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  const handleHotspotEnter = (id) => {
    if (!canHover()) return
    setActiveId(id)
  }

  const handleHotspotLeave = () => {
    if (!canHover()) return
    setActiveId(null)
  }

  const handleHotspotClick = (id) => {
    if (canHover()) return
    setActiveId((current) => (current === id ? null : id))
  }

  return (
    <section
      ref={sectionRef}
      className={`architecture-section ${isVisible ? 'is-visible' : ''}`}
      id="architecture"
      aria-labelledby="architecture-title"
    >
      <div className="architecture-slide" ref={slideRef}>
        <div className="architecture-intro-row">
          <h2 id="architecture-title" className="architecture-intro">
            Our Core Values
          </h2>
        </div>

        <div className="architecture-hero" id="architecture-hero">
          <div className="architecture-hero-stage">
            <img
              className="architecture-hero-image"
              src={heroImage}
              alt="Dayim Developers core values"
              draggable="false"
            />

            <ul className="architecture-hotspots">
              {CORE_VALUES.map((value) => {
                const isActive = activeId === value.id

                return (
                  <li
                    key={value.id}
                    className={`architecture-hotspot architecture-hotspot--${value.placement}${isActive ? ' is-active' : ''}`}
                    style={{
                      '--hotspot-x': `${value.x}%`,
                      '--hotspot-y': `${value.y}%`,
                    }}
                    onPointerEnter={() => handleHotspotEnter(value.id)}
                    onPointerLeave={handleHotspotLeave}
                  >
                    <button
                      type="button"
                      className="architecture-hotspot-hit"
                      aria-expanded={isActive}
                      aria-controls={`architecture-popup-${value.id}`}
                      aria-label={value.title}
                      onClick={() => handleHotspotClick(value.id)}
                    />

                    <aside
                      className="architecture-hotspot-popup"
                      id={`architecture-popup-${value.id}`}
                      aria-hidden={!isActive}
                    >
                      <button
                        type="button"
                        className="architecture-hotspot-close"
                        aria-label="Close"
                        onClick={(event) => {
                          event.stopPropagation()
                          setActiveId(null)
                        }}
                      >
                        ×
                      </button>
                      <p className="architecture-hotspot-kicker">Core value</p>
                      <h3 className="architecture-hotspot-title">{value.title}</h3>
                      <p className="architecture-hotspot-text">{value.text}</p>
                    </aside>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ArchitectureSection
