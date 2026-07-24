import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import '../../assets/styles/GalleryModal.css'

const ICONS = '/assets/images/icons.svg'

const GALLERY_ITEMS = [
  {
    id: 1,
    width: 2456,
    height: 1426,
    xs: 'https://zorge9.estate/media/cache/gallery_modal_item_xs/uploads/39/1_1777552576.webp',
    md: 'https://zorge9.estate/media/cache/gallery_modal_item_md/uploads/39/1_1777552576.webp',
    xxl: 'https://zorge9.estate/media/cache/gallery_modal_item_xxl/uploads/39/1_1777552576.webp',
  },
  {
    id: 2,
    width: 2456,
    height: 1426,
    xs: 'https://zorge9.estate/media/cache/gallery_modal_item_xs/uploads/39/2_1777552573.webp',
    md: 'https://zorge9.estate/media/cache/gallery_modal_item_md/uploads/39/2_1777552573.webp',
    xxl: 'https://zorge9.estate/media/cache/gallery_modal_item_xxl/uploads/39/2_1777552573.webp',
  },
  {
    id: 3,
    width: 2456,
    height: 1426,
    xs: 'https://zorge9.estate/media/cache/gallery_modal_item_xs/uploads/39/3_1_1777552578.webp',
    md: 'https://zorge9.estate/media/cache/gallery_modal_item_md/uploads/39/3_1_1777552578.webp',
    xxl: 'https://zorge9.estate/media/cache/gallery_modal_item_xxl/uploads/39/3_1_1777552578.webp',
  },
  {
    id: 4,
    width: 2456,
    height: 1426,
    xs: 'https://zorge9.estate/media/cache/gallery_modal_item_xs/uploads/39/4_1_1777552569.webp',
    md: 'https://zorge9.estate/media/cache/gallery_modal_item_md/uploads/39/4_1_1777552569.webp',
    xxl: 'https://zorge9.estate/media/cache/gallery_modal_item_xxl/uploads/39/4_1_1777552569.webp',
  },
  {
    id: 5,
    width: 2456,
    height: 1426,
    xs: 'https://zorge9.estate/media/cache/gallery_modal_item_xs/uploads/39/5_1777552572.webp',
    md: 'https://zorge9.estate/media/cache/gallery_modal_item_md/uploads/39/5_1777552572.webp',
    xxl: 'https://zorge9.estate/media/cache/gallery_modal_item_xxl/uploads/39/5_1777552572.webp',
  },
  {
    id: 6,
    width: 2456,
    height: 1426,
    xs: 'https://zorge9.estate/media/cache/gallery_modal_item_xs/uploads/39/6_1777552574.webp',
    md: 'https://zorge9.estate/media/cache/gallery_modal_item_md/uploads/39/6_1777552574.webp',
    xxl: 'https://zorge9.estate/media/cache/gallery_modal_item_xxl/uploads/39/6_1777552574.webp',
  },
  {
    id: 7,
    width: 2456,
    height: 1426,
    xs: 'https://zorge9.estate/media/cache/gallery_modal_item_xs/uploads/39/7_1_1777552571.webp',
    md: 'https://zorge9.estate/media/cache/gallery_modal_item_md/uploads/39/7_1_1777552571.webp',
    xxl: 'https://zorge9.estate/media/cache/gallery_modal_item_xxl/uploads/39/7_1_1777552571.webp',
  },
  {
    id: 8,
    width: 2456,
    height: 1426,
    xs: 'https://zorge9.estate/media/cache/gallery_modal_item_xs/uploads/39/8_1777552577.webp',
    md: 'https://zorge9.estate/media/cache/gallery_modal_item_md/uploads/39/8_1777552577.webp',
    xxl: 'https://zorge9.estate/media/cache/gallery_modal_item_xxl/uploads/39/8_1777552577.webp',
  },
  {
    id: 9,
    width: 2456,
    height: 1426,
    xs: 'https://zorge9.estate/media/cache/gallery_modal_item_xs/uploads/39/9_1777552575.webp',
    md: 'https://zorge9.estate/media/cache/gallery_modal_item_md/uploads/39/9_1777552575.webp',
    xxl: 'https://zorge9.estate/media/cache/gallery_modal_item_xxl/uploads/39/9_1777552575.webp',
  },
  {
    id: 10,
    width: 2456,
    height: 1426,
    xs: 'https://zorge9.estate/media/cache/gallery_modal_item_xs/uploads/39/10_1777552579.webp',
    md: 'https://zorge9.estate/media/cache/gallery_modal_item_md/uploads/39/10_1777552579.webp',
    xxl: 'https://zorge9.estate/media/cache/gallery_modal_item_xxl/uploads/39/10_1777552579.webp',
  },
  {
    id: 11,
    width: 2456,
    height: 1637,
    xs: 'https://zorge9.estate/media/cache/gallery_modal_item_xs/uploads/39/11_1777288096.webp',
    md: 'https://zorge9.estate/media/cache/gallery_modal_item_md/uploads/39/11_1777288096.webp',
    xxl: 'https://zorge9.estate/media/cache/gallery_modal_item_xxl/uploads/39/11_1777288096.webp',
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

    const lenis = window.__zorgeLenis
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
