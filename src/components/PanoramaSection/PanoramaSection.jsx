import { useEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'
import visionImage from '../../assets/images/vision2.png'
import '../../assets/styles/PanoramaSection.css'

function PanoramaSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [projectsDetailOpen, setProjectsDetailOpen] = useState(false)
  const sectionRef = useRef(null)
  const slideRef = useRef(null)

  useEffect(() => {
    const syncProjectsDetail = () => {
      setProjectsDetailOpen(
        document.documentElement.classList.contains('is-projects-detail'),
      )
    }

    syncProjectsDetail()
    const observer = new MutationObserver(syncProjectsDetail)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

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

    if (projectsDetailOpen) {
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
  }, [projectsDetailOpen])

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
            srcSet={visionImage}
          />
          <img
            className="panorama-image"
            src={visionImage}
            alt=""
            width={360}
            height={790}
            draggable="false"
          />
        </picture>
        <div className="panorama-shade" aria-hidden="true" />

        <div className="panorama-content">
          <h2 id="panorama-title" className="panorama-kicker">
            Building Trust.
            <br />
            Creating Lifestyles.
            <br />
            Shaping the Future.
          </h2>

          <hr className="panorama-rule" />

          <p className="panorama-copy">
            At Dayim Developers, our vision is to redefine the future of real
            estate by setting new benchmarks in innovation, quality, and trust.
            We aspire to create iconic developments that inspire confidence,
            enrich communities, and deliver lasting value for generations to
            come.
          </p>
        </div>
      </div>
    </section>
  )
}

export default PanoramaSection
