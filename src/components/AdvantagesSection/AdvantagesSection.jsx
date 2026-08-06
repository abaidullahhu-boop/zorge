import { useEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'
import advantages1 from '../../assets/images/advantages-1.webp'
import advantages2 from '../../assets/images/advantages-2.webp'
import advantages3 from '../../assets/images/advantages-3.webp'
import advantages4 from '../../assets/images/advantages-4.webp'
import advantages5 from '../../assets/images/advantages-5.webp'
import '../../assets/styles/AdvantagesSection.css'

const ADVANTAGES = [
  {
    id: 'lobby',
    titleLines: ['Integrity'],
    image: advantages1,
    width: 720,
    height: 900,
    text: 'We conduct every project with honesty, transparency, and ethical business practices.',
  },
  {
    id: 'concierge',
    titleLines: ['Quality', 'Excellence'],
    image: advantages2,
    width: 720,
    height: 780,
    text: 'We never compromise on construction standards, craftsmanship, or attention to detail.',
  },
  {
    id: 'community',
    titleLines: ['Customer', 'First'],
    image: advantages3,
    width: 720,
    height: 780,
    text: 'Our clients are at the heart of every decision we make, and their trust is our greatest achievement.',
  },
  {
    id: 'coworking',
    titleLines: ['Innovation'],
    image: advantages4,
    width: 720,
    height: 900,
    text: 'We embrace modern technology, creative design, and smart solutions to shape the future of real estate.',
  },
  {
    id: 'courtyard',
    titleLines: ['Commitment'],
    image: advantages5,
    width: 720,
    height: 900,
    text: 'We honor our promises by delivering projects on time while maintaining the highest standards of excellence.',
  },
]

const ITEM_COUNT = ADVANTAGES.length
const CLIP_HIDDEN = 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)'
const CLIP_VISIBLE = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'

function AdvantagesSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [exitIndex, setExitIndex] = useState(null)
  const [textDirection, setTextDirection] = useState('forward')
  const sectionRef = useRef(null)
  const slideRef = useRef(null)
  const imageLayerRef = useRef(null)
  const counterRef = useRef(null)
  const activeIndexRef = useRef(0)
  const exitTimerRef = useRef(0)
  const setActiveFromScrollRef = useRef(null)

  setActiveFromScrollRef.current = (nextIndex) => {
    const prevIndex = activeIndexRef.current
    if (nextIndex === prevIndex) return

    window.clearTimeout(exitTimerRef.current)
    setTextDirection(nextIndex > prevIndex ? 'forward' : 'backward')
    setExitIndex(prevIndex)
    activeIndexRef.current = nextIndex
    setActiveIndex(nextIndex)

    exitTimerRef.current = window.setTimeout(() => {
      setExitIndex(null)
    }, 500)
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
    return () => window.clearTimeout(exitTimerRef.current)
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
      const images = [...slide.querySelectorAll('.advantages-image-item')]

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

      // Images scrub with scroll. Titles/copy stay on CSS via `.is-active`
      // so ScrollTrigger refresh can't wipe their visibility.
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
            if (counterRef.current) {
              counterRef.current.textContent = String(nextIndex + 1)
            }
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
          tl.to(
            prevImage,
            { y: '-8svh', duration: 1 },
            position,
          )
        }
      }
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`advantages-section ${isVisible ? 'is-visible' : ''}`}
      id="advantages"
      aria-labelledby="advantages-title"
      style={{ '--item-count': ITEM_COUNT }}
    >
      <div className="advantages-sticky">
        <div className="advantages-slide" ref={slideRef}>
          <h2 id="advantages-title" className="advantages-sr-only">
            Advantages
          </h2>

          <div className="advantages-image" ref={imageLayerRef}>
            {ADVANTAGES.map((item, index) => (
              <div
                key={item.id}
                className="advantages-image-item"
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

          <div className="advantages-content" data-text-direction={textDirection}>
            <div className="advantages-counter" aria-live="polite">
              <span ref={counterRef} className="advantages-counter-current">
                1
              </span>
              <span className="advantages-counter-line" aria-hidden="true" />
              <span className="advantages-counter-total">{ITEM_COUNT}</span>
            </div>

            <div className="advantages-head">
              {ADVANTAGES.map((item, index) => (
                <p
                  key={item.id}
                  className={[
                    'advantages-heading',
                    index === activeIndex ? 'is-active' : '',
                    index === exitIndex ? 'is-exit' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-hidden={index !== activeIndex}
                >
                  {item.titleLines.map((line) => (
                    <span key={line} className="advantages-heading-line">
                      {line}
                    </span>
                  ))}
                </p>
              ))}
            </div>

            <div className="advantages-text">
              {ADVANTAGES.map((item, index) => (
                <div
                  key={item.id}
                  className={[
                    'advantages-text-item',
                    index === activeIndex ? 'is-active' : '',
                    index === exitIndex ? 'is-exit' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-hidden={index !== activeIndex}
                >
                  <span className="advantages-text-offset" aria-hidden="true" />
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="advantages-mobile">
        {ADVANTAGES.map((item, index) => (
          <article key={item.id} className="advantages-mobile-card">
            <div className="advantages-mobile-image">
              <img
                src={item.image}
                alt=""
                width={item.width}
                height={item.height}
                draggable="false"
                loading="lazy"
              />
            </div>
            <div className="advantages-mobile-content">
              <div className="advantages-counter">
                <span className="advantages-counter-current">{index + 1}</span>
                <span className="advantages-counter-line" />
                <span className="advantages-counter-total">{ITEM_COUNT}</span>
              </div>
              <p className="advantages-heading is-active">
                {item.titleLines.map((line) => (
                  <span key={line} className="advantages-heading-line">
                    {line}
                  </span>
                ))}
              </p>
              <p className="advantages-mobile-copy">{item.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default AdvantagesSection
