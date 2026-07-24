import { useEffect, useRef, useState } from 'react'
import mapImage from '../../assets/images/map-image.svg'
import walkingParkImage from '../../assets/images/location1.png'
import embankmentImage from '../../assets/images/location4.png'
import sportCenterImage from '../../assets/images/location3.png'
import shoppingMallImage from '../../assets/images/location5.png'
import '../../assets/styles/MapSection.css'

const places = [
  {
    id: 1,
    title: 'Walking park',
    time: '',
    image: walkingParkImage,
    x: 63.47,
    y: 50.08,
  },
  {
    id: 2,
    title: 'Embankment',
    time: '15 min walk',
    image: embankmentImage,
    x: 34.59,
    y: 81.93,
  },
  {
    id: 3,
    title: 'Sport center',
    time: '',
    image: sportCenterImage,
    x: 72.45,
    y: 50.69,
  },
  {
    id: 4,
    title: 'Shopping mall',
    time: '',
    image: shoppingMallImage,
    x: 59.29,
    y: 84.99,
  },
]

const metroStops = [
  { label: 'Polezhaevskaya and Khoroshevskaya — 7 min walk', x: 65, y: 70.29 },
  { label: 'Khoroshevo — 10 min walk', x: 57.86, y: 71.52 },
  { label: 'Zorge — 7 min walk', x: 55.41, y: 50.23 },
  { label: 'Oktiabrskoe Pole — 21 min walk', x: 49.8, y: 46.25 },
  { label: 'Panfilovskaya — 24 min walk', x: 53.67, y: 38.59 },
]

function MapSection() {
  const [activePlaceId, setActivePlaceId] = useState(null)
  const [showSwipeCue, setShowSwipeCue] = useState(true)
  const viewportRef = useRef(null)

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport || window.innerWidth > 760) return undefined

    const centerMap = () => {
      const plan = viewport.firstElementChild
      if (!plan) return
      viewport.scrollLeft = plan.clientWidth * 0.595 - viewport.clientWidth / 2
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

  const selectPlace = (placeId) => {
    setActivePlaceId((current) => (current === placeId ? null : placeId))
  }

  return (
    <section className="map-section" id="map" aria-labelledby="map-title">
      <h2 id="map-title" className="map-sr-only">
        Map of the area
      </h2>

      <div
        className="map-viewport"
        ref={viewportRef}
        data-lenis-prevent-horizontal
      >
        <div className="map-scroll-sizer" aria-hidden="true" />
        <div className="map-plan">
          <img className="map-plan-image" src={mapImage} alt="" draggable="false" />

          {places.map((place) => {
            const isActive = activePlaceId === place.id

            return (
              <div
                className={`map-spot ${isActive ? 'is-active' : ''}`}
                key={place.id}
                style={{ '--map-x': `${place.x}%`, '--map-y': `${place.y}%` }}
              >
                <button
                  className="map-point"
                  type="button"
                  aria-label={`${place.title}${place.time ? `, ${place.time}` : ''}`}
                  aria-expanded={isActive}
                  onClick={() => selectPlace(place.id)}
                >
                  {place.id}
                </button>

                <aside className="map-tooltip" aria-hidden={!isActive}>
                  <button
                    type="button"
                    className="map-tooltip-close"
                    aria-label="Close place information"
                    onClick={() => setActivePlaceId(null)}
                  >
                    ×
                  </button>
                  <img src={place.image} alt="" />
                  <div>
                    <p>{place.title}</p>
                    {place.time && <small>{place.time}</small>}
                  </div>
                </aside>
              </div>
            )
          })}

          {metroStops.map((stop) => (
            <span
              className="map-metro"
              key={stop.label}
              style={{ '--map-x': `${stop.x}%`, '--map-y': `${stop.y}%` }}
              title={stop.label}
              aria-label={stop.label}
            >
              M
            </span>
          ))}

          <span className="map-place map-place--historical">Historical park</span>
          <span className="map-place map-place--landscape">Landscape park</span>

          <span className="map-house" aria-label="Zorge number nine">
            <span>Nº9</span>
          </span>
        </div>
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
