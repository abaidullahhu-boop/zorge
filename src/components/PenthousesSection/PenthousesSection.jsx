import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import penthousesHero from '../../assets/images/penthouses-hero.webp'
import penthouses1 from '../../assets/images/penthouses-1.webp'
import penthouses2 from '../../assets/images/penthouses-2.webp'
import penthouses3 from '../../assets/images/penthouses-3.webp'
import penthouses4 from '../../assets/images/penthouses-4.webp'
import '../../assets/styles/PenthousesSection.css'

function ParallaxImage({ src, width, height, intensity = 12, className = '' }) {
  return (
    <div className={`penthouses-parallax ${className}`.trim()}>
      <img
        className="penthouses-parallax-image"
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

function PenthousesSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)
  const heroSlideRef = useRef(null)
  const heroImageRef = useRef(null)
  const heroContentRef = useRef(null)
  const bodyRef = useRef(null)

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
    const section = sectionRef.current
    const heroSlide = heroSlideRef.current
    const heroImage = heroImageRef.current
    const heroContent = heroContentRef.current
    const body = bodyRef.current
    if (!section || !heroSlide) return undefined

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(heroSlide, { y: 0, clearProps: 'transform' })
      gsap.set([heroImage, heroContent, body].filter(Boolean), {
        clearProps: 'transform,opacity',
      })
      return undefined
    }

    const ctx = gsap.context(() => {
      // Mobile/tablet: no entrance lift — the y-offset left a transparent gap
      // where sticky About peeked through (Services is not pinned ≤760).
      // Desktop keeps the lift; Services handoff covers the gap there.
      ScrollTrigger.matchMedia({
        '(max-width: 1024px)': () => {
          gsap.set(heroSlide, { y: 0, clearProps: 'transform' })
        },
        '(min-width: 1025px)': () => {
          const getLift = () => Math.min(window.innerHeight * 0.2, 180)

          gsap.fromTo(
            heroSlide,
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
      })

      if (heroImage) {
        gsap.fromTo(
          heroImage,
          { y: '0svh', force3D: true },
          {
            y: '-10svh',
            ease: 'none',
            force3D: true,
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        )
      }

      if (heroContent) {
        gsap.fromTo(
          heroContent,
          { y: '10svh', force3D: true },
          {
            y: '-10svh',
            ease: 'none',
            force3D: true,
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        )
      }
    }, section)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }

    const viewportCenter = () => window.innerHeight / 2

    const updateParallax = () => {
      section
        .querySelectorAll('.penthouses-parallax-image')
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
            '--penthouses-parallax',
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
      className={`penthouses-section ${isVisible ? 'is-visible' : ''}`}
      id="penthouses"
      aria-labelledby="penthouses-title"
    >
      <div className="penthouses-hero-track">
        <div className="penthouses-hero-sticky">
          <div className="penthouses-hero-slide" ref={heroSlideRef}>
            <picture className="penthouses-hero-image" ref={heroImageRef}>
              <img
                src={penthousesHero}
                alt=""
                width="2016"
                height="1092"
                draggable="false"
              />
            </picture>

            <div className="penthouses-hero-content" ref={heroContentRef}>
              <h2 id="penthouses-title" className="penthouses-hero-title">
                <span className="penthouses-hero-title-line">PENTHOUSES</span>
                <span className="penthouses-hero-title-line">
                  WITH GLASS ROOFS
                </span>
              </h2>

              <div className="penthouses-hero-copy-row">
                <p className="penthouses-hero-copy">
                  Climb to the top, gaze at the sky that has become much closer,
                  and take your place among the stars. Penthouse owners have
                  access to all dimensions: the height of the horizon, the width
                  of the panorama, and the length of the admiring gaze.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="penthouses-body" ref={bodyRef}>
        <div className="penthouses-feature">
          <div className="penthouses-feature-image">
            <ParallaxImage
              src={penthouses1}
              width={1512}
              height={1008}
              intensity={14}
            />
          </div>

          <div className="penthouses-lead-row">
            <p className="penthouses-lead">
              <span className="penthouses-lead-offset" aria-hidden="true" />
              SUNBEAMS LIGHT UP THE TRANSPARENT WINDOWS ABOVE YOUR HEAD AND
              REFLECT THE COLORS OF THE SUNSET. With high ceilings and elegant
              decor, penthouses give you the feeling of flying over the luxurious
              landscape of your own life.
            </p>
          </div>
        </div>

        <div className="penthouses-cards">
          <div className="penthouses-card penthouses-card--ceilings">
            <ParallaxImage
              src={penthouses2}
              width={630}
              height={952}
              intensity={10}
            />
            <div className="penthouses-card-content">
              <p className="penthouses-card-value">4.2 m</p>
              <p className="penthouses-card-label">ceilings height</p>
            </div>
          </div>

          <div className="penthouses-card penthouses-card--windows">
            <ParallaxImage
              src={penthouses3}
              width={690}
              height={900}
              intensity={10}
            />
            <div className="penthouses-card-content">
              <p className="penthouses-card-value">3.6 m</p>
              <p className="penthouses-card-label">window height</p>
            </div>
          </div>
        </div>

        <div className="penthouses-terrace">
          <p className="penthouses-terrace-title penthouses-terrace-title--mobile">
            private
            <br />
            Terraces
          </p>

          <div className="penthouses-terrace-image">
            <ParallaxImage
              src={penthouses4}
              width={1512}
              height={1008}
              intensity={14}
            />
          </div>

          <div className="penthouses-terrace-side">
            <p className="penthouses-terrace-title penthouses-terrace-title--desktop">
              private
              <br />
              Terraces
            </p>
            <p className="penthouses-terrace-copy">
              <span className="penthouses-terrace-offset" aria-hidden="true" />
              This is not just a place to relax, it&apos;s an extension of your
              home where you can realise your bold ideas for creating a garden,
              a space for evening gatherings or a place to enjoy peace and quiet
              under the stars.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PenthousesSection
