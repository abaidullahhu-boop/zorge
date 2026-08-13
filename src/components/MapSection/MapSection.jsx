import { useEffect, useRef, useState } from 'react'
import mapImage from '../../assets/images/map-image.svg'
import dsaImage from '../../assets/images/dayim-signature.png'
import livingImage from '../../assets/images/dayim-living.png'
import zindagiImage from '../../assets/images/dayim-zindagi.png'
import '../../assets/styles/MapSection.css'

const projects = [
  {
    id: 'dsa',
    title: 'Dayim Signature Apartments',
    short: 'DSA',
    subtitle: 'Broadway Commercial · Opposite Lake City',
    image: dsaImage,
    mapsUrl: 'https://share.google/1Z56ADgZS5XvUwBgB',
    x: 58.5,
    y: 38.5,
    kind: 'photo',
  },
  {
    id: 'living',
    title: 'Dayim Living',
    short: 'Living',
    subtitle: 'Plot 22, Block C · Al-Kabir Town Phase 2',
    image: livingImage,
    mapsUrl: 'https://share.google/uQuucywNcsJaxM1TJ',
    x: 54.2,
    y: 48.5,
    kind: 'photo',
  },
  {
    id: 'zindagi',
    title: 'Dayim Zindagi',
    short: 'Zindagi',
    subtitle: 'Business Bay · Main Raiwind Road',
    image: zindagiImage,
    mapsUrl: 'https://share.google/ntyEvG8FmQl5EgXMT',
    x: 49.8,
    y: 55.2,
    kind: 'photo',
  },
]

const landmarks = [
  {
    id: 'uol',
    title: 'The University of Lahore',
    icon: 'grad',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=The+University+of+Lahore',
    x: 18.5,
    y: 26,
  },
  {
    id: 'superior',
    title: 'Superior University',
    icon: 'grad',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Superior+University+Lahore',
    x: 86,
    y: 28,
  },
  {
    id: 'zoo',
    title: 'Safari Zoo',
    icon: 'paw',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Safari+Zoo+Lahore',
    x: 28,
    y: 82,
  },
]

function GradCapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2 9.5 12 4l10 5.5-10 5.5L2 9.5Z"
        fill="currentColor"
      />
      <path
        d="M6 11.2v5.3c0 .4 2.7 2.5 6 2.5s6-2.1 6-2.5v-5.3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M22 9.5v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function PawIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <ellipse cx="7.2" cy="8.2" rx="2.1" ry="2.6" />
      <ellipse cx="12" cy="6.4" rx="2.1" ry="2.6" />
      <ellipse cx="16.8" cy="8.2" rx="2.1" ry="2.6" />
      <path d="M8.2 13.2c-1.8 0-3.4 1.5-3.4 3.6 0 2.2 1.9 3.7 4.4 3.7 1.1 0 1.8-.3 2.8-.3s1.7.3 2.8.3c2.5 0 4.4-1.5 4.4-3.7 0-2.1-1.6-3.6-3.4-3.6-1.2 0-2.1.5-3.1.5s-1.9-.5-3.1-.5Z" />
    </svg>
  )
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

function MapSection() {
  const [activeId, setActiveId] = useState(null)
  const [showSwipeCue, setShowSwipeCue] = useState(true)
  const [focusIndex, setFocusIndex] = useState(0)
  const viewportRef = useRef(null)

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport || window.innerWidth > 760) return undefined

    const centerMap = () => {
      const plan = viewport.querySelector('.map-plan')
      if (!plan) return
      viewport.scrollLeft = plan.clientWidth * 0.52 - viewport.clientWidth / 2
    }

    let startScrollLeft = 0
    let cueHidden = false

    const hideCue = () => {
      if (cueHidden) return
      cueHidden = true
      setShowSwipeCue(false)
    }

    const onScroll = () => {
      if (Math.abs(viewport.scrollLeft - startScrollLeft) > 12) hideCue()
    }

    const onPointerDown = () => {
      startScrollLeft = viewport.scrollLeft
    }

    centerMap()
    startScrollLeft = viewport.scrollLeft
    viewport.addEventListener('scroll', onScroll, { passive: true })
    viewport.addEventListener('pointerdown', onPointerDown, { passive: true })
    window.addEventListener('resize', centerMap)

    return () => {
      viewport.removeEventListener('scroll', onScroll)
      viewport.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('resize', centerMap)
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

  const cycleFocus = (direction) => {
    const next =
      (focusIndex + direction + projects.length) % projects.length
    setFocusIndex(next)
    setActiveId(projects[next].id)
  }

  const activeProject = projects.find((p) => p.id === activeId)

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

          {landmarks.map((place) => (
            <div
              className="map-landmark"
              key={place.id}
              style={{ '--map-x': `${place.x}%`, '--map-y': `${place.y}%` }}
            >
              <button
                type="button"
                className="map-landmark-btn"
                aria-label={`Open ${place.title} in Google Maps`}
                onClick={() => openMaps(place.mapsUrl)}
              >
                <span className="map-landmark-icon" aria-hidden="true">
                  {place.icon === 'paw' ? <PawIcon /> : <GradCapIcon />}
                </span>
                <span className="map-landmark-label">{place.title}</span>
              </button>
            </div>
          ))}

          {projects.map((place) => {
            const isActive = activeId === place.id
            const isFocused = projects[focusIndex]?.id === place.id

            return (
              <div
                className={`map-spot map-spot--${place.kind}${isActive ? ' is-active' : ''}${isFocused ? ' is-focused' : ''}`}
                key={place.id}
                style={{ '--map-x': `${place.x}%`, '--map-y': `${place.y}%` }}
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
                  aria-label={`Open ${place.title} in Google Maps`}
                  aria-expanded={isActive}
                  onClick={() => openProject(place)}
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

      <button
        type="button"
        className="map-nav map-nav--prev"
        aria-label="Previous Dayim project"
        onClick={() => cycleFocus(-1)}
      >
        ‹
      </button>
      <button
        type="button"
        className="map-nav map-nav--next"
        aria-label="Next Dayim project"
        onClick={() => cycleFocus(1)}
      >
        ›
      </button>

      <div className="map-dock" role="toolbar" aria-label="Map actions">
        <button
          type="button"
          className="map-dock-btn"
          aria-label="Recenter on Dayim projects"
          onClick={() => {
            setFocusIndex(0)
            setActiveId(projects[0].id)
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
            <path
              d="M12 3v3M12 18v3M3 12h3M18 12h3"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
        {activeProject && (
          <button
            type="button"
            className="map-dock-btn map-dock-btn--maps"
            aria-label={`Open ${activeProject.title} in Google Maps`}
            onClick={() => openProject(activeProject)}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <circle cx="12" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
        )}
      </div>

      <span
        className={`map-swipe-cue${showSwipeCue ? '' : ' is-hidden'}`}
        aria-hidden="true"
      >
        <span className="map-swipe-cue__track">
          <span className="map-swipe-cue__line" />
          <svg
            className="map-swipe-cue__arrow map-swipe-cue__arrow--left"
            viewBox="0 0 10 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M9 1 1 7l8 6"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <svg
            className="map-swipe-cue__arrow map-swipe-cue__arrow--right"
            viewBox="0 0 10 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M1 1l8 6-8 6"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </span>
    </section>
  )
}

export default MapSection
