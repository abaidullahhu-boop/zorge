import { useEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'
import our1 from '../../assets/images/our1.png'
import our2 from '../../assets/images/our2.png'
import our3 from '../../assets/images/our3.png'
import our4 from '../../assets/images/our4.png'
import our5 from '../../assets/images/our5.png'
import our6 from '../../assets/images/our6.png'
import our7 from '../../assets/images/our7.png'
import '../../assets/styles/AdvantagesSection.css'

const SECTION_HEADING = 'Why Choose Dayim Developer'

const ADVANTAGES = [
  {
    id: 'leadership',
    titleLines: ['Trusted', 'Leadership'],
    image: our1,
    width: 1024,
    height: 1024,
    text: 'Led by experienced leadership committed to integrity, vision, and excellence in every development.',
  },
  {
    id: 'quality',
    titleLines: ['Premium', 'Construction Quality'],
    image: our2,
    width: 1024,
    height: 1024,
    text: 'We never compromise on construction standards, craftsmanship, or attention to detail.',
  },
  {
    id: 'transparency',
    titleLines: ['Complete', 'Transparency'],
    image: our3,
    width: 1024,
    height: 1024,
    text: 'We conduct every project with honesty, transparency, and ethical business practices.',
  },
  {
    id: 'delivery',
    titleLines: ['On-Time', 'Delivery'],
    image: our4,
    width: 1024,
    height: 1024,
    text: 'We honor our promises by delivering projects on time while maintaining the highest standards of excellence.',
  },
  {
    id: 'customer',
    titleLines: ['Customer-Centric', 'Approach'],
    image: our5,
    width: 1024,
    height: 1024,
    text: 'Our clients are at the heart of every decision we make, and their trust is our greatest achievement.',
  },
  {
    id: 'modern',
    titleLines: ['Modern', 'Developments'],
    image: our6,
    width: 1024,
    height: 1024,
    text: 'We embrace modern technology, creative design, and smart solutions to shape the future of real estate.',
  },
  {
    id: 'investment',
    titleLines: ['Secure', 'Investment'],
    image: our7,
    width: 1024,
    height: 1024,
    text: 'We build lasting value through trusted developments that protect and grow our clients\' investments.',
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
    const mobileRoot = sectionRef.current?.querySelector('.advantages-mobile')
    if (!mobileRoot) return undefined

    const cards = [...mobileRoot.querySelectorAll('.advantages-mobile-card')]
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-inview', entry.isIntersecting)
        })
      },
      { threshold: 0.15 },
    )

    cards.forEach((card) => observer.observe(card))
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
            Our Core Values
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
            <div className="advantages-panel">
              <h3 className="advantages-title">{SECTION_HEADING}</h3>

              <div className="advantages-counter" aria-live="polite">
                <span ref={counterRef} className="advantages-counter-current">
                  1
                </span>
                <span className="advantages-counter-line" aria-hidden="true" />
                <span className="advantages-counter-total">{ITEM_COUNT}</span>
              </div>

              <div className="advantages-body">
                {ADVANTAGES.map((item, index) => (
                  <div
                    key={item.id}
                    className={[
                      'advantages-body-item',
                      index === activeIndex ? 'is-active' : '',
                      index === exitIndex ? 'is-exit' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    aria-hidden={index !== activeIndex}
                  >
                    <h4 className="advantages-point-title">
                      {item.titleLines.map((line) => (
                        <span key={line} className="advantages-point-title-line">
                          {line}
                        </span>
                      ))}
                    </h4>
                    <div className="advantages-intro">
                      <p>{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="advantages-mobile">
        <div className="advantages-mobile-header">
          <h3 className="advantages-title">{SECTION_HEADING}</h3>
        </div>
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
              <h4 className="advantages-point-title is-active">
                {item.titleLines.map((line) => (
                  <span key={line} className="advantages-point-title-line">
                    {line}
                  </span>
                ))}
              </h4>
              <div className="advantages-intro">
                <p>{item.text}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default AdvantagesSection
