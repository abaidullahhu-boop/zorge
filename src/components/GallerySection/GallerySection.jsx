import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'
import GalleryModal from '../GalleryModal/GalleryModal'
import { HOME_GALLERY } from '../../data/galleries'
import '../../assets/styles/GallerySection.css'

function GallerySection({
  previewImages = HOME_GALLERY.previewImages,
  photoCount = HOME_GALLERY.photoCount,
  modalItems = HOME_GALLERY.modalItems,
  sectionId = 'gallery',
  modalId = 'gallery-modal',
  className = '',
  scrollContainerRef = null,
}) {
  const collageImages = previewImages.slice(0, 5)
  const [isVisible, setIsVisible] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const sectionRef = useRef(null)
  const slideRef = useRef(null)
  const parallaxRef = useRef(null)
  const cursorRef = useRef(null)
  const pointerRef = useRef({ x: 0, y: 0, active: false })
  const imageOffsetsRef = useRef(new Map())

  const openGallery = useCallback((event) => {
    event.preventDefault()
    setGalleryOpen(true)
  }, [])

  const closeGallery = useCallback(() => setGalleryOpen(false), [])

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

    if (window.matchMedia('(max-width: 980px)').matches) {
      gsap.set(slide, { y: 0, clearProps: 'transform' })
      if (parallaxRef.current) {
        gsap.set(parallaxRef.current, { y: 0, clearProps: 'transform' })
      }
      return undefined
    }

    const scroller = scrollContainerRef?.current ?? undefined

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
            scroller,
            start: 'top bottom',
            end: 'top top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      )

      const parallaxLayer = parallaxRef.current
      if (parallaxLayer) {
        gsap.fromTo(
          parallaxLayer,
          { y: '-25vh', force3D: true },
          {
            y: '25vh',
            ease: 'none',
            force3D: true,
            scrollTrigger: {
              trigger: section,
              scroller,
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
  }, [scrollContainerRef])

  useEffect(() => {
    const section = sectionRef.current
    const cursor = cursorRef.current
    if (!section || !cursor) return undefined

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)')
      .matches

    if (!canHover) {
      section.classList.add('is-touch')
      return undefined
    }

    const maxShift = 22
    const imageNodes = section.querySelectorAll('[data-move-factor]')

    const onPointerMove = (event) => {
      const bounds = section.getBoundingClientRect()
      pointerRef.current.x = event.clientX - bounds.left
      pointerRef.current.y = event.clientY - bounds.top
      pointerRef.current.active = true
    }

    const onPointerEnter = () => {
      pointerRef.current.active = true
      cursor.classList.add('is-visible')
    }

    const onPointerLeave = () => {
      pointerRef.current.active = false
      cursor.classList.remove('is-visible')
      imageOffsetsRef.current.clear()
    }

    const tick = () => {
      const { x, y, active } = pointerRef.current
      if (!active) return

      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`

      if (reduceMotion) return

      const bounds = section.getBoundingClientRect()
      const nx = (x / Math.max(bounds.width, 1) - 0.5) * 2
      const ny = (y / Math.max(bounds.height, 1) - 0.5) * 2

      imageNodes.forEach((imageEl) => {
        const factor = Number(imageEl.dataset.moveFactor ?? 0.8)
        const targetX = nx * maxShift * factor
        const targetY = ny * maxShift * factor
        const prev = imageOffsetsRef.current.get(imageEl) ?? { x: 0, y: 0 }
        const next = {
          x: prev.x + (targetX - prev.x) * 0.12,
          y: prev.y + (targetY - prev.y) * 0.12,
        }
        imageOffsetsRef.current.set(imageEl, next)
        imageEl.style.transform = `translate3d(${next.x}px, ${next.y}px, 0)`
      })
    }

    section.addEventListener('pointermove', onPointerMove)
    section.addEventListener('pointerenter', onPointerEnter)
    section.addEventListener('pointerleave', onPointerLeave)
    gsap.ticker.add(tick)

    return () => {
      section.removeEventListener('pointermove', onPointerMove)
      section.removeEventListener('pointerenter', onPointerEnter)
      section.removeEventListener('pointerleave', onPointerLeave)
      gsap.ticker.remove(tick)
    }
  }, [])

  return (
    <>
      <section
        ref={sectionRef}
        className={[
          'gallery-section',
          isVisible ? 'is-visible' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        id={sectionId}
        aria-labelledby={`${sectionId}-title`}
      >
        <div className="gallery-slide" ref={slideRef}>
          <div className="gallery-background" aria-hidden="true">
            <div className="gallery-parallax" ref={parallaxRef}>
              <div className="gallery-stage">
                <div className="gallery-col gallery-col--left">
                  {collageImages.slice(0, 2).map((image) => (
                    <div
                      key={image.id}
                      className="gallery-image gallery-image--side"
                    >
                      <img
                        data-move-factor={image.moveFactor}
                        src={image.src}
                        alt=""
                        width={image.width}
                        height={image.height}
                        draggable="false"
                      />
                    </div>
                  ))}
                </div>

                <div className="gallery-col gallery-col--center">
                  {collageImages[2] ? (
                    <div className="gallery-image gallery-image--center">
                      <img
                        data-move-factor={collageImages[2].moveFactor}
                        src={collageImages[2].src}
                        alt=""
                        width={collageImages[2].width}
                        height={collageImages[2].height}
                        draggable="false"
                      />
                    </div>
                  ) : null}
                </div>

                <div className="gallery-col gallery-col--right">
                  {collageImages.slice(3, 5).map((image) => (
                    <div
                      key={image.id}
                      className="gallery-image gallery-image--side"
                    >
                      <img
                        data-move-factor={image.moveFactor}
                        src={image.src}
                        alt=""
                        width={image.width}
                        height={image.height}
                        draggable="false"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="gallery-title">
            <div className="gallery-title-line">
              <h2 id={`${sectionId}-title`} className="gallery-title-text">
                Gallery
              </h2>
              <p className="gallery-title-count">/{photoCount} photos</p>
            </div>

            <button
              type="button"
              className="gallery-link"
              onClick={openGallery}
              aria-label="View gallery"
              aria-haspopup="dialog"
              aria-expanded={galleryOpen}
              aria-controls={modalId}
            >
              <span className="gallery-view-btn gallery-view-btn--fallback">
                <span className="gallery-view-btn__text">View</span>
                <span className="gallery-view-btn__icon" aria-hidden="true">
                  <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                    <path
                      d="M1 1l4.5 5L1 11"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </span>
              </span>
            </button>

            <div
              className="gallery-cursor"
              ref={cursorRef}
              aria-hidden="true"
            >
              <span className="gallery-view-btn">
                <span className="gallery-view-btn__text">View</span>
                <span className="gallery-view-btn__icon">
                  <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                    <path
                      d="M1 1l4.5 5L1 11"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <GalleryModal
        open={galleryOpen}
        onClose={closeGallery}
        items={modalItems}
        modalId={modalId}
      />
    </>
  )
}

export default GallerySection
