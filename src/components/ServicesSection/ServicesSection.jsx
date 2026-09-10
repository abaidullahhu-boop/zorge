import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'
import officeImage1 from '../../assets/images/11.jpg'
import officeImage2 from '../../assets/images/13.jpg'
import studioImage1 from '../../assets/images/studio-1.png'
import studioImage2 from '../../assets/images/studio-2.png'
import oneBedImage1 from '../../assets/images/onebed-1.png'
import oneBedImage2 from '../../assets/images/onebed-2.png'
import oneBedImage3 from '../../assets/images/onebed-3.png'
import shopImage1 from '../../assets/images/shop-1.png'
import shopImage2 from '../../assets/images/shop-2.png'
import '../../assets/styles/ServicesSection.css'

const DEFAULT_SERVICES = [
  {
    id: 'office',
    title: 'Commercial Offices',
    images: [
      { src: officeImage1, label: 'Cabin' },
      { src: officeImage2, label: 'Lounge' },
    ],
    width: 1024,
    height: 768,
    text: 'Ground-floor workspaces designed for focus, meetings, and a polished professional presence.',
  },
  {
    id: 'shop',
    title: 'Shops',
    images: [
      { src: shopImage1, label: 'Corridor' },
      { src: shopImage2, label: 'Arcade' },
    ],
    width: 1024,
    height: 768,
    text: 'Retail-ready units on the lower ground and first floors, built for foot traffic and visibility.',
  },
  {
    id: 'studio',
    title: 'Studio Apartments',
    images: [
      { src: studioImage1, label: 'Room' },
      { src: studioImage2, label: 'Living' },
    ],
    width: 1024,
    height: 768,
    text: 'Compact, light-filled studios with efficient layouts for modern city living.',
  },
  {
    id: 'one-bed',
    title: 'One Bedroom Apartments',
    images: [
      { src: oneBedImage1, label: 'Living' },
      { src: oneBedImage2, label: 'Bedroom' },
      { src: oneBedImage3, label: 'Kitchen' },
    ],
    width: 1024,
    height: 768,
    text: 'Spacious one-bedroom homes with refined finishes for comfort and everyday ease.',
  },
].filter((item) => item.images.length > 0)

const DEFAULT_BRAND_LINES = ['SIGNATURE', 'INTERIORS']

const CLIP_HIDDEN = 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)'
const CLIP_VISIBLE = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'

function buildSlides(services) {
  return services.flatMap((item, serviceIndex) =>
    item.images.map((image, imageIndex) => ({
      id: `${item.id}-${imageIndex}`,
      serviceId: item.id,
      serviceIndex,
      image,
      width: item.width,
      height: item.height,
    })),
  )
}

