import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from '../../lib/gsap'
import mapImage from '../../assets/images/map.png'
import { projects } from '../../data/projects'
import { mapPlaces } from '../../data/mapPlaces'
import '../../assets/styles/MapSection.css'

const MOBILE_MAP_MQ = '(max-width: 980px)'

function useMobileMap() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(MOBILE_MAP_MQ).matches : false,
  )

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MAP_MQ)
    const onChange = () => setIsMobile(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return isMobile
}

function BuildingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 20V8l8-4 8 4v12"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M9 20v-6h6v6" stroke="currentColor" strokeWidth="1.7" />
      <path d="M10 10h1.2M12.8 10H14M10 13h1.2M12.8 13H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function MapPinIcon() {
  return (
    <svg className="map-pin-svg" viewBox="0 0 40 52" aria-hidden="true">
      <defs>
        <linearGradient id="mapPinGrad" x1="20" y1="0" x2="20" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff4d4d" />
          <stop offset="1" stopColor="#b01010" />
        </linearGradient>
        <filter id="mapPinShadow" x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#000" floodOpacity="0.45" />
        </filter>
      </defs>
      <path
        filter="url(#mapPinShadow)"
        d="M20 0C9.5 0 1 8.3 1 18.5 1 31.2 20 52 20 52s19-20.8 19-33.5C39 8.3 30.5 0 20 0Z"
        fill="url(#mapPinGrad)"
      />
      <circle cx="20" cy="18" r="7.5" fill="#fff" />
    </svg>
  )
}

function openMaps(url) {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur()
  }
  window.open(url, '_blank', 'noopener,noreferrer')
}

function copyTextFallback(text) {
  const ta = document.createElement('textarea')
  ta.value = text
  ta.setAttribute('readonly', '')
  ta.style.position = 'fixed'
  ta.style.left = '-9999px'
  document.body.appendChild(ta)
  ta.select()
  let ok = false
  try {
    ok = document.execCommand('copy')
  } catch {
    ok = false
  }
  document.body.removeChild(ta)
  return ok
}

function copyText(text) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => copyTextFallback(text))
  }
  return Promise.resolve(copyTextFallback(text))
}

const PROJECT_INFO = {
  dsa: {
    tag: 'PROJECT',
    address: 'Broadway Commercial, Opposite Lake City, Lahore',
    note: 'High-rise residential on Broadway Commercial',
  },
  living: {
    tag: 'PROJECT',
    address: 'Plot 22, Block C, Al-Kabir Town Phase 2, Lahore',
    note: 'Residential development in Al-Kabir Town',
  },
  zindagi: {
    tag: 'PROJECT',
    address: 'Business Bay, Main Raiwind Road, Lahore',
    note: 'Landmark address on Main Raiwind Road',
  },
}

function getMapSpotStyle(place) {
  const mobileX = place.mobile?.x ?? place.x + (place.mobile?.dx ?? 0)
  const mobileY = place.mobile?.y ?? place.y + (place.mobile?.dy ?? 0)

  return {
    '--map-x': `${place.x}%`,
    '--map-y': `${place.y}%`,
    '--map-mobile-x': `${mobileX}%`,
    '--map-mobile-y': `${mobileY}%`,
  }
}

function getMapLandmarkStyle(place) {
  const style = getMapSpotStyle(place)
  if (place.hitW) style['--map-hit-w'] = place.hitW
  if (place.hitH) style['--map-hit-h'] = place.hitH
  return style
}

function MapPopup({
  place,
  isActive,
  copied,
  onClose,
  onOpenMaps,
  onCopy,
  sheet = false,
}) {
  return (
    <aside
      className={`map-tooltip${place.image ? '' : ' map-tooltip--landmark'}${sheet ? ' map-tooltip--sheet' : ''}${isActive ? ' is-open' : ''}`}
      aria-hidden={!isActive}
    >
      <button
        type="button"
        className="map-tooltip-close"
        aria-label="Close place information"
        onClick={() => onClose()}
      >
        ×
      </button>
      {place.image ? <img src={place.image} alt="" /> : null}
      <div className="map-tooltip-body">
        {place.tag ? <span className="map-tooltip-tag">{place.tag}</span> : null}
        <p>{place.title}</p>
        <small>{place.address || place.subtitle}</small>
        {place.note ? <em className="map-tooltip-note">{place.note}</em> : null}
        <div className="map-tooltip-actions">
          {place.address ? (
            <button
              type="button"
              className="map-tooltip-copy"
              onClick={(event) => {
                event.stopPropagation()
                onCopy(place.id, place.address)
              }}
            >
              Copy address
            </button>
          ) : null}
          <button
            type="button"
            className="map-tooltip-maps"
            onClick={() => onOpenMaps(place)}
          >
            Open in Google Maps
          </button>
        </div>
        <div className="map-copy-hint" aria-live="polite">
          {copied ? 'Copied!' : ''}
        </div>
      </div>
    </aside>
  )
}

function getPopupPlace(id) {
  const landmark = mapPlaces.find((place) => place.id === id)
  if (landmark) return landmark

  const project = projects.find((place) => place.id === id)
  if (!project) return null

  return { ...project, ...(PROJECT_INFO[project.id] ?? {}) }
}

function MapSection() {
  const [activeId, setActiveId] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const isMobile = useMobileMap()
  const sectionRef = useRef(null)
  const slideRef = useRef(null)
  const copyTimerRef = useRef(null)
  const activePlace = activeId ? getPopupPlace(activeId) : null

  useEffect(() => {
    const section = sectionRef.current
    const slide = slideRef.current
    if (!section || !slide) return undefined

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(slide, { y: 0, clearProps: 'transform' })
      return undefined
    }

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
    const closeCard = () => setActiveId(null)

    const onPointerDown = (event) => {
      if (!(event.target instanceof Element)) return
      if (event.target.closest('.map-spot, .map-landmark, .map-tooltip')) return
      closeCard()
    }

    const onVisibility = () => {
      if (document.visibilityState === 'visible') closeCard()
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeCard()
    }

    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('focus', closeCard)
    document.addEventListener('visibilitychange', onVisibility)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('focus', closeCard)
      document.removeEventListener('visibilitychange', onVisibility)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  useEffect(() => () => {
    window.clearTimeout(copyTimerRef.current)
  }, [])

  const openPlace = (place) => {
    setActiveId(null)
    openMaps(place.mapsUrl)
  }

  const handlePlaceClick = (id) => {
    setActiveId((current) => (current === id ? null : id))
  }

  const handleCopy = (id, text) => {
    copyText(text).then((ok) => {
      if (!ok) return
      setCopiedId(id)
      window.clearTimeout(copyTimerRef.current)
      copyTimerRef.current = window.setTimeout(() => setCopiedId(null), 1400)
    })
  }

  return (
    <section
      ref={sectionRef}
      className="map-section"
      id="location"
      aria-labelledby="map-title"
    >
      <div className="map-slide" ref={slideRef}>
        <h2 id="map-title" className="map-heading">
          Location
        </h2>

        <div className="map-viewport">
        <div className="map-plan">
          <img
            className="map-plan-image"
            src={mapImage}
            alt=""
            draggable="false"
          />

          {mapPlaces.map((place) => {
            const isActive = activeId === place.id
            const placementClass = place.placement === 'bottom'
              ? ' map-landmark--top'
              : place.placement === 'left'
                ? ' map-landmark--left'
                : ''
            const shapeClass = place.shape === 'pill'
              ? ' map-landmark--pill'
              : place.shape === 'pin'
                ? ' map-landmark--pin'
                : ''

            return (
              <div
                className={`map-landmark${shapeClass}${placementClass}${isActive ? ' is-active' : ''}`}
                key={place.id}
                style={getMapLandmarkStyle(place)}
              >
                <button
                  className="map-landmark-hit"
                  type="button"
                  aria-label={`Show ${place.title}`}
                  aria-expanded={isActive}
                  onClick={() => handlePlaceClick(place.id)}
                />
                {!isMobile ? (
                  <MapPopup
                    place={place}
                    isActive={isActive}
                    copied={copiedId === place.id}
                    onClose={() => setActiveId(null)}
                    onOpenMaps={openPlace}
                    onCopy={handleCopy}
                  />
                ) : null}
              </div>
            )
          })}

          {projects.map((place) => {
            const isActive = activeId === place.id
            const details = PROJECT_INFO[place.id] ?? {}
            const popupPlace = { ...place, ...details }

            const opensAbove = place.y >= 55

            return (
              <div
                className={`map-spot map-spot--${place.kind}${opensAbove ? ' map-spot--above' : ''}${isActive ? ' is-active' : ''}`}
                key={place.id}
                style={getMapSpotStyle(place)}
              >
                <button
                  className={
                    place.kind === 'pin'
                      ? 'map-pin'
                      : place.kind === 'photo'
                        ? 'map-brand map-brand--photo'
                        : 'map-brand'
                  }
                  type="button"
                  aria-label={`Show ${place.title}`}
                  aria-expanded={isActive}
                  onClick={() => handlePlaceClick(place.id)}
                >
                  {place.kind === 'pin' ? (
                    <MapPinIcon />
                  ) : place.kind === 'photo' ? (
                    <img
                      className="map-brand-photo"
                      src={place.image}
                      alt=""
                      draggable="false"
                    />
                  ) : (
                    <>
                      <span className="map-brand-icon" aria-hidden="true">
                        <BuildingIcon />
                      </span>
                      <span className="map-brand-text">{place.short}</span>
                    </>
                  )}
                </button>

                {!isMobile ? (
                  <MapPopup
                    place={popupPlace}
                    isActive={isActive}
                    copied={copiedId === place.id}
                    onClose={() => setActiveId(null)}
                    onOpenMaps={openPlace}
                    onCopy={handleCopy}
                  />
                ) : null}
              </div>
            )
          })}
        </div>
        </div>
      </div>

      {isMobile && activePlace
        ? createPortal(
          <MapPopup
            place={activePlace}
            isActive
            sheet
            copied={copiedId === activePlace.id}
            onClose={() => setActiveId(null)}
            onOpenMaps={openPlace}
            onCopy={handleCopy}
          />,
          document.body,
        )
        : null}
    </section>
  )
}

export default MapSection
