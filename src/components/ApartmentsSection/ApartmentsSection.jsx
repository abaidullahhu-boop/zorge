import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import apartmentsHero from '../../assets/images/apartments-hero.webp'
import apartmentsStudio from '../../assets/images/apartments-studio.png'
import apartments1br from '../../assets/images/apartments-1br.png'
import apartments2br from '../../assets/images/apartments-2br.png'
import apartments3br from '../../assets/images/apartments-3br.png'
import apartmentsPenthouse from '../../assets/images/apartments-penthouse.png'
import '../../assets/styles/ApartmentsSection.css'

const APARTMENTS = [
  {
    id: 'studios',
    label: 'studios',
    area: '26-30',
    plan: apartmentsStudio,
  },
  {
    id: '1BR',
    label: '1BR',
    area: '36-65',
    plan: apartments1br,
  },
  {
    id: '2BR',
    label: '2BR',
    area: '56-67',
    plan: apartments2br,
  },
  {
    id: '3br',
    label: '3br',
    area: '64-80',
    plan: apartments3br,
  },
  {
    id: 'terraces',
    label: 'with terraces',
    area: '67-81',
    plan: apartments3br,
  },
  {
    id: 'penthouse',
    label: 'penthouse',
    area: '60-150',
    plan: apartmentsPenthouse,
  },
]

function ApartmentsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [exitIndex, setExitIndex] = useState(null)
  const sectionRef = useRef(null)
  const stickyRef = useRef(null)
  const exitTimerRef = useRef(0)
  const activeIndexRef = useRef(0)

  const selectType = (nextIndex) => {
    const prevIndex = activeIndexRef.current
    if (nextIndex === prevIndex) return

    window.clearTimeout(exitTimerRef.current)
    setExitIndex(prevIndex)
    activeIndexRef.current = nextIndex
    setActiveIndex(nextIndex)

    exitTimerRef.current = window.setTimeout(() => {
      setExitIndex(null)
    }, 1100)
  }

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.08 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    return () => window.clearTimeout(exitTimerRef.current)
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    const sticky = stickyRef.current
    if (!section || !sticky) return undefined

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (reduceMotion) {
      gsap.set(sticky, { y: 0, clearProps: 'transform' })
      return undefined
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.matchMedia({
        '(max-width: 760px)': () => {
          const getLift = () => Math.min(window.innerHeight * 0.16, 140)

          gsap.fromTo(
            sticky,
            { y: getLift, force3D: true },
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
        },
        '(min-width: 761px)': () => {
          gsap.set(sticky, { y: 0, clearProps: 'transform' })

          const image = sticky.querySelector('.apartments-image-bg')
          if (!image) return

          // Drift upward into the extra height below — bottom stays covered.
          gsap.fromTo(
            image,
            { yPercent: 0, force3D: true },
            {
              yPercent: -18,
              ease: 'none',
              force3D: true,
              scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: 'bottom top',
                scrub: 1.2,
                invalidateOnRefresh: true,
              },
            },
          )
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`apartments-section ${isVisible ? 'is-visible' : ''}`}
      id="apartments"
      aria-labelledby="apartments-title"
    >
      <div className="apartments-mobile-hero">
        <div className="apartments-mobile-hero-media">
          <img
            src={apartmentsHero}
            alt=""
            width={720}
            height={780}
            draggable="false"
            loading="lazy"
          />
        </div>
        <div className="apartments-mobile-hero-content">
          <h2 id="apartments-title-mobile" className="apartments-hero-title">
            <span>SPLENDID</span>
            <span>APARTMENTS</span>
          </h2>
          <p className="apartments-hero-copy">
            Refined finishes, neoclassical furniture, and beauty imprinted in
            every detail—the atmosphere of these apartments makes you want to
            immerse yourself in them again and again. These apartments offer
            breathtaking views of the capital&apos;s magnificent buildings,
            which transform into a watercolor landscape on the wall of your
            living room.
          </p>
        </div>
      </div>

      <div className="apartments-sticky" ref={stickyRef}>
        <div className="apartments-slide">
          <div className="apartments-content">
            <h2 id="apartments-title" className="apartments-sr-only">
              Splendid Apartments
            </h2>

            <div
              className="apartments-types"
              role="tablist"
              aria-label="Apartment types"
            >
              {APARTMENTS.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  className={`apartments-type ${
                    index === activeIndex ? 'is-active' : ''
                  }`}
                  aria-selected={index === activeIndex}
                  aria-controls={`apartments-panel-${item.id}`}
                  id={`apartments-tab-${item.id}`}
                  onClick={() => selectType(index)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="apartments-area" aria-live="polite">
              {APARTMENTS.map((item, index) => (
                <p
                  key={item.id}
                  className={[
                    'apartments-area-item',
                    index === activeIndex ? 'is-active' : '',
                    index === exitIndex ? 'is-exit' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-hidden={index !== activeIndex}
                >
                  <span className="apartments-area-value">{item.area}</span>
                  <span className="apartments-area-unit">
                    м<sup>2</sup>
                  </span>
                </p>
              ))}
            </div>

            <div className="apartments-plan">
              {APARTMENTS.map((item, index) => (
                <div
                  key={item.id}
                  id={`apartments-panel-${item.id}`}
                  role="tabpanel"
                  aria-labelledby={`apartments-tab-${item.id}`}
                  className={[
                    'apartments-plan-item',
                    index === activeIndex ? 'is-active' : '',
                    index === exitIndex ? 'is-exit' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-hidden={index !== activeIndex}
                >
                  <img
                    src={item.plan}
                    alt={`${item.label} floor plan`}
                    width={540}
                    height={420}
                    draggable="false"
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                </div>
              ))}
            </div>

            <p className="apartments-conditions">
              <span className="apartments-conditions-label">
                Purchase conditions:
              </span>
              <br />
              mortgage, 0% installment plan, trade-in
            </p>
          </div>

          <div className="apartments-image">
            <img
              className="apartments-image-bg"
              src={apartmentsHero}
              alt=""
              width={1282}
              height={1388}
              draggable="false"
            />
            <div className="apartments-image-title">
              <p className="apartments-hero-title">
                <span>SPLENDID</span>
                <span>APARTMENTS</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ApartmentsSection
