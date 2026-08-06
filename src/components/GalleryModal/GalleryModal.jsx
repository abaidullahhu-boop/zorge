import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import gallery1Xs from '../../assets/images/gallery-modal/1-xs.webp'
import gallery1Md from '../../assets/images/gallery-modal/1-md.webp'
import gallery1Xxl from '../../assets/images/gallery-modal/1-xxl.webp'
import gallery2Xs from '../../assets/images/gallery-modal/2-xs.webp'
import gallery2Md from '../../assets/images/gallery-modal/2-md.webp'
import gallery2Xxl from '../../assets/images/gallery-modal/2-xxl.webp'
import gallery3Xs from '../../assets/images/gallery-modal/3-xs.webp'
import gallery3Md from '../../assets/images/gallery-modal/3-md.webp'
import gallery3Xxl from '../../assets/images/gallery-modal/3-xxl.webp'
import gallery4Xs from '../../assets/images/gallery-modal/4-xs.webp'
import gallery4Md from '../../assets/images/gallery-modal/4-md.webp'
import gallery4Xxl from '../../assets/images/gallery-modal/4-xxl.webp'
import gallery5Xs from '../../assets/images/gallery-modal/5-xs.webp'
import gallery5Md from '../../assets/images/gallery-modal/5-md.webp'
import gallery5Xxl from '../../assets/images/gallery-modal/5-xxl.webp'
import gallery6Xs from '../../assets/images/gallery-modal/6-xs.webp'
import gallery6Md from '../../assets/images/gallery-modal/6-md.webp'
import gallery6Xxl from '../../assets/images/gallery-modal/6-xxl.webp'
import gallery7Xs from '../../assets/images/gallery-modal/7-xs.webp'
import gallery7Md from '../../assets/images/gallery-modal/7-md.webp'
import gallery7Xxl from '../../assets/images/gallery-modal/7-xxl.webp'
import gallery8Xs from '../../assets/images/gallery-modal/8-xs.webp'
import gallery8Md from '../../assets/images/gallery-modal/8-md.webp'
import gallery8Xxl from '../../assets/images/gallery-modal/8-xxl.webp'
import gallery9Xs from '../../assets/images/gallery-modal/9-xs.webp'
import gallery9Md from '../../assets/images/gallery-modal/9-md.webp'
import gallery9Xxl from '../../assets/images/gallery-modal/9-xxl.webp'
import gallery10Xs from '../../assets/images/gallery-modal/10-xs.webp'
import gallery10Md from '../../assets/images/gallery-modal/10-md.webp'
import gallery10Xxl from '../../assets/images/gallery-modal/10-xxl.webp'
import gallery11Xs from '../../assets/images/gallery-modal/11-xs.webp'
import gallery11Md from '../../assets/images/gallery-modal/11-md.webp'
import gallery11Xxl from '../../assets/images/gallery-modal/11-xxl.webp'
import '../../assets/styles/GalleryModal.css'

const ICONS = '/assets/images/icons.svg'

const GALLERY_ITEMS = [
  {
    id: 1,
    width: 2456,
    height: 1426,
    xs: gallery1Xs,
    md: gallery1Md,
    xxl: gallery1Xxl,
  },
  {
    id: 2,
    width: 2456,
    height: 1426,
    xs: gallery2Xs,
    md: gallery2Md,
    xxl: gallery2Xxl,
  },
  {
    id: 3,
    width: 2456,
    height: 1426,
    xs: gallery3Xs,
    md: gallery3Md,
    xxl: gallery3Xxl,
  },
  {
    id: 4,
    width: 2456,
    height: 1426,
    xs: gallery4Xs,
    md: gallery4Md,
    xxl: gallery4Xxl,
  },
  {
    id: 5,
    width: 2456,
    height: 1426,
    xs: gallery5Xs,
    md: gallery5Md,
    xxl: gallery5Xxl,
  },
  {
    id: 6,
    width: 2456,
    height: 1426,
    xs: gallery6Xs,
    md: gallery6Md,
    xxl: gallery6Xxl,
  },
  {
    id: 7,
    width: 2456,
    height: 1426,
    xs: gallery7Xs,
    md: gallery7Md,
    xxl: gallery7Xxl,
  },
  {
    id: 8,
    width: 2456,
    height: 1426,
    xs: gallery8Xs,
    md: gallery8Md,
    xxl: gallery8Xxl,
  },
  {
    id: 9,
    width: 2456,
    height: 1426,
    xs: gallery9Xs,
    md: gallery9Md,
    xxl: gallery9Xxl,
  },
  {
    id: 10,
    width: 2456,
    height: 1426,
    xs: gallery10Xs,
    md: gallery10Md,
    xxl: gallery10Xxl,
  },
  {
    id: 11,
    width: 2456,
    height: 1637,
    xs: gallery11Xs,
    md: gallery11Md,
    xxl: gallery11Xxl,
  },
]

