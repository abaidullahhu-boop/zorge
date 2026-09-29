import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'
import officeImage1 from '../../assets/images/11.jpg'
import officeImage2 from '../../assets/images/13.jpg'
import studioImage1 from '../../assets/images/sstudio.png'
import studioImage2 from '../../assets/images/sstudio2.png'
import studioImage3 from '../../assets/images/sstudio3.png'
import oneBedImage1 from '../../assets/images/onebed-1.png'
import oneBedImage2 from '../../assets/images/onebed-2.png'
import oneBedImage3 from '../../assets/images/onebed-3.png'
import oneBedImage4 from '../../assets/images/sroom.jpg'
import oneBedImage5 from '../../assets/images/bath2.jpg'
import shopImage1 from '../../assets/images/shop-1.png'
import shopImage2 from '../../assets/images/shop-2.png'
import dsMark from '../../assets/images/dsmark.png'
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
    title: 'Commercial Shops',
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
    title: 'Studio Apartment',
    images: [
      { src: studioImage3, label: 'Bedroom' },
      { src: studioImage1, label: 'Kitchen' },
      { src: studioImage2, label: 'Bathroom' },
    ],
    width: 1024,
    height: 768,
    text: 'Compact, light-filled studios with efficient layouts for modern city living.',
  },
  {
    id: 'one-bed',
    title: 'One Bed Apartment',
    images: [
      { src: oneBedImage1, label: 'Living' },
      { src: oneBedImage3, label: 'Kitchen' },
      { src: oneBedImage4, label: 'Room' },
      {
        src: oneBedImage5,
        label: 'Bathroom',
        orientation: 'portrait',
        width: 2443,
        height: 2780,
      },
    ],
    width: 1024,
    height: 768,
    text: 'Spacious one-bedroom homes with refined finishes for comfort and everyday ease.',
  },
].filter((item) => item.images.length > 0)

const DEFAULT_BRAND_LINES = [ 'INTERIORS']

const CLIP_HIDDEN = 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)'
const CLIP_VISIBLE = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'

function buildSlides(services) {
  return services.flatMap((item, serviceIndex) =>
    item.images.map((image, imageIndex) => ({
      id: `${item.id}-${imageIndex}`,
      serviceId: item.id,
      serviceIndex,
      image,
      width: image.width ?? item.width,
      height: image.height ?? item.height,
      orientation: image.orientation ?? item.orientation ?? 'landscape',
    })),
  )
}

