import { useEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'
import services1 from '../../assets/images/services-1.webp'
import services2 from '../../assets/images/services-2.webp'
import services3 from '../../assets/images/services-3.webp'
import '../../assets/styles/ServicesSection.css'

const SERVICES = [
  {
    id: 'elevator',
    title: 'digital elevator',
    image: services1,
    width: 720,
    height: 900,
    text: 'The intelligent system can independently determine when the resident is returning home and call the lift to the correct floor.',
  },
  {
    id: 'control',
    title: 'Home control center',
    image: services2,
    width: 720,
    height: 900,
    text: 'Video cameras in the complex send data to a single control room, while the Alpha Open software platform collects and processes data on the operation of engineering communications.',
  },
  {
    id: 'bellman',
    title: 'Bellman service',
    image: services3,
    width: 720,
    height: 900,
    text: 'Take the first step into your new home with ease and confidence. We will provide professional support in arranging official registration, accompanying you at every stage.',
  },
]

const ITEM_COUNT = SERVICES.length
const CLIP_HIDDEN = 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)'
const CLIP_VISIBLE = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'

function ServicesSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRef = useRef(null)
  const slideRef = useRef(null)
  const activeIndexRef = useRef(0)
  const setActiveFromScrollRef = useRef(null)

  setActiveFromScrollRef.current = (nextIndex) => {
    if (nextIndex === activeIndexRef.current) return
    activeIndexRef.current = nextIndex
    setActiveIndex(nextIndex)
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
      { threshold: 0.12 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    const slide = slideRef.current
    if (!section || !slide) return undefined

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (reduceMotion) {
      gsap.set(slide, { y: 0, clearProps: 'transform' })
      return undefined
    }

    const ctx = gsap.context(() => {
      const getLift = () => Math.min(window.innerHeight * 0.2, 180)
      const images = [...slide.querySelectorAll('.services-image-item')]

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

      images.forEach((image, index) => {
        gsap.set(image, {
          zIndex: index === 0 ? 1 : 0,
          clipPath: index === 0 ? CLIP_VISIBLE : CLIP_HIDDEN,
          y: index === 0 ? '0svh' : '5svh',
        })
      })

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${window.innerHeight * (ITEM_COUNT - 1)}`,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const segments = ITEM_COUNT - 1
            const raw = self.progress * segments
            const base = Math.min(ITEM_COUNT - 1, Math.floor(raw))
            const local = raw - Math.floor(raw)
            const nextIndex =
              raw >= segments
                ? ITEM_COUNT - 1
                : local >= 0.5
                  ? Math.min(ITEM_COUNT - 1, base + 1)
                  : base
            setActiveFromScrollRef.current?.(nextIndex)
          },
        },
      })

      for (let i = 0; i < ITEM_COUNT - 1; i += 1) {
        const next = i + 1
        const position = i
        const prevImage = images[i]
        const nextImage = images[next]

        if (nextImage) {
          gsap.set(nextImage, { zIndex: next + 1 })
          tl.fromTo(
            nextImage,
            { clipPath: CLIP_HIDDEN, y: '5svh' },
            { clipPath: CLIP_VISIBLE, y: '0svh', duration: 1 },
            position,
          )
        }

        if (prevImage) {
          tl.to(prevImage, { y: '-8svh', duration: 1 }, position)
        }
      }
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`services-section ${isVisible ? 'is-visible' : ''}`}
      id="services"
      aria-labelledby="services-title"
      style={{ '--item-count': ITEM_COUNT }}
    >
      <div className="services-sticky">
        <div className="services-slide" ref={slideRef}>
          <h2 id="services-title" className="services-sr-only">
            Technologies and Services
          </h2>

          <div className="services-image">
            {SERVICES.map((item, index) => (
              <div
                key={item.id}
                className="services-image-item"
                aria-hidden={index !== activeIndex}
              >
                <img
                  src={item.image}
                  alt=""
                  width={item.width}
                  height={item.height}
                  draggable="false"
                />
              </div>
            ))}
          </div>

          <div className="services-right">
            <p className="services-section-title" aria-hidden="true">
              TECHNOLOGIES
              <br />
              AND SERVICES
            </p>

            <div className="services-content">
              <div
                className={`services-list${activeIndex === ITEM_COUNT - 1 ? ' is-last-active' : ''}`}
                aria-live="polite"
                style={{
                  '--active-index': activeIndex,
                  '--item-count': ITEM_COUNT,
                }}
              >
                {SERVICES.map((item, index) => (
                  <article
                    key={item.id}
                    className={`services-card${index === activeIndex ? ' is-active' : ''}`}
                  >
                    <p className="services-card-title">{item.title}</p>
                    <p className="services-card-text">{item.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="services-mobile">
        <p className="services-section-title">
          TECHNOLOGIES
          <br />
          AND SERVICES
        </p>
        {SERVICES.map((item, index) => (
          <article key={item.id} className="services-mobile-card">
            <div className="services-mobile-image">
              <img
                src={item.image}
                alt=""
                width={item.width}
                height={item.height}
                draggable="false"
                loading="lazy"
              />
            </div>
            <div className="services-mobile-content">
              <div className="services-mobile-head">
                <p className="services-mobile-title">{item.title}</p>
                <div className="services-counter">
                  <span className="services-counter-current">{index + 1}</span>
                  <span className="services-counter-line" aria-hidden="true" />
                  <span className="services-counter-total">{ITEM_COUNT}</span>
                </div>
              </div>
              <p className="services-mobile-copy">{item.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ServicesSection
