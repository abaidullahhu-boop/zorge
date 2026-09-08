import { useEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'
import g1 from '../../assets/images/g1.jpeg'
import g2 from '../../assets/images/g2.jpeg'
import g3 from '../../assets/images/g3.jpeg'
import g4 from '../../assets/images/g4.jpeg'
import g5 from '../../assets/images/g5.jpeg'
import '../../assets/styles/TimeSection.css'

const journeyGallery = [
  {
    id: 'g4',
    src: g4,
    alt: 'Dayim Signature Apartments foundation slab with column reinforcement cages',
    label: 'Foundation',
    detail:
      'Raft slab cast and column cages set as Dayim Signature Apartments breaks ground.',
  },
  {
    id: 'g5',
    src: g5,
    alt: 'Dayim Signature Apartments vision board beside rising structure and formwork',
    label: 'Rising',
    detail:
      'From render to reality—the first floors climb beside the finished building vision.',
  },
  {
    id: 'g3',
    src: g3,
    alt: 'Dayim Signature Apartments floor slab reinforcement and service conduits before pour',
    label: 'Slab Works',
    detail:
      'Rebar mesh and service conduits laid across the deck, ready for the next pour.',
  },
  {
    id: 'g1',
    src: g1,
    alt: 'Dayim Signature Apartments multi-storey concrete frame with early masonry',
    label: 'Structure',
    detail:
      'The full frame stands tall, with masonry underway on the lower residential floors.',
  },
  {
    id: 'g2',
    src: g2,
    alt: 'Dayim Signature Apartments exterior scaffolding during finishing works',
    label: 'Finishing',
    detail:
      'Exterior scaffolding wraps the facade as finishing works advance across Dayim Signature Apartments.',
  },
]

const PLAN_COUNT = journeyGallery.length
const CLIP_HIDDEN = 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)'
const CLIP_VISIBLE = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'

function TimeSection({ variant = 'default', scrollContainerRef = null }) {
  const isProjectVariant = variant === 'project'
  const [isVisible, setIsVisible] = useState(false)
  const [activePlanIndex, setActivePlanIndex] = useState(0)
  const sectionRef = useRef(null)
  const galleryPinRef = useRef(null)
  const galleryStickyRef = useRef(null)
  const activeIndexRef = useRef(0)
  const setActiveFromScrollRef = useRef(null)
  const activePlan = journeyGallery[activePlanIndex] ?? journeyGallery[0]

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
    const images = [...sticky.querySelectorAll('.time-gallery-stack-item')]

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

  return (
    <section
      ref={sectionRef}
      className={[
        'time-section',
        isProjectVariant ? 'time-section--project' : '',
        isVisible ? 'is-visible' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      id="daily-schedule"
      aria-labelledby="time-title"
      style={{ '--plan-count': PLAN_COUNT }}
    >
      <h2 id="time-title" className="time-sr-only">
        Construction journey
      </h2>

      <div className="time-gallery-pin" ref={galleryPinRef}>
        <div className="time-gallery-sticky" ref={galleryStickyRef}>
          <div className="time-gallery-row">
            <div className="time-gallery-copy" aria-live="polite">
              <p className="time-gallery-kicker">Journey</p>
              <div key={activePlan.id} className="time-gallery-plan-text">
                <p className="time-gallery-caption">{activePlan.label}</p>
                <p className="time-gallery-plan-detail">{activePlan.detail}</p>
              </div>
              <div className="time-gallery-meta">
                <p className="time-gallery-counter" aria-hidden="true">
                  <span className="time-gallery-counter-current">
                    {String(activePlanIndex + 1).padStart(2, '0')}
                  </span>
                  <span className="time-gallery-counter-sep">/</span>
                  <span className="time-gallery-counter-total">
                    {String(PLAN_COUNT).padStart(2, '0')}
                  </span>
                </p>
                <div className="time-gallery-progress" role="presentation">
                  {journeyGallery.map((plan, index) => (
                    <span
                      key={plan.id}
                      className={`time-gallery-progress-dot${
                        index === activePlanIndex ? ' is-active' : ''
                      }${index < activePlanIndex ? ' is-done' : ''}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="time-gallery-right">
              <div className="time-gallery-frame">
                <div
                  className="time-gallery-stack"
                  aria-label="Construction journey"
                >
                  {journeyGallery.map((plan, index) => (
                    <div
                      key={plan.id}
                      className="time-gallery-stack-item"
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
    </section>
  )
}

export default TimeSection
