import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'
import dsMark from '../../assets/images/dsmark.png'
import '../../assets/styles/ArchitectureSection.css'

const CLIP_HIDDEN = 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)'
const CLIP_VISIBLE = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'

function ProjectRooftopSection({ scrollContainerRef = null, project = null }) {
  const rooftop = project?.story?.rooftop
  const gallery = useMemo(() => rooftop?.images ?? [], [rooftop])
  const planCount = gallery.length
  const [isVisible, setIsVisible] = useState(false)
  const [activePlanIndex, setActivePlanIndex] = useState(0)
  const sectionRef = useRef(null)
  const galleryPinRef = useRef(null)
  const galleryStickyRef = useRef(null)
  const activeIndexRef = useRef(0)
  const setActiveFromScrollRef = useRef(null)
  const activePlan = gallery[activePlanIndex] ?? gallery[0]

  setActiveFromScrollRef.current = (nextIndex) => {
    if (nextIndex === activeIndexRef.current) return
    activeIndexRef.current = nextIndex
    setActivePlanIndex(nextIndex)
  }

  useEffect(() => {
    setActivePlanIndex(0)
    activeIndexRef.current = 0
  }, [project?.id])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const pin = galleryPinRef.current
    const sticky = galleryStickyRef.current
    if (!pin || !sticky || planCount < 1) return undefined

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const images = [
      ...sticky.querySelectorAll('.architecture-gallery-stack-item'),
    ]

    if (reduceMotion || images.length < 2) {
      images.forEach((image, index) => {
        gsap.set(image, {
          zIndex: index === 0 ? 1 : 0,
          clipPath: index === 0 ? CLIP_VISIBLE : CLIP_HIDDEN,
          y: 0,
          clearProps: reduceMotion ? 'transform,clipPath' : undefined,
        })
      })
      return undefined
    }

    const scroller = scrollContainerRef?.current ?? undefined
    const scrollTriggerBase = scroller ? { scroller } : {}
    const segments = planCount - 1

    const ctx = gsap.context(() => {
      images.forEach((image, index) => {
        gsap.set(image, {
          zIndex: index === 0 ? 1 : 0,
          clipPath: index === 0 ? CLIP_VISIBLE : CLIP_HIDDEN,
          y: 0,
        })
      })

      const getStickyH = () => sticky.offsetHeight || window.innerHeight

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          ...scrollTriggerBase,
          trigger: pin,
          start: 'top top',
          end: () => `+=${getStickyH() * segments}`,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const raw = self.progress * segments
            const base = Math.min(planCount - 1, Math.floor(raw))
            const local = raw - Math.floor(raw)
            const nextIndex =
              raw >= segments
                ? planCount - 1
                : local >= 0.5
                  ? Math.min(planCount - 1, base + 1)
                  : base
            setActiveFromScrollRef.current?.(nextIndex)
          },
        },
      })

      for (let i = 0; i < segments; i += 1) {
        const next = i + 1
        const nextImage = images[next]

        if (nextImage) {
          gsap.set(nextImage, { zIndex: next + 1 })
          tl.fromTo(
            nextImage,
            { clipPath: CLIP_HIDDEN },
            { clipPath: CLIP_VISIBLE, duration: 1 },
            i,
          )
        }
      }
    }, pin)

    return () => ctx.revert()
  }, [scrollContainerRef, planCount, project?.id])

  if (!planCount) return null

  const kicker = rooftop?.kicker ?? 'Rooftop Garden'

  return (
    <section
      ref={sectionRef}
      className={`architecture-section architecture-section--project architecture-section--rooftop ${isVisible ? 'is-visible' : ''}`}
      id="rooftop"
      aria-labelledby="rooftop-title"
      style={{ '--plan-count': planCount }}
    >
      <div className="architecture-slide">
        <div className="architecture-gallery-pin" ref={galleryPinRef}>
          <div className="architecture-gallery-sticky" ref={galleryStickyRef}>
            <img
              className="architecture-section__mark"
              src={project?.mark ?? dsMark}
              alt=""
              aria-hidden="true"
              draggable="false"
            />
            <div className="architecture-gallery-row">
              <div className="architecture-gallery-copy" aria-live="polite">
                <p className="architecture-gallery-kicker">{kicker}</p>
                <h2 id="rooftop-title" className="architecture-sr-only">
                  {kicker}
                </h2>
                <div key={activePlan.id} className="architecture-gallery-plan-text">
                  <p className="architecture-gallery-caption">{activePlan.label}</p>
                  <p className="architecture-gallery-plan-detail">
                    {activePlan.detail}
                  </p>
                </div>
                <div className="architecture-gallery-meta">
                  <p className="architecture-gallery-counter" aria-hidden="true">
                    <span className="architecture-gallery-counter-current">
                      {String(activePlanIndex + 1).padStart(2, '0')}
                    </span>
                    <span className="architecture-gallery-counter-sep">/</span>
                    <span className="architecture-gallery-counter-total">
                      {String(planCount).padStart(2, '0')}
                    </span>
                  </p>
                  <div
                    className="architecture-gallery-progress"
                    role="presentation"
                  >
                    {gallery.map((plan, index) => (
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
                <div className="architecture-gallery-frame architecture-gallery-frame--media">
                  <div
                    className="architecture-gallery-stack"
                    aria-label={kicker}
                  >
                    {gallery.map((plan, index) => (
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
      </div>
    </section>
  )
}

export default ProjectRooftopSection
