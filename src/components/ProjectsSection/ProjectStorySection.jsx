import { useEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'
import collection1 from '../../assets/images/collection1.png'
import collection2 from '../../assets/images/collection2.png'
import collection3 from '../../assets/images/collection3.png'
import collection4 from '../../assets/images/collection4.png'
import collection5 from '../../assets/images/collection5.png'
import collection6 from '../../assets/images/collection6.png'
import collection8 from '../../assets/images/collection8.png'
import groundFloorPlan from '../../assets/images/gfloor.jpeg'
import lowerGroundFloorPlan from '../../assets/images/lfloor.jpeg'
import firstFloorPlan from '../../assets/images/1floor.jpeg'
import secondFloorPlan from '../../assets/images/2floor.jpeg'
import '../../assets/styles/ArchitectureSection.css'

const floorPlanGallery = [
  {
    id: 'lower-ground',
    src: lowerGroundFloorPlan,
    alt: 'Lower Ground Floor commercial shops layout',
    label: 'Lower Ground',
    detail: 'Retail shops with main lobby & service core',
  },
  {
    id: 'ground',
    src: groundFloorPlan,
    alt: 'Ground Floor offices layout',
    label: 'Ground Floor',
    detail: 'Commercial offices with lobby, lift & pantry',
  },
  {
    id: 'first',
    src: firstFloorPlan,
    alt: 'First Floor commercial outlets layout',
    label: 'First Floor',
    detail: 'Commercial outlets across seven shop units',
  },
  {
    id: 'second',
    src: secondFloorPlan,
    alt: '2nd to 6th Floor studio and one bed apartments layout',
    label: '2 - 6 Floor',
    detail: 'Studio & one-bed apartments with balconies',
  },
]

const PLAN_COUNT = floorPlanGallery.length
const CLIP_HIDDEN = 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)'
const CLIP_VISIBLE = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'

const decorLayers = [
  { src: collection1, vmin: 2, isBase: true, zIndex: 1 },
  { src: collection2, vmin: 4, zIndex: 2 },
  { src: collection3, vmin: 6, zIndex: 3 },
  { src: collection4, vmin: 8, zIndex: 4 },
  { src: collection8, vmin: 14, zIndex: 5 },
  { src: collection5, vmin: 10, zIndex: 6 },
  { src: collection6, vmin: 12, zIndex: 7 },
]

function DecorLayer({ src, vmin, isBase = false, zIndex }) {
  const className = [
    'architecture-decor-layer',
    isBase
      ? 'architecture-decor-layer--base'
      : 'architecture-decor-layer--cover',
  ].join(' ')

  return (
    <div
      className={className}
      data-parallax-vmin={vmin}
      style={{ zIndex }}
    >
      <img src={src} alt="" draggable="false" />
    </div>
  )
}