function ServicesSection({
  variant = 'default',
  scrollContainerRef = null,
  project = null,
}) {
  const isProjectVariant = variant === 'project'
  const interiors = project?.story?.interiors
  const services = useMemo(
    () =>
      (interiors?.services ?? DEFAULT_SERVICES).filter(
        (item) => item.images?.length > 0,
      ),
    [interiors],
  )
  const brandLines = interiors?.brandLines ?? DEFAULT_BRAND_LINES
  const slides = useMemo(() => buildSlides(services), [services])
  const serviceCount = services.length
  const slideCount = slides.length
  const interiorsTitle = brandLines.join(' ')

  const [isVisible, setIsVisible] = useState(isProjectVariant)
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const sectionRef = useRef(null)
  const slideRef = useRef(null)
  const activeSlideIndexRef = useRef(0)
  const setActiveFromScrollRef = useRef(null)

  const activeServiceIndex = slides[activeSlideIndex]?.serviceIndex ?? 0

  setActiveFromScrollRef.current = (nextIndex) => {
    if (nextIndex === activeSlideIndexRef.current) return
    activeSlideIndexRef.current = nextIndex
    setActiveSlideIndex(nextIndex)
  }

  useEffect(() => {
    setActiveSlideIndex(0)
    activeSlideIndexRef.current = 0
  }, [project?.id])

  useEffect(() => {
    if (isVisible) return undefined

    const section = sectionRef.current
    const slide = slideRef.current
    if (!section) return undefined

    // Observe the sticky viewport panel — the section itself is many
    // viewports tall, so a 0.12 threshold on it can never be reached.
    const target = slide ?? section
    const root = scrollContainerRef?.current ?? null

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        root,
        threshold: 0,
        rootMargin: '0px 0px -10% 0px',
      },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [scrollContainerRef, isVisible])

  useEffect(() => {
    const section = sectionRef.current
    const slide = slideRef.current
    if (!section || !slide || slideCount < 1) return undefined

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (reduceMotion) {
      gsap.set(slide, { y: 0, clearProps: 'transform' })
      return undefined
    }

    const scroller = scrollContainerRef?.current ?? undefined
    const scrollTriggerBase = scroller ? { scroller } : {}

    const ctx = gsap.context(() => {
      const images = [...slide.querySelectorAll('.services-image-item')]

      // Homepage only: lift the panel as it enters. On the project page the
      // lift leaves a black gap above the image while the section scrolls in.
      if (!isProjectVariant) {
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
              ...scrollTriggerBase,
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

      images.forEach((image, index) => {
        gsap.set(image, {
          zIndex: index === 0 ? 1 : 0,
          clipPath: index === 0 ? CLIP_VISIBLE : CLIP_HIDDEN,
          y: 0,
        })
      })

      if (slideCount < 2) return

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          ...scrollTriggerBase,
          trigger: section,
          start: 'top top',
          end: () => `+=${window.innerHeight * (slideCount - 1)}`,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const segments = slideCount - 1
            const raw = self.progress * segments
            const base = Math.min(slideCount - 1, Math.floor(raw))
            const local = raw - Math.floor(raw)
            const nextIndex =
              raw >= segments
                ? slideCount - 1
                : local >= 0.5
                  ? Math.min(slideCount - 1, base + 1)
                  : base
            setActiveFromScrollRef.current?.(nextIndex)
          },
        },
      })

      for (let i = 0; i < slideCount - 1; i += 1) {
        const next = i + 1
        const position = i
        const nextImage = images[next]

        if (nextImage) {
          gsap.set(nextImage, { zIndex: next + 1 })
          tl.fromTo(
            nextImage,
            { clipPath: CLIP_HIDDEN },
            { clipPath: CLIP_VISIBLE, duration: 1 },
            position,
          )
        }
      }
    }, section)

    return () => ctx.revert()
  }, [scrollContainerRef, isProjectVariant, slideCount, project?.id])

  if (!slideCount) return null

  return (
    <section
      ref={sectionRef}
      className={[
        'services-section',
        isProjectVariant ? 'services-section--project' : '',
        isVisible ? 'is-visible' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      id="services"
      aria-labelledby="services-title"
      style={{ '--item-count': slideCount }}
    >
      <div className="services-sticky">
        <div className="services-slide" ref={slideRef}>
          <h2 id="services-title" className="services-sr-only">
            {interiorsTitle}
          </h2>

          <div className="services-image">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className="services-image-item"
                aria-hidden={index !== activeSlideIndex}
              >
                <img
                  src={slide.image.src}
                  alt=""
                  width={slide.width}
                  height={slide.height}
                  draggable="false"
                />
              </div>
            ))}
          </div>

          <div className="services-right">
            <p className="services-section-title" aria-hidden="true">
              {brandLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>

            <div className="services-content">
              <div
                className={`services-list${
                  activeServiceIndex === serviceCount - 1
                    ? ' is-last-active'
                    : ''
                }`}
                aria-live="polite"
                style={{
                  '--active-index': activeServiceIndex,
                  '--item-count': serviceCount,
                }}
              >
                {services.map((item, index) => (
                  <article
                    key={item.id}
                    className={`services-card${
                      index === activeServiceIndex ? ' is-active' : ''
                    }`}
                  >
                    <p className="services-card-title">{item.title}</p>
                    <p className="services-card-text">{item.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="services-mobile">
        <p className="services-section-title">
          {brandLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
        {services.map((item, index) => (
          <article key={item.id} className="services-mobile-card">
            <div className="services-mobile-content">
              <div className="services-mobile-head">
                <p className="services-mobile-title">{item.title}</p>
                <div className="services-counter">
                  <span className="services-counter-current">{index + 1}</span>
                  <span className="services-counter-line" aria-hidden="true" />
                  <span className="services-counter-total">{serviceCount}</span>
                </div>
              </div>
              <p className="services-mobile-copy">{item.text}</p>
            </div>
            <div className="services-mobile-images">
              {item.images.map((image, imageIndex) => (
                <div
                  key={`${item.id}-mobile-${imageIndex}`}
                  className="services-mobile-image"
                >
                  <img
                    src={image.src}
                    alt=""
                    width={item.width}
                    height={item.height}
                    draggable="false"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ServicesSection
