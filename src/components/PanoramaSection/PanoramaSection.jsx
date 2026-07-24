import { useEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'
import '../../assets/styles/PanoramaSection.css'

const panoramaImageDesktop =
  'https://zorge9.estate/media/cache/homepage_panorama_bg_xxxl/uploads/39/page_7_1_11_1_1777564172.webp'
const panoramaImageMobile =
  'https://zorge9.estate/media/cache/homepage_panorama_bg_xs/uploads/39/page_7_1_11_1_1_1777564634.webp'

function PanoramaSection() {
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
      { threshold: 0.18 },
    )

    observer.observe(section)
    return () => observer.disconnect()
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
      // Climb slightly over the map while the page keeps scrolling normally.
      // Light scrub lag avoids Lenis↔transform vibration on the map→panorama handoff.
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
            scrub: 0.45,
            invalidateOnRefresh: true,
          },
        },
      )
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`panorama-section ${isVisible ? 'is-visible' : ''}`}
      id="panorama"
      aria-labelledby="panorama-title"
    >
      <div className="panorama-sticky" ref={slideRef}>
        <picture>
          <source
            media="(min-width: 761px)"
            srcSet={panoramaImageDesktop}
          />
          <img
            className="panorama-image"
            src={panoramaImageMobile}
            alt=""
            width={360}
            height={790}
            draggable="false"
          />
        </picture>
        <div className="panorama-shade" aria-hidden="true" />

        <div className="panorama-content">
          <hr className="panorama-rule" />

          <h2 id="panorama-title" className="panorama-kicker">
            It&apos;s a world that
            <br />
            adapts to you
          </h2>

          <p className="panorama-copy">
            It is not just a trio of luxurious buildings and the premium service
            of a grand hotel. It is a home where reality plays by your rules and
            follows your desires.
          </p>
        </div>
      </div>
    </section>
  )
}

export default PanoramaSection
