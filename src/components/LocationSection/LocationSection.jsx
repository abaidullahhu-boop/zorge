import { useEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'
import locationHero from '../../assets/images/section3.png'
import walkingParkImage from '../../assets/images/location1.png'
import schoolImage from '../../assets/images/location2.png'
import tennisImage from '../../assets/images/location3.png'
import waterfrontImage from '../../assets/images/location4.png'
import restaurantImage from '../../assets/images/location5.png'
import '../../assets/styles/LocationSection.css'

const locationCards = [
  { title: 'Walking Park', image: walkingParkImage },
  { title: 'School', image: schoolImage },
  { title: 'Tennis Club', image: tennisImage },
  { title: 'Waterfront', image: waterfrontImage },
  { title: 'Restaurant', image: restaurantImage },
]

function LocationArrow({ direction }) {
  const isLeft = direction === 'left'
  return (
    <svg
      className="location-card-nav-arrow"
      width="41"
      height="14"
      viewBox="0 0 41 14"
      aria-hidden="true"
      fill="none"
    >
      {isLeft ? (
        <path
          pathLength="100"
          d="M41 7H2M8 1L1 7l7 6"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      ) : (
        <path
          pathLength="100"
          d="M0 7h39M33 1l7 6-7 6"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      )}
    </svg>
  )
}

function LocationSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoverDirection, setHoverDirection] = useState('right')
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 })
  const sectionRef = useRef(null)
  const cardsRef = useRef(null)
  const scrollAnimationRef = useRef(null)

  const animateCardsScroll = (targetLeft) => {
    const cards = cardsRef.current
    if (!cards) return

    if (scrollAnimationRef.current) {
      cancelAnimationFrame(scrollAnimationRef.current)
    }

    const startLeft = cards.scrollLeft
    const distance = targetLeft - startLeft
    const duration = 1100
    let startTime

    const animate = (currentTime) => {
      startTime ??= currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      const easedProgress = 1 - Math.pow(1 - progress, 3)

      cards.scrollLeft = startLeft + distance * easedProgress

      if (progress < 1) {
        scrollAnimationRef.current = requestAnimationFrame(animate)
      } else {
        scrollAnimationRef.current = null
      }
    }

    scrollAnimationRef.current = requestAnimationFrame(animate)
  }

  const scrollCards = (direction) => {
    const cards = cardsRef.current
    if (!cards) return

    const edgeTolerance = 32
    const maxScrollLeft = cards.scrollWidth - cards.clientWidth
    let nextDirection = direction

    if (direction === 'left' && cards.scrollLeft <= edgeTolerance) {
      nextDirection = 'right'
      setHoverDirection('right')
    } else if (
      direction === 'right' &&
      cards.scrollLeft >= maxScrollLeft - edgeTolerance
    ) {
      nextDirection = 'left'
      setHoverDirection('left')
    }

    const cardWidth = cards.firstElementChild?.getBoundingClientRect().width ?? 0
    const cardGap = Number.parseFloat(getComputedStyle(cards).columnGap) || 0
    const scrollStep = cardWidth + cardGap
    const distance = nextDirection === 'left' ? -scrollStep : scrollStep
    const targetLeft = Math.max(
      0,
      Math.min(cards.scrollLeft + distance, maxScrollLeft),
    )

    animateCardsScroll(targetLeft)
  }

  const updateScrollDirection = (event) => {
    const cards = event.currentTarget
    const edgeTolerance = 32
    const maxScrollLeft = cards.scrollWidth - cards.clientWidth
    const isAtStart = cards.scrollLeft <= edgeTolerance
    const isAtEnd = cards.scrollLeft >= maxScrollLeft - edgeTolerance

    if (isAtEnd) setHoverDirection('left')
    else if (isAtStart) setHoverDirection('right')
  }

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
    const cards = cardsRef.current
    if (!section || !cards) return undefined

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (reduceMotion) return undefined

    const heroImage = section.querySelector('.location-image')

    const getScrollProgress = (bounds, viewportHeight) => {
      const travel = viewportHeight + bounds.height
      if (travel <= 0) return 0.5
      return Math.max(0, Math.min(1, (viewportHeight - bounds.top) / travel))
    }

    const updateParallax = () => {
      const viewportHeight = window.innerHeight

      if (heroImage) {
        const wrap = heroImage.parentElement
        const bounds = (wrap ?? heroImage).getBoundingClientRect()
        heroImage.style.setProperty(
          '--location-parallax',
          String(getScrollProgress(bounds, viewportHeight)),
        )
      }

      cards.querySelectorAll('.location-card img').forEach((image) => {
        const card = image.parentElement
        if (!card) return

        image.style.setProperty(
          '--card-parallax',
          String(getScrollProgress(card.getBoundingClientRect(), viewportHeight)),
        )
      })
    }

    updateParallax()
    gsap.ticker.add(updateParallax)
    window.addEventListener('resize', updateParallax)

    return () => {
      gsap.ticker.remove(updateParallax)
      window.removeEventListener('resize', updateParallax)
    }
  }, [])

  useEffect(
    () => () => {
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current)
      }
    },
    [],
  )

  return (
    <section
      ref={sectionRef}
      className={`location-section ${isVisible ? 'is-visible' : ''}`}
      id="location"
      aria-labelledby="location-title"
    >
      <h2 id="location-title" className="location-sr-only">
        Location
      </h2>

      <div className="location-hero">
        <div className="location-image-wrap">
          <img
            className="location-image"
            src={locationHero}
            alt="A resident arriving at a Dayim Developers property"
          />
        </div>

        <p className="location-kicker">
          <span>Building More Than Properties</span>
        </p>

        <p className="location-intro">
          <span className="location-intro-offset" aria-hidden="true" />
          Dayim Developers was founded with a vision to transform Pakistan&apos;s
          real estate industry through innovation, transparency, and
          uncompromising quality.
        </p>
      </div>

      <div className="location-footer" aria-hidden="true">
        <span />
        <p>Location</p>
      </div>

      <div
        ref={cardsRef}
        className="location-cards"
        aria-label="Nearby places"
        onScroll={updateScrollDirection}
      >
        {locationCards.map(({ title, image }, index) => (
          <article
            className="location-card"
            key={title}
            onMouseMove={(event) => {
              const bounds = event.currentTarget.getBoundingClientRect()
              setHoverPosition({
                x: event.clientX - bounds.left,
                y: event.clientY - bounds.top,
              })
            }}
          >
            <img src={image} alt={title} />
            <h3>{title}</h3>
            {index > 0 && (
              <button
                className={`location-card-nav location-card-nav--${hoverDirection}`}
                type="button"
                style={{
                  left: `${hoverPosition.x}px`,
                  top: `${hoverPosition.y}px`,
                }}
                aria-label={`Scroll cards ${hoverDirection}`}
                onClick={() => scrollCards(hoverDirection)}
              >
                <span className="location-card-nav-icon" aria-hidden="true">
                  <LocationArrow direction={hoverDirection} />
                </span>
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

export default LocationSection
