import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import improvement1 from '../../assets/images/improvement-1.webp'
import improvement2 from '../../assets/images/improvement-2.webp'
import improvement3 from '../../assets/images/improvement-3.webp'
import '../../assets/styles/ImprovementSection.css'

function ParallaxImage({ src, width, height, intensity = 10, className = '' }) {
  return (
    <div className={`improvement-parallax ${className}`.trim()}>
      <img
        className="improvement-parallax-image"
        data-parallax-intensity={intensity}
        src={src}
        alt=""
        width={width}
        height={height}
        draggable="false"
        loading="lazy"
      />
    </div>
  )
}

function ImprovementSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)
  const slideRef = useRef(null)

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
      // Mobile only: soft settle. Desktop slides over pinned Restaurant.
      ScrollTrigger.matchMedia({
        '(max-width: 760px)': () => {
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
        },
        '(min-width: 761px)': () => {
          gsap.set(slide, { y: 0, clearProps: 'transform' })
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (reduceMotion) return undefined

    const viewportCenter = () => window.innerHeight / 2

    const updateParallax = () => {
      section
        .querySelectorAll('.improvement-parallax-image')
        .forEach((imageEl) => {
          const bounds = imageEl.getBoundingClientRect()
          const elementCenter = bounds.top + bounds.height / 2
          const distance = elementCenter - viewportCenter()
          const progress = Math.max(
            -1,
            Math.min(1, distance / window.innerHeight),
          )
          const intensity = imageEl.dataset.parallaxIntensity ?? 12

          imageEl.style.setProperty(
            '--improvement-parallax',
            `${progress * -intensity}%`,
          )
        })
    }

    updateParallax()
    gsap.ticker.add(updateParallax)

    return () => {
      gsap.ticker.remove(updateParallax)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`improvement-section ${isVisible ? 'is-visible' : ''}`}
      id="improvement"
      aria-labelledby="improvement-title"
    >
      <div className="improvement-slide" ref={slideRef}>
        <div className="improvement-intro-row">
          <p className="improvement-intro">
            Property is more than an asset—it is a long-term decision. Dayim
            Signature Apartments provides an opportunity for investors to enter
            the high-rise residential market through a professionally planned
            development.
          </p>
        </div>

        <div className="improvement-title-row">
          <h2 id="improvement-title" className="improvement-title">
            <span className="improvement-title-line">INVESTMENT</span>
            <span className="improvement-title-line">OPPORTUNITY</span>
          </h2>
        </div>

        <div className="improvement-media-row">
          <div className="improvement-image improvement-image--1">
            <ParallaxImage
              src={improvement1}
              width={490}
              height={588}
              intensity={10}
            />
          </div>

          <div className="improvement-image improvement-image--2">
            <ParallaxImage
              src={improvement2}
              width={966}
              height={1008}
              intensity={10}
            />
          </div>
        </div>

        <div className="improvement-copy-row">
          <p className="improvement-copy">
            <span className="improvement-copy-offset" aria-hidden="true" />
            Whether your goal is future appreciation, rental potential, or a
            permanent residence, the project offers a compelling combination of
            lifestyle and investment value. Every investment is a step toward a
            more secure future.
          </p>
        </div>

        <div className="improvement-bottom">
          <ParallaxImage
            src={improvement3}
            width={1932}
            height={1274}
            intensity={14}
            className="improvement-parallax--wide"
          />
        </div>
      </div>
    </section>
  )
}

export default ImprovementSection