function ProjectStorySection({ scrollContainerRef = null }) {
  const [isVisible, setIsVisible] = useState(false)
  const [activePlanIndex, setActivePlanIndex] = useState(0)
  const sectionRef = useRef(null)
  const galleryPinRef = useRef(null)
  const galleryStickyRef = useRef(null)
  const activeIndexRef = useRef(0)
  const setActiveFromScrollRef = useRef(null)
  const activePlan = floorPlanGallery[activePlanIndex] ?? floorPlanGallery[0]

  setActiveFromScrollRef.current = (nextIndex) => {
    if (nextIndex === activeIndexRef.current) return
    activeIndexRef.current = nextIndex
    setActivePlanIndex(nextIndex)
  }

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
    const pin = galleryPinRef.current
    const sticky = galleryStickyRef.current
    if (!pin || !sticky) return undefined

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const images = [...sticky.querySelectorAll('.architecture-gallery-stack-item')]

    if (reduceMotion || images.length < 2) {
      images.forEach((image, index) => {
        gsap.set(image, {
          zIndex: index + 1,
          clipPath: CLIP_VISIBLE,
          y: 0,
          clearProps: reduceMotion ? 'clipPath,transform' : undefined,
        })
      })
      return undefined
    }

    const scroller = scrollContainerRef?.current ?? undefined
    const scrollTriggerBase = scroller ? { scroller } : {}

    const ctx = gsap.context(() => {
      images.forEach((image, index) => {
        gsap.set(image, {
          zIndex: index === 0 ? 1 : 0,
          clipPath: index === 0 ? CLIP_VISIBLE : CLIP_HIDDEN,
          y: index === 0 ? '0%' : '5%',
        })
      })

      const getStickyH = () => sticky.offsetHeight || window.innerHeight

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          ...scrollTriggerBase,
          trigger: pin,
          start: 'top top',
          end: () => `+=${getStickyH() * (PLAN_COUNT - 1)}`,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const segments = PLAN_COUNT - 1
            const raw = self.progress * segments
            const base = Math.min(PLAN_COUNT - 1, Math.floor(raw))
            const local = raw - Math.floor(raw)
            const nextIndex =
              raw >= segments
                ? PLAN_COUNT - 1
                : local >= 0.5
                  ? Math.min(PLAN_COUNT - 1, base + 1)
                  : base
            setActiveFromScrollRef.current?.(nextIndex)
          },
        },
      })

      for (let i = 0; i < PLAN_COUNT - 1; i += 1) {
        const next = i + 1
        const position = i
        const prevImage = images[i]
        const nextImage = images[next]

        if (nextImage) {
          gsap.set(nextImage, { zIndex: next + 1 })
          tl.fromTo(
            nextImage,
            { clipPath: CLIP_HIDDEN, y: '5%' },
            { clipPath: CLIP_VISIBLE, y: '0%', duration: 1 },
            position,
          )
        }

        if (prevImage) {
          tl.to(prevImage, { y: '-8%', duration: 1 }, position)
        }
      }
    }, pin)

    return () => ctx.revert()
  }, [scrollContainerRef])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const viewportCenter = () => window.innerHeight / 2

    const updateParallax = () => {
      const decor = section.querySelector('.architecture-decor')
      if (!decor) return

      const bounds = decor.getBoundingClientRect()
      const elementCenter = bounds.top + bounds.height / 2
      const range = window.innerHeight * 0.5 + bounds.height * 0.5
      const factor =
        range > 0
          ? Math.max(
              -1,
              Math.min(1, (elementCenter - viewportCenter()) / range),
            )
          : 0

      decor.querySelectorAll('.architecture-decor-layer').forEach((layer) => {
        const vmin = Number(layer.dataset.parallaxVmin ?? 2)
        layer.style.transform = `translateY(${factor * vmin}vmin)`
      })
    }

    if (!reduceMotion) {
      updateParallax()
      gsap.ticker.add(updateParallax)
    }

    return () => {
      gsap.ticker.remove(updateParallax)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`architecture-section architecture-section--project ${isVisible ? 'is-visible' : ''}`}
      id="story"
      aria-labelledby="story-title"
      style={{ '--plan-count': PLAN_COUNT }}
    >
      <div className="architecture-slide">
        <div className="architecture-gallery-pin" ref={galleryPinRef}>
          <div className="architecture-gallery-sticky" ref={galleryStickyRef}>
            <div className="architecture-gallery-row">
              <div className="architecture-gallery-copy" aria-live="polite">
                <p className="architecture-gallery-kicker">Floor plans</p>
                <div key={activePlan.id} className="architecture-gallery-plan-text">
                  <p className="architecture-gallery-caption">{activePlan.label}</p>
                  <p className="architecture-gallery-plan-detail">{activePlan.detail}</p>
                </div>
                <div className="architecture-gallery-meta">
                  <p className="architecture-gallery-counter" aria-hidden="true">
                    <span className="architecture-gallery-counter-current">
                      {String(activePlanIndex + 1).padStart(2, '0')}
                    </span>
                    <span className="architecture-gallery-counter-sep">/</span>
                    <span className="architecture-gallery-counter-total">
                      {String(PLAN_COUNT).padStart(2, '0')}
                    </span>
                  </p>
                  <div
                    className="architecture-gallery-progress"
                    role="presentation"
                  >
                    {floorPlanGallery.map((plan, index) => (
                      <span
                        key={plan.id}
                        className={`architecture-gallery-progress-dot${
                          index === activePlanIndex ? ' is-active' : ''
                        }${index < activePlanIndex ? ' is-done' : ''}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="architecture-gallery-right">
                <div className="architecture-gallery-frame">
                  <div className="architecture-gallery-stack" aria-label="Floor plans">
                    {floorPlanGallery.map((plan, index) => (
                      <div
                        key={plan.id}
                        className="architecture-gallery-stack-item"
                        aria-hidden={index !== activePlanIndex}
                      >
                        <img
                          src={plan.src}
                          alt={plan.alt}
                          draggable="false"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="architecture-subhead-row">
          <h2 id="story-title" className="architecture-subhead">
          Premium Materials
          </h2>
        </div>

        <div className="architecture-decor-row">
          <div className="architecture-decor">
            {decorLayers.map((layer) => (
              <DecorLayer key={layer.src} {...layer} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProjectStorySection
