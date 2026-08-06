import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'
import time1 from '../../assets/images/time-1.webp'
import time2 from '../../assets/images/time-2.webp'
import time3 from '../../assets/images/time-3.webp'
import time4 from '../../assets/images/time-4.webp'
import time5 from '../../assets/images/time-5.webp'
import '../../assets/styles/TimeSection.css'

const SCHEDULE = [
  {
    id: 'time-1',
    time: '07:00',
    hourDegree: -150,
    image: time1,
    text: 'Today, with multiple successful projects underway, we continue to build spaces that combine modern design, premium construction, and customer-focused planning.',
  },
  {
    id: 'time-2',
    time: '08:00',
    hourDegree: -120,
    image: time2,
    text: 'Every development reflects our commitment to trust, excellence, and sustainable growth. At Dayim Developers, we don\'t just build properties—we build confidence, opportunities, and a better future for generations to come.',
  },
  {
    id: 'time-3',
    time: '11:00',
    hourDegree: -30,
    image: time3,
    text: 'Driven by excellence, integrity, and forward-thinking leadership, we are committed to transforming Pakistan\'s real estate landscape through world-class developments, smart infrastructure, and uncompromising construction standards.',
  },
  {
    id: 'time-4',
    time: '14:00',
    hourDegree: 60,
    image: time4,
    text: 'As we continue to grow, our vision remains clear: to become a trusted name in real estate development, recognized for creating exceptional spaces where people can live, invest, and thrive.',
  },
  {
    id: 'time-5',
    time: '21:00',
    hourDegree: 270,
    image: time5,
    text: 'Through every project, we strive to create lasting value for our customers, investors, employees, and the communities we serve.',
  },
]

function ArrowIcon({ direction }) {
  const isLeft = direction === 'left'
  return (
    <svg
      className={`time-arrow-icon time-arrow-icon--${direction}`}
      width="41"
      height="14"
      viewBox="0 0 41 14"
      aria-hidden="true"
    >
      <path
        className="time-arrow-icon__line"
        pathLength="100"
        d={isLeft ? 'M41 7H8' : 'M1 7H33'}
      />
      <path
        className="time-arrow-icon__head"
        pathLength="100"
        d={
          isLeft
            ? 'M1 7L8 1M1 7L8 13'
            : 'M40 7L33 1M40 7L33 13'
        }
      />
    </svg>
  )
}

function TimeSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const sectionRef = useRef(null)
  const slideRef = useRef(null)
  const imageLayerRef = useRef(null)
  const digitRefs = useRef([])
  const textRefs = useRef([])
  const activeIndexRef = useRef(0)
  const animatingRef = useRef(false)

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
      { threshold: 0.18 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const images = imageLayerRef.current?.querySelectorAll('.time-image-item')
    images?.forEach((el, index) => {
      gsap.set(el, {
        clipPath: index === 0 ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)',
      })
    })
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    const slide = slideRef.current
    if (!section || !slide) return undefined

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(slide, { y: 0, clearProps: 'transform' })
      return undefined
    }

    const ctx = gsap.context(() => {
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

  const goTo = useCallback((nextIndex) => {
    if (animatingRef.current) return
    if (nextIndex < 0 || nextIndex >= SCHEDULE.length) return
    if (nextIndex === activeIndexRef.current) return

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const prevIndex = activeIndexRef.current
    const direction = nextIndex > prevIndex ? 1 : -1

    animatingRef.current = true
    setIsAnimating(true)
    activeIndexRef.current = nextIndex
    setActiveIndex(nextIndex)

    const images = imageLayerRef.current?.querySelectorAll('.time-image-item')
    const prevImage = images?.[prevIndex]
    const nextImage = images?.[nextIndex]
    const prevDigit = digitRefs.current[prevIndex]
    const nextDigit = digitRefs.current[nextIndex]
    const prevText = textRefs.current[prevIndex]
    const nextText = textRefs.current[nextIndex]

    if (reduceMotion) {
      gsap.set(prevImage, { clipPath: 'inset(100% 0 0 0)' })
      gsap.set(nextImage, { clipPath: 'inset(0 0 0 0)' })
      gsap.set([prevDigit, prevText].filter(Boolean), { opacity: 0, y: 0, yPercent: 0 })
      gsap.set([nextDigit, nextText].filter(Boolean), { opacity: 1, y: 0, yPercent: 0 })
      animatingRef.current = false
      setIsAnimating(false)
      return
    }

    const hideClip =
      direction > 0 ? 'inset(0 0 100% 0)' : 'inset(100% 0 0 0)'
    const showFromClip =
      direction > 0 ? 'inset(100% 0 0 0)' : 'inset(0 0 100% 0)'

    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      onComplete: () => {
        animatingRef.current = false
        setIsAnimating(false)
      },
    })

    if (prevDigit && nextDigit) {
      tl.to(
        prevDigit,
        {
          yPercent: -30 * direction,
          opacity: 0,
          duration: 0.55,
        },
        0,
      )
      tl.fromTo(
        nextDigit,
        { yPercent: 40 * direction, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.65 },
        0.12,
      )
    }

    if (prevText && nextText) {
      tl.to(
        prevText,
        {
          y: -18 * direction,
          opacity: 0,
          duration: 0.45,
        },
        0,
      )
      tl.fromTo(
        nextText,
        { y: 28 * direction, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        0.15,
      )
    }

    if (prevImage && nextImage) {
      gsap.set(nextImage, { zIndex: 2 })
      gsap.set(prevImage, { zIndex: 1 })
      tl.to(
        prevImage,
        {
          clipPath: hideClip,
          duration: 1.1,
        },
        0,
      )
      tl.fromTo(
        nextImage,
        { clipPath: showFromClip },
        { clipPath: 'inset(0 0 0 0)', duration: 1.1 },
        0,
      )
      tl.set(prevImage, { zIndex: 0 })
      tl.set(nextImage, { zIndex: 1 })
    }
  }, [])

  const goPrev = useCallback(() => {
    goTo(activeIndexRef.current - 1)
  }, [goTo])

  const goNext = useCallback(() => {
    goTo(activeIndexRef.current + 1)
  }, [goTo])

  const active = SCHEDULE[activeIndex]
  const canPrev = activeIndex > 0
  const canNext = activeIndex < SCHEDULE.length - 1

  return (
    <section
      ref={sectionRef}
      className={`time-section ${isVisible ? 'is-visible' : ''}`}
      id="daily-schedule"
      aria-labelledby="time-title"
    >
      <div className="time-sticky">
        <div className="time-slide" ref={slideRef}>
          <h2 id="time-title" className="time-sr-only">
            Daily schedule
          </h2>

          <div className="time-image" ref={imageLayerRef}>
            {SCHEDULE.map((item, index) => (
              <div
                key={item.id}
                className="time-image-item"
                aria-hidden={index !== activeIndex}
              >
                <img
                  src={item.image}
                  alt=""
                  width="720"
                  height="900"
                  draggable="false"
                />
              </div>
            ))}
          </div>

          <div className="time-content">
            <div
              className="time-clock"
              style={{ '--hour-degree': active.hourDegree }}
              aria-hidden="true"
            >
              <span className="time-clock-hour" />
              <span className="time-clock-minute" />
            </div>

            <div className="time-digits" aria-live="polite">
              {SCHEDULE.map((item, index) => (
                <div
                  key={item.id}
                  ref={(el) => {
                    digitRefs.current[index] = el
                  }}
                  className={[
                    'time-digit',
                    index === activeIndex ? 'is-active' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-hidden={index !== activeIndex}
                >
                  <p className="time-digit-text">{item.time}</p>
                </div>
              ))}
            </div>

            <div className="time-controls">
              <button
                type="button"
                className={[
                  'time-nav',
                  'time-nav--prev',
                  !canPrev || isAnimating ? 'is-disabled' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-label="Previous item"
                disabled={!canPrev || isAnimating}
                onClick={goPrev}
              >
                <span className="time-nav-icon">
                  <ArrowIcon direction="left" />
                </span>
              </button>
              <button
                type="button"
                className={[
                  'time-nav',
                  'time-nav--next',
                  !canNext || isAnimating ? 'is-disabled' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-label="Next item"
                disabled={!canNext || isAnimating}
                onClick={goNext}
              >
                <span className="time-nav-icon">
                  <ArrowIcon direction="right" />
                </span>
              </button>
            </div>

            <div className="time-text">
              {SCHEDULE.map((item, index) => (
                <div
                  key={item.id}
                  ref={(el) => {
                    textRefs.current[index] = el
                  }}
                  className={[
                    'time-text-item',
                    index === activeIndex ? 'is-active' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-hidden={index !== activeIndex}
                >
                  <span className="time-text-offset" aria-hidden="true" />
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TimeSection