function ServicesSection({
  variant = 'default',
  scrollContainerRef = null,
  project = null,
  children = null,
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
  const introTitle = interiors?.title ?? null
  const introBody = interiors?.body ?? null
  const hasIntro = Boolean(introTitle || introBody)
  const slides = useMemo(() => buildSlides(services), [services])
  const serviceCount = services.length
  const slideCount = slides.length
  const interiorsTitle = introTitle || brandLines.join(' ')

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

  const scrollToService = (serviceIndex) => {
    if (slideCount < 2 || serviceIndex === activeServiceIndex) return

    const targetSlideIndex = slides.findIndex(
      (slide) => slide.serviceIndex === serviceIndex,
    )
    if (targetSlideIndex < 0) return

    const section = sectionRef.current
    if (!section) return

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const behavior = reduceMotion ? 'auto' : 'smooth'
    // Matches ScrollTrigger end: +=stickyH * (slideCount - 1)
    const sticky = section.querySelector('.services-sticky')
    const stickyH = sticky?.offsetHeight || window.innerHeight
    const slideOffset = targetSlideIndex * stickyH
    const scroller = scrollContainerRef?.current

    if (scroller) {
      const nextTop =
        section.getBoundingClientRect().top -
        scroller.getBoundingClientRect().top +
        scroller.scrollTop +
        slideOffset
      scroller.scrollTo({ top: Math.max(0, nextTop), behavior })
      return
    }

    const nextTop =
      section.getBoundingClientRect().top + window.scrollY + slideOffset
    const lenis = window.__dayimLenis
    if (lenis) {
      lenis.scrollTo(nextTop, { immediate: reduceMotion })
      return
    }
    window.scrollTo({ top: Math.max(0, nextTop), behavior })
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

      const segments = slideCount - 1
      const sticky = section.querySelector('.services-sticky')
      const getStickyH = () => sticky?.offsetHeight || window.innerHeight
      // Pin travel is stickyH * slideCount: (slideCount - 1) reveals + 1 hold
      // so the last image stays fully open before the next section enters.
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          ...scrollTriggerBase,
          trigger: section,
          start: 'top top',
          end: () => `+=${getStickyH() * slideCount}`,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Map progress across transitions only (final 1/slideCount is hold).
            const scrubProgress = Math.min(1, self.progress * (slideCount / segments))
            const raw = scrubProgress * segments
            const base = Math.min(slideCount - 1, Math.floor(raw))
            const local = raw - Math.floor(raw)
            const nextIndex =
              scrubProgress >= 1
                ? slideCount - 1
                : local >= 0.5
                  ? Math.min(slideCount - 1, base + 1)
                  : base
            setActiveFromScrollRef.current?.(nextIndex)
          },
        },
      })

      for (let i = 0; i < segments; i += 1) {
        const next = i + 1
        const nextImage = images[next]

        if (nextImage) {
          gsap.set(nextImage, { zIndex: next + 1 })
          tl.fromTo(
            nextImage,
            { clipPath: CLIP_HIDDEN },
            { clipPath: CLIP_VISIBLE, duration: 1 },
            i,
          )
        }
      }

      // Hold the final fully-open frame for one sticky viewport of scroll.
      tl.to({}, { duration: 1 }, segments)
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
        hasIntro ? 'services-section--has-intro' : '',
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
                className={[
                  'services-image-item',
                  slide.orientation === 'portrait'
                    ? 'services-image-item--portrait'
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
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
            <img
              className="services-section__mark"
              src={project?.mark ?? dsMark}
              alt=""
              aria-hidden="true"
              draggable="false"
            />

            <p className="services-section-title" aria-hidden="true">
              {brandLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>

            {hasIntro ? (
              <div className="services-intro">
                {introTitle ? (
                  <p className="services-intro-title" aria-hidden="true">
                    {introTitle}
                  </p>
                ) : null}
                {introBody ? (
                  <p className="services-intro-body">{introBody}</p>
                ) : null}
              </div>
            ) : null}

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
                  <button
                    key={item.id}
                    type="button"
                    className={`services-card${
                      index === activeServiceIndex ? ' is-active' : ''
                    }`}
                    aria-current={
                      index === activeServiceIndex ? 'true' : undefined
                    }
                    aria-label={`View ${item.title}`}
                    onClick={() => scrollToService(index)}
                  >
                    <span className="services-card-heading">
                      <span className="services-card-title">{item.title}</span>
                      {item.subtitle ? (
                        <span className="services-card-subtitle">
                          {item.subtitle}
                        </span>
                      ) : null}
                    </span>
                    {item.plan ? (
                      <span className="services-card-plan" aria-hidden="true">
                        <img
                          src={item.plan}
                          alt=""
                          draggable="false"
                        />
                      </span>
                    ) : null}
                    <span className="services-card-text">{item.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {isProjectVariant && children ? (
          <div className="services-enquire mt-12">{children}</div>
        ) : null}
      </div>

      {isProjectVariant ? (
        <div className="services-pin-spacer" aria-hidden="true" />
      ) : null}

      <div className="services-mobile">
        <p className="services-section-title">
          {brandLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
        {hasIntro ? (
          <div className="services-intro services-intro--mobile">
            {introTitle ? (
              <p className="services-intro-title">{introTitle}</p>
            ) : null}
            {introBody ? (
              <p className="services-intro-body">{introBody}</p>
            ) : null}
          </div>
        ) : null}
        {services.map((item, index) => (
          <article key={item.id} className="services-mobile-card">
            <div className="services-mobile-content">
              <div className="services-mobile-head">
                <div className="services-mobile-heading">
                  <p className="services-mobile-title">{item.title}</p>
                  {item.subtitle ? (
                    <p className="services-mobile-subtitle">{item.subtitle}</p>
                  ) : null}
                </div>
                <div className="services-counter">
                  <span className="services-counter-current">{index + 1}</span>
                  <span className="services-counter-line" aria-hidden="true" />
                  <span className="services-counter-total">{serviceCount}</span>
                </div>
              </div>
              {item.plan ? (
                <div className="services-mobile-plan" aria-hidden="true">
                  <img src={item.plan} alt="" draggable="false" loading="lazy" />
                </div>
              ) : null}
              <p className="services-mobile-copy">{item.text}</p>
            </div>
            <div className="services-mobile-images">
              {item.images.map((image, imageIndex) => (
                <div
                  key={`${item.id}-mobile-${imageIndex}`}
                  className={[
                    'services-mobile-image',
                    image.orientation === 'portrait'
                      ? 'services-mobile-image--portrait'
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <img
                    src={image.src}
                    alt=""
                    width={image.width ?? item.width}
                    height={image.height ?? item.height}
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