function GalleryModal({ open, onClose }) {
  const [zoomed, setZoomed] = useState(false)
  const [present, setPresent] = useState(false)
  const [entered, setEntered] = useState(false)
  const zoomedRef = useRef(false)
  const scrollerRef = useRef(null)
  const cursorRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    zoomedRef.current = zoomed
  }, [zoomed])

  useEffect(() => {
    if (!open) {
      setEntered(false)
      setZoomed(false)
      return undefined
    }

    setPresent(true)

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true))
    })

    return () => cancelAnimationFrame(frame)
  }, [open])

  useEffect(() => {
    if (!present) return undefined

    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return
      if (!open) return
      if (zoomedRef.current) setZoomed(false)
      else onClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.body.classList.add('modal-open', 'gallery-modal-open')

    const lenis = window.__dayimLenis
    if (lenis?.stop) lenis.stop()

    window.addEventListener('keydown', onKeyDown)

    requestAnimationFrame(() => {
      if (scrollerRef.current) scrollerRef.current.scrollTop = 0
    })

    return () => {
      document.body.style.overflow = previousOverflow
      document.body.classList.remove('modal-open', 'gallery-modal-open')
      if (lenis?.start) lenis.start()
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [present, open, onClose])

  const handleTransitionEnd = useCallback(
    (event) => {
      if (event.target !== event.currentTarget) return
      if (event.propertyName !== 'clip-path') return
      if (!open) setPresent(false)
    },
    [open],
  )

  useEffect(() => {
    if (!open) return undefined

    const scroller = scrollerRef.current
    if (!scroller) return undefined

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
      .matches

    let target = scroller.scrollTop
    let current = scroller.scrollTop
    let rafId = 0
    const lerp = reduceMotion ? 1 : 0.08
    const wheelScale = 0.45

    const clamp = (value) => {
      const max = Math.max(0, scroller.scrollHeight - scroller.clientHeight)
      return Math.min(max, Math.max(0, value))
    }

    const tick = () => {
      current += (target - current) * lerp
      if (Math.abs(target - current) < 0.35) current = target
      scroller.scrollTop = current

      if (current !== target) {
        rafId = requestAnimationFrame(tick)
      } else {
        rafId = 0
      }
    }

    const startTick = () => {
      if (!rafId) rafId = requestAnimationFrame(tick)
    }

    const onWheel = (event) => {
      event.preventDefault()
      event.stopPropagation()
      target = clamp(target + event.deltaY * wheelScale)
      startTick()
    }

    const onScroll = () => {
      // Keep in sync if user drags scrollbar / touch scrolls
      if (!rafId) {
        current = scroller.scrollTop
        target = current
      }
    }

    scroller.addEventListener('wheel', onWheel, { passive: false })
    scroller.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      scroller.removeEventListener('wheel', onWheel)
      scroller.removeEventListener('scroll', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined

    const content = contentRef.current
    const cursor = cursorRef.current
    if (!content || !cursor) return undefined

    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)')
      .matches
    if (!canHover) return undefined

    const onMove = (event) => {
      const bounds = content.getBoundingClientRect()
      const x = event.clientX - bounds.left
      const y = event.clientY - bounds.top
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`
      cursor.classList.add('is-visible')
    }

    const onLeave = () => {
      cursor.classList.remove('is-visible')
    }

    content.addEventListener('pointermove', onMove)
    content.addEventListener('pointerleave', onLeave)

    return () => {
      content.removeEventListener('pointermove', onMove)
      content.removeEventListener('pointerleave', onLeave)
    }
  }, [open])

  const toggleZoom = useCallback(() => {
    setZoomed((value) => !value)
  }, [])

  if (!present) return null

  return createPortal(
    <div
      className={`gallery-modal${entered ? ' is-open' : ''}${zoomed ? ' is-zoomed' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Gallery"
      aria-hidden={!open}
      id="gallery-modal"
      tabIndex={-1}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className="gallery-modal__background" aria-hidden="true" />

      <div
        className="gallery-modal__scroller"
        ref={scrollerRef}
        data-lenis-prevent
        data-lenis-prevent-wheel
        data-lenis-prevent-touch
      >
        <div className="gallery-modal__layout">
          <header className="gallery-modal__head">
            <button
              type="button"
              className="gallery-modal__close"
              onClick={onClose}
              aria-label="Close"
            >
              <svg
                className="gallery-modal__close-outline"
                viewBox="0 0 64 64"
                aria-hidden="true"
              >
                <rect
                  className="gallery-modal__close-frame"
                  pathLength="100"
                  x="0.5"
                  y="0.5"
                  width="63"
                  height="63"
                />
                <rect
                  className="gallery-modal__close-frame gallery-modal__close-frame--clone"
                  pathLength="100"
                  x="0.5"
                  y="0.5"
                  width="63"
                  height="63"
                />
              </svg>
              <svg
                className="gallery-modal__close-icon"
                width="18"
                height="16"
                aria-hidden="true"
                viewBox="0 0 18 16"
              >
                <use href={`${ICONS}#close`} />
              </svg>
            </button>

            <h2 className="gallery-modal__title gallery-modal__title--mobile">
              gallery
            </h2>
          </header>

          <aside className="gallery-modal__aside">
            <h2 className="gallery-modal__title">gallery</h2>
          </aside>

          <div
            className="gallery-modal__content"
            ref={contentRef}
            onClick={toggleZoom}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                toggleZoom()
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={zoomed ? 'Zoom out' : 'Zoom in'}
          >
            <div
              className="gallery-modal__zoom-cursor"
              ref={cursorRef}
              aria-hidden="true"
            >
              <span className="gallery-modal__zoom-btn">
                <span className="gallery-modal__zoom-outline" />
                <svg
                  className="gallery-modal__zoom-icon gallery-modal__zoom-icon--plus"
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                >
                  <use href={`${ICONS}#plus`} />
                </svg>
                <svg
                  className="gallery-modal__zoom-icon gallery-modal__zoom-icon--minus"
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                >
                  <use href={`${ICONS}#minus`} />
                </svg>
              </span>
            </div>

            <div className="gallery-modal__list">
              {GALLERY_ITEMS.map((item) => (
                <figure key={item.id} className="gallery-modal__item">
                  <picture>
                    <source
                      srcSet={item.xxl}
                      media="(min-width: 1440px) and (min-height: 700px)"
                    />
                    <source
                      srcSet={item.md}
                      media="(min-width: 768px)"
                    />
                    <img
                      src={item.xs}
                      alt=""
                      width={item.width}
                      height={item.height}
                      draggable="false"
                      loading={item.id <= 2 ? 'eager' : 'lazy'}
                    />
                  </picture>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default GalleryModal
