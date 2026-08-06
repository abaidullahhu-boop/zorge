import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import infrastructureHero from '../../assets/images/infrastructure-hero.webp'
import infrastructure1 from '../../assets/images/infrastructure-1.webp'
import infrastructure2 from '../../assets/images/infrastructure-2.webp'
import infrastructure3 from '../../assets/images/infrastructure-3.webp'
import '../../assets/styles/InfrastructureSection.css'

const ITEMS = [
  {
    id: 'restaurant',
    titleLines: ['Premium Construction', 'Quality'],
    image: infrastructure1,
    width: 924,
    height: 728,
    text: 'We build with precision, using high-quality materials and modern engineering standards to ensure lasting value.',
  },
  {
    id: 'beauty',
    titleLines: ['Complete', 'Transparency'],
    image: infrastructure2,
    width: 924,
    height: 728,
    text: 'Every investment is backed by honest communication, clear processes, and ethical business practices.',
  },
  {
    id: 'spa',
    titleLines: ['On-Time', 'Delivery'],
    image: infrastructure3,
    width: 924,
    height: 728,
    text: 'We understand the value of time and remain committed to delivering projects as promised.',
  },
]

const ITEM_COUNT = ITEMS.length
const SLIDE_DURATION_S = 2.75
const SLIDE_DURATION_MS = SLIDE_DURATION_S * 1000

function ArrowIcon({ direction }) {
  const isLeft = direction === 'left'
  return (
    <span
      className={`infra-arrow ${isLeft ? 'infra-arrow--left' : 'infra-arrow--right'}`}
      aria-hidden="true"
    >
      <span className="infra-arrow__line" />
      <span className="infra-arrow__head">
        <span className="infra-arrow__arm infra-arrow__arm--top" />
        <span className="infra-arrow__arm infra-arrow__arm--bottom" />
      </span>
    </span>
  )
}

function InfrastructureSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [exitIndex, setExitIndex] = useState(null)
  const [textDirection, setTextDirection] = useState('forward')
  const [isAnimating, setIsAnimating] = useState(false)
  const sectionRef = useRef(null)
  const heroRef = useRef(null)
  const heroStickyRef = useRef(null)
  const heroTrackRef = useRef(null)
  const panelSlideRef = useRef(null)
  const imageLayerRef = useRef(null)
  const counterRef = useRef(null)
  const activeIndexRef = useRef(0)
  const animatingRef = useRef(false)
  const exitTimerRef = useRef(0)

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
    const hero = heroRef.current
    const sticky = heroStickyRef.current
    const track = heroTrackRef.current
    const panelSlide = panelSlideRef.current
    if (!section || !hero || !sticky || !track) return undefined

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(track, { x: 0, clearProps: 'transform' })
        if (panelSlide) gsap.set(panelSlide, { clearProps: 'transform' })
        const panelSticky = panelSlide?.closest('.infrastructure-panel-sticky')
        if (panelSticky) gsap.set(panelSticky, { clipPath: 'inset(0% 0% 0% 0%)' })
        return
      }

      // Desktop: Fitness-style sticky horizontal pan across the streetscape.
      // Mobile: keep a light vertical settle — no horizontal scrub.
      ScrollTrigger.matchMedia({
        '(max-width: 760px)': () => {
          gsap.set(track, { x: 0, clearProps: 'transform' })
          hero.style.removeProperty('--infra-hero-scroll')

          gsap.fromTo(
            sticky,
            { y: () => Math.min(window.innerHeight * 0.2, 180), force3D: true },
            {
              y: 0,
              ease: 'none',
              force3D: true,
              scrollTrigger: {
                trigger: hero,
                start: 'top bottom',
                end: 'top top',
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          )
        },
        '(min-width: 761px)': () => {
          // Desktop hero pans inside FitnessSection's horizontal track.
          gsap.set(track, { x: 0, clearProps: 'transform' })
          gsap.set(sticky, { y: 0, clearProps: 'transform' })
          hero.style.removeProperty('--infra-hero-scroll')
        },
      })

      if (panelSlide) {
        const panel = panelSlide.closest('.infrastructure-panel')
        const panelSticky = panelSlide.closest('.infrastructure-panel-sticky')
        const panelImage = panelSlide.querySelector('.infrastructure-image')

        // Desktop: Restaurant grows over the pinned Infrastructure hero —
        // clip opens so visible height increases as you scroll. No vertical
        // settle on the hero card (it must stay stuck, not scroll top→bottom).
        if (panelSticky && panel) {
          ScrollTrigger.matchMedia({
            '(min-width: 761px)': () => {
              gsap.set(panelSlide, { y: 0, clearProps: 'transform' })

              gsap.fromTo(
                panelSticky,
                { clipPath: 'inset(100% 0 0 0)' },
                {
                  clipPath: 'inset(0% 0% 0% 0%)',
                  ease: 'none',
                  scrollTrigger: {
                    trigger: panel,
                    start: 'top top',
                    end: () => `+=${window.innerHeight}`,
                    scrub: true,
                    invalidateOnRefresh: true,
                  },
                },
              )

              // While Improvement slides over Restaurant, drift the whole
              // panel upward slowly and fade it out (pinned shell stays).
              const improvement = document.querySelector('.improvement-section')
              if (improvement) {
                gsap.fromTo(
                  panelSlide,
                  { y: '0svh', opacity: 1, force3D: true },
                  {
                    y: '-10svh',
                    opacity: 0.2,
                    ease: 'none',
                    force3D: true,
                    scrollTrigger: {
                      trigger: improvement,
                      start: 'top bottom',
                      end: 'top top',
                      scrub: true,
                      invalidateOnRefresh: true,
                    },
                  },
                )

                if (panelImage) {
                  gsap.fromTo(
                    panelImage,
                    { y: '0svh', force3D: true },
                    {
                      y: '-4svh',
                      ease: 'none',
                      force3D: true,
                      scrollTrigger: {
                        trigger: improvement,
                        start: 'top bottom',
                        end: 'top top',
                        scrub: true,
                        invalidateOnRefresh: true,
                      },
                    },
                  )
                }
              }
            },
            '(max-width: 760px)': () => {
              gsap.set(panelSticky, { clearProps: 'clipPath' })
              if (panelImage) gsap.set(panelImage, { clearProps: 'transform' })

              gsap.fromTo(
                panelSlide,
                { y: '10svh', force3D: true },
                {
                  y: 0,
                  ease: 'none',
                  force3D: true,
                  scrollTrigger: {
                    trigger: panel,
                    start: 'top bottom',
                    end: 'top top',
                    scrub: true,
                    invalidateOnRefresh: true,
                  },
                },
              )
            },
          })
        }
      }
    }, section)

    return () => ctx.revert()
  }, [])

  const goTo = useCallback((nextIndex) => {
    if (animatingRef.current) return
    if (nextIndex < 0 || nextIndex >= ITEM_COUNT) return
    if (nextIndex === activeIndexRef.current) return

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const prevIndex = activeIndexRef.current
    const direction = nextIndex > prevIndex ? 1 : -1

    animatingRef.current = true
    setIsAnimating(true)
    window.clearTimeout(exitTimerRef.current)
    setTextDirection(direction > 0 ? 'forward' : 'backward')
    setExitIndex(prevIndex)
    activeIndexRef.current = nextIndex
    setActiveIndex(nextIndex)
    if (counterRef.current) {
      counterRef.current.textContent = String(nextIndex + 1)
    }

    exitTimerRef.current = window.setTimeout(() => {
      setExitIndex(null)
    }, SLIDE_DURATION_MS)

    const images = imageLayerRef.current?.querySelectorAll(
      '.infrastructure-image-item',
    )
    const prevImage = images?.[prevIndex]
    const nextImage = images?.[nextIndex]

    if (reduceMotion) {
      gsap.set(prevImage, {
        clipPath: 'inset(0 100% 0 0)',
        zIndex: 0,
        clearProps: 'transform',
      })
      gsap.set(nextImage, {
        clipPath: 'inset(0 0 0 0)',
        zIndex: 1,
        clearProps: 'transform',
      })
      animatingRef.current = false
      setIsAnimating(false)
      return
    }

    if (!prevImage || !nextImage) {
      animatingRef.current = false
      setIsAnimating(false)
      return
    }

    // Cover: keep current image still, next slides over it from the side.
    const enterFromX = direction > 0 ? '100%' : '-100%'

    const tl = gsap.timeline({
      defaults: { ease: 'power4.inOut', duration: SLIDE_DURATION_S },
      onComplete: () => {
        animatingRef.current = false
        setIsAnimating(false)
      },
    })

    gsap.set(prevImage, {
      zIndex: 1,
      clipPath: 'inset(0 0 0 0)',
      clearProps: 'transform',
    })
    gsap.set(nextImage, {
      zIndex: 2,
      clipPath: 'inset(0 0 0 0)',
      x: enterFromX,
    })
    tl.to(nextImage, { x: '0%' }, 0)
    tl.set(prevImage, { clipPath: 'inset(0 100% 0 0)', zIndex: 0 })
    tl.set(nextImage, { zIndex: 1, clearProps: 'transform' })
  }, [])

  const goPrev = useCallback(() => {
    goTo(activeIndexRef.current - 1)
  }, [goTo])

  const goNext = useCallback(() => {
    goTo(activeIndexRef.current + 1)
  }, [goTo])

  const canPrev = activeIndex > 0
  const canNext = activeIndex < ITEM_COUNT - 1

  return (
    <section
      ref={sectionRef}
      className={`infrastructure-section ${isVisible ? 'is-visible' : ''}`}
      id="infrastructure"
      aria-labelledby="infrastructure-title"
      style={{ '--infra-slide-duration': `${SLIDE_DURATION_S}s` }}
    >
      <div className="infrastructure-hero" ref={heroRef}>
        <div className="infrastructure-hero-sticky" ref={heroStickyRef}>
          <div className="infrastructure-hero-track" ref={heroTrackRef}>
            <div className="infrastructure-hero-image">
              <img
                src={infrastructureHero}
                alt=""
                width="2016"
                height="1092"
                draggable="false"
              />
            </div>
          </div>
          <div className="infrastructure-hero-content">
            <h2 id="infrastructure-title" className="infrastructure-hero-title">
              INFRASTRUCTURE
            </h2>
          </div>
        </div>
      </div>

      <div className="infrastructure-panel">
        <div className="infrastructure-panel-sticky">
          <div className="infrastructure-panel-slide" ref={panelSlideRef}>
            <div className="infrastructure-container">
              <div className="infrastructure-image" ref={imageLayerRef}>
                <div className="infrastructure-image-frame">
                  {ITEMS.map((item, index) => (
                    <div
                      key={item.id}
                      className="infrastructure-image-item"
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
              </div>

              <div
                className="infrastructure-content"
                data-text-direction={textDirection}
              >
                <div className="infrastructure-head">
                  <p className="infrastructure-label">INFRASTRUCTURE</p>
                  <div className="infrastructure-titles">
                    {ITEMS.map((item, index) => (
                      <p
                        key={item.id}
                        className={[
                          'infrastructure-heading',
                          index === activeIndex ? 'is-active' : '',
                          index === exitIndex ? 'is-exit' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        aria-hidden={index !== activeIndex}
                      >
                        {item.titleLines.map((line) => (
                          <span
                            key={line}
                            className="infrastructure-heading-line"
                          >
                            {line}
                          </span>
                        ))}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="infrastructure-controls">
                  <p className="infrastructure-counter" aria-live="polite">
                    <span
                      ref={counterRef}
                      className="infrastructure-counter-current"
                    >
                      1
                    </span>
                    <span
                      className="infrastructure-counter-line"
                      aria-hidden="true"
                    />
                    <span className="infrastructure-counter-total">
                      {ITEM_COUNT}
                    </span>
                  </p>
                  <div className="infrastructure-nav">
                    <button
                      type="button"
                      className={[
                        'infra-nav',
                        'infra-nav--prev',
                        !canPrev || isAnimating ? 'is-disabled' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      aria-label="Previous item"
                      disabled={!canPrev || isAnimating}
                      onClick={goPrev}
                    >
                      <span className="infra-nav-icon">
                        <ArrowIcon direction="left" />
                      </span>
                    </button>
                    <button
                      type="button"
                      className={[
                        'infra-nav',
                        'infra-nav--next',
                        !canNext || isAnimating ? 'is-disabled' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      aria-label="Next item"
                      disabled={!canNext || isAnimating}
                      onClick={goNext}
                    >
                      <span className="infra-nav-icon">
                        <ArrowIcon direction="right" />
                      </span>
                    </button>
                  </div>
                </div>

                <div className="infrastructure-text">
                  {ITEMS.map((item, index) => (
                    <div
                      key={item.id}
                      className={[
                        'infrastructure-text-item',
                        index === activeIndex ? 'is-active' : '',
                        index === exitIndex ? 'is-exit' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      aria-hidden={index !== activeIndex}
                    >
                      <span
                        className="infrastructure-text-offset"
                        aria-hidden="true"
                      />
                      <p>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="infrastructure-mobile">
        {ITEMS.map((item, index) => (
          <article key={item.id} className="infrastructure-mobile-card">
            <div className="infrastructure-mobile-image">
              <img
                src={item.image}
                alt=""
                width={item.width}
                height={item.height}
                draggable="false"
                loading="lazy"
              />
            </div>
            <div className="infrastructure-mobile-content">
              <div className="infrastructure-counter">
                <span className="infrastructure-counter-current">
                  {index + 1}
                </span>
                <span className="infrastructure-counter-line" />
                <span className="infrastructure-counter-total">{ITEM_COUNT}</span>
              </div>
              <p className="infrastructure-label">INFRASTRUCTURE</p>
              <p className="infrastructure-heading is-active">
                {item.titleLines.map((line) => (
                  <span key={line} className="infrastructure-heading-line">
                    {line}
                  </span>
                ))}
              </p>
              <p className="infrastructure-mobile-copy">{item.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default InfrastructureSection
