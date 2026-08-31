import { useEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'
import visionImage from '../../assets/images/vision2.png'
import '../../assets/styles/PanoramaSection.css'

function PanoramaSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [projectsDetailOpen, setProjectsDetailOpen] = useState(false)
  const sectionRef = useRef(null)
  const slideRef = useRef(null)
  const imageRef = useRef(null)

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
    const image = imageRef.current
    if (!section || !slide) return undefined

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(slide, { y: 0, clearProps: 'transform' })
      if (image) gsap.set(image, { scale: 1, clearProps: 'transform' })
      return undefined
    }

    if (projectsDetailOpen) {
      gsap.set(slide, { y: 0, clearProps: 'transform' })
      if (image) gsap.set(image, { scale: 1, clearProps: 'transform' })
      return undefined
    }

    const ctx = gsap.context(() => {
      const isMobile = window.matchMedia('(max-width: 980px)').matches

      // Climb slightly over the previous slide while the page scrolls normally.
      // Skip on mobile so the lift cannot cover About content.
      if (!isMobile) {
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
      } else {
        gsap.set(slide, { y: 0, clearProps: 'transform' })
      }

      if (image) {
        gsap.fromTo(
          image,
          { scale: 1.14, force3D: true },
          {
            scale: 1,
            ease: 'none',
            force3D: true,
            transformOrigin: '50% 50%',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        )
      }
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
            media="(min-width: 981px)"
            srcSet={visionImage}
          />
          <img
            ref={imageRef}
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
          <hr className="panorama-rule" />

          <div className="panorama-text mt-24">
            <h2 id="panorama-title" className="panorama-title">
              Our Vision
            </h2>

            <div className="panorama-intro mt-6 ">
              <p className="panorama-copy">
                To redefine Pakistan&apos;s real estate landscape through{' '}
                <span className="panorama-highlight">
                  innovation, quality, and trust
                </span>
                . We aim to create{' '}
                <span className="panorama-highlight">iconic developments</span>{' '}
                that enrich communities and deliver lasting value. Our focus is on
                modern lifestyles, sustainable communities, and smart investment
                opportunities. Driven by{' '}
                <span className="panorama-highlight">excellence and integrity</span>
                , we strive to set new benchmarks in design, infrastructure, and
                construction. Our vision is to become a trusted name where people
                can{' '}
                <span className="panorama-highlight">live, invest, and thrive</span>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PanoramaSection
