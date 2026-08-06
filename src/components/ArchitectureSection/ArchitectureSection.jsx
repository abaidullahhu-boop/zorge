import { useEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'
import heroImage from '../../assets/images/bgsection.png'
import collection1 from '../../assets/images/collection1.png'
import collection2 from '../../assets/images/collection2.png'
import collection3 from '../../assets/images/collection3.png'
import collection4 from '../../assets/images/collection4.png'
import collection5 from '../../assets/images/collection5.png'
import collection6 from '../../assets/images/collection6.png'
import collection8 from '../../assets/images/collection8.png'
import gallery1 from '../../assets/images/gallery1.png'
import gallery2 from '../../assets/images/gallery2.png'
import galleryImageLeft from '../../assets/images/architecture/image-2.webp'
import galleryImageRight from '../../assets/images/architecture/image-3.webp'
import '../../assets/styles/ArchitectureSection.css'

const decorLayers = [
  { src: collection1, vmin: 2, isBase: true, zIndex: 1 },
  { src: collection2, vmin: 4, zIndex: 2 },
  { src: collection3, vmin: 6, zIndex: 3 },
  { src: collection4, vmin: 8, zIndex: 4 },
  { src: collection8, vmin: 14, zIndex: 5 },
  { src: collection5, vmin: 10, zIndex: 6 },
  { src: collection6, vmin: 12, zIndex: 7 },
]

function DecorLayer({ src, vmin, isBase = false, zIndex }) {
  const className = [
    'architecture-decor-layer',
    isBase
      ? 'architecture-decor-layer--base'
      : 'architecture-decor-layer--cover',
  ].join(' ')

  return (
    <div
      className={className}
      data-parallax-vmin={vmin}
      style={{ zIndex }}
    >
      <img src={src} alt="" draggable="false" />
    </div>
  )
}

function BottomGalleryParallaxImage({ src, intensity = 10 }) {
  return (
    <div className="architecture-bottom-parallax-frame">
      <img
        className="architecture-parallax-image"
        data-parallax-intensity={intensity}
        src={src}
        alt=""
        draggable="false"
      />
    </div>
  )
}

function ArchitectureSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)
  const slideRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
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

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(slide, { y: 0, clearProps: 'transform' })
      return undefined
    }

    const ctx = gsap.context(() => {
      // Climb slightly over the panorama while the page keeps scrolling normally.
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

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const viewportCenter = () => window.innerHeight / 2

    const updateParallax = () => {
      const parallaxImages = section.querySelectorAll(
        '.architecture-parallax-image',
      )

      parallaxImages.forEach((imageEl) => {
        const bounds = imageEl.getBoundingClientRect()
        const elementCenter = bounds.top + bounds.height / 2
        const distance = elementCenter - viewportCenter()
        const progress = Math.max(-1, Math.min(1, distance / window.innerHeight))
        const intensity = imageEl.dataset.parallaxIntensity ?? 12

        imageEl.style.setProperty(
          '--architecture-parallax',
          `${progress * -intensity}%`,
        )
      })

      const decor = section.querySelector('.architecture-decor')
      if (decor) {
        const bounds = decor.getBoundingClientRect()
        const elementCenter = bounds.top + bounds.height / 2
        const range = window.innerHeight * 0.5 + bounds.height * 0.5
        const factor =
          range > 0
            ? Math.max(
                -1,
                Math.min(1, (elementCenter - viewportCenter()) / range),
              )
            : 0

        decor.querySelectorAll('.architecture-decor-layer').forEach((layer) => {
          const vmin = Number(layer.dataset.parallaxVmin ?? 2)
          layer.style.transform = `translateY(${factor * vmin}vmin)`
        })
      }
    }

    if (!reduceMotion) {
      updateParallax()
      gsap.ticker.add(updateParallax)
    }

    return () => {
      gsap.ticker.remove(updateParallax)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`architecture-section ${isVisible ? 'is-visible' : ''}`}
      id="architecture"
      aria-labelledby="architecture-title"
    >
      <div className="architecture-slide" ref={slideRef}>
        <h2 id="architecture-title" className="architecture-sr-only">
          Architecture
        </h2>

        <div className="architecture-intro-row">
          <p className="architecture-intro">
            <span className="architecture-intro-offset" aria-hidden="true" />
            What began as a journey in real estate consultancy evolved into a
            trusted marketing company and has now grown into a dynamic real
            estate development firm.
          </p>
        </div>

        <div className="architecture-hero">
          <img
            className="architecture-hero-image architecture-parallax-image"
            src={heroImage}
            alt=""
            draggable="false"
          />
        </div>

        <div className="architecture-subhead-row">
          <p className="architecture-subhead">
            Innovation, quality,
            <br />
            and trust in every
            <br />
            development
          </p>
        </div>

        <div className="architecture-gallery-row">
          <div className="architecture-gallery-left">
            <img
              className="architecture-parallax-image"
              data-parallax-intensity="10"
              src={galleryImageLeft}
              alt=""
              draggable="false"
            />
          </div>
          <div className="architecture-gallery-right">
            <img
              className="architecture-parallax-image"
              data-parallax-intensity="10"
              src={galleryImageRight}
              alt=""
              draggable="false"
            />
          </div>
          <p className="architecture-gallery-caption">
            Premium
            <br />
            construction
          </p>
        </div>

        <div className="architecture-decor-row">
          <div className="architecture-decor">
            {decorLayers.map((layer) => (
              <DecorLayer key={layer.src} {...layer} />
            ))}
          </div>
        </div>

        <div className="architecture-copy-row">
          <p className="architecture-copy">
            Led by our CEO, Waleed Ahmad, Dayim Developers is driven by the
            belief that real estate is more than constructing buildings—it&apos;s
            about creating communities, improving lifestyles, and delivering
            long-term value.
          </p>
        </div>

        <div className="architecture-bottom-gallery-row">
          <div className="architecture-bottom-gallery-col architecture-bottom-gallery-col--left architecture-bottom-gallery-desktop">
            <div className="architecture-bottom-gallery-image architecture-bottom-gallery-image--first">
              <BottomGalleryParallaxImage src={gallery1} />
            </div>
          </div>

          <div className="architecture-bottom-gallery-col architecture-bottom-gallery-col--right architecture-bottom-gallery-image--second architecture-bottom-gallery-desktop">
            <BottomGalleryParallaxImage src={gallery2} />
          </div>

          <div className="architecture-bottom-gallery-mobile">
            <ul className="architecture-bottom-gallery-scroll">
              <li className="architecture-bottom-gallery-scroll-item">
                <BottomGalleryParallaxImage src={gallery1} />
              </li>
              <li className="architecture-bottom-gallery-scroll-item">
                <BottomGalleryParallaxImage src={gallery2} />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ArchitectureSection
