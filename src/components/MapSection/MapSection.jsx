import { useEffect, useRef, useState } from 'react'
import mapImage from '../../assets/images/map.png'
import { projects } from '../../data/projects'
import '../../assets/styles/MapSection.css'


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

const MOBILE_MAP_MQ = '(max-width: 760px)'

// Red pin anchor baked into map.png — mobile markers cluster here.
const MAP_CLUSTER = { x: 46.5, y: 63 }

function isMobileMap() {
  return window.matchMedia(MOBILE_MAP_MQ).matches
}

function scrollMapToCluster(viewport) {
  if (!viewport || !isMobileMap()) return

  const plan = viewport.querySelector('.map-plan')
  if (!plan?.clientWidth) return

  const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth)
  viewport.scrollLeft = Math.max(
    0,
    Math.min(maxScroll, plan.clientWidth * (MAP_CLUSTER.x / 100) - viewport.clientWidth / 2),
  )
}

function scrollMapToProjects(viewport) {
  scrollMapToCluster(viewport)
}

function scrollMapToProject(viewport) {
  scrollMapToCluster(viewport)
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

function MapSection() {
  const [activeId, setActiveId] = useState(null)
  const [focusIndex, setFocusIndex] = useState(0)
  const viewportRef = useRef(null)

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return undefined

    let startScrollLeft = 0
    let userScrolled = false
    let centering = false

    const centerMap = () => {
      if (userScrolled) return
      centering = true
      scrollMapToProjects(viewport)
      startScrollLeft = viewport.scrollLeft
      centering = false
    }

    const onScroll = () => {
      if (centering) return
      if (Math.abs(viewport.scrollLeft - startScrollLeft) > 12) {
        userScrolled = true
      }
    }

    const onPointerDown = () => {
      startScrollLeft = viewport.scrollLeft
    }

    const onResize = () => {
      if (!userScrolled) centerMap()
    }

    centerMap()
    requestAnimationFrame(() => {
      requestAnimationFrame(centerMap)
    })

    const img = viewport.querySelector('.map-plan-image')
    const onImageLoad = () => {
      requestAnimationFrame(centerMap)
    }
    if (img && !img.complete) {
      img.addEventListener('load', onImageLoad)
    }

    const resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(viewport)
    const plan = viewport.querySelector('.map-plan')
    if (plan) resizeObserver.observe(plan)

    const section = viewport.closest('.map-section')
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) centerMap()
      },
      { threshold: 0.15 },
    )
    if (section) io.observe(section)

    viewport.addEventListener('scroll', onScroll, { passive: true })
    viewport.addEventListener('pointerdown', onPointerDown, { passive: true })
    window.addEventListener('resize', onResize)

    return () => {
      img?.removeEventListener('load', onImageLoad)
      resizeObserver.disconnect()
      io.disconnect()
      viewport.removeEventListener('scroll', onScroll)
      viewport.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  // Close the info card when returning from Google Maps (or any other tab).
  useEffect(() => {
    const closeCard = () => setActiveId(null)

    const onVisibility = () => {
      if (document.visibilityState === 'visible') closeCard()
    }

    window.addEventListener('focus', closeCard)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      window.removeEventListener('focus', closeCard)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  const openProject = (place) => {
    setActiveId(null)
    openMaps(place.mapsUrl)
  }

  const handleMarkerClick = (place) => {
    if (isMobileMap()) {
      setActiveId((current) => (current === place.id ? null : place.id))
      scrollMapToProject(viewportRef.current)
      return
    }

    openProject(place)
  }

  return (
    <section className="map-section" id="map" aria-labelledby="map-title">
      <h2 id="map-title" className="map-sr-only">
        Map of Dayim projects in Lahore
      </h2>

      <div
        className="map-viewport"
        ref={viewportRef}
        data-lenis-prevent-horizontal
      >
        <div className="map-scroll-sizer" aria-hidden="true" />
        <div className="map-plan">
          <img
            className="map-plan-image"
            src={mapImage}
            alt=""
            draggable="false"
          />


          {projects.map((place) => {
            const isActive = activeId === place.id
            const isFocused = projects[focusIndex]?.id === place.id

            return (
              <div
                className={`map-spot map-spot--${place.kind}${isActive ? ' is-active' : ''}${isFocused ? ' is-focused' : ''}`}
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
                  aria-label={`${isMobileMap() ? 'Show' : 'Open'} ${place.title}${isMobileMap() ? '' : ' in Google Maps'}`}
                  aria-expanded={isActive}
                  onClick={() => handleMarkerClick(place)}
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

                <aside className="map-tooltip" aria-hidden={!isActive}>
                  <button
                    type="button"
                    className="map-tooltip-close"
                    aria-label="Close place information"
                    onClick={() => setActiveId(null)}
                  >
                    ×
                  </button>
                  <img src={place.image} alt="" />
                  <div className="map-tooltip-body">
                    <p>{place.title}</p>
                    <small>{place.subtitle}</small>
                    <button
                      type="button"
                      className="map-tooltip-maps"
                      onClick={() => openProject(place)}
                    >
                      Open in Google Maps
                    </button>
                  </div>
                </aside>
              </div>
            )
          })}
        </div>
      </div>

    </section>
  )
}

export default MapSection
