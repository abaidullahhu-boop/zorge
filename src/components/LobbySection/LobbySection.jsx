import { useEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'
import lobbyBg from '../../assets/images/mission.png'
import '../../assets/styles/LobbySection.css'

function LobbySection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)
  const slideRef = useRef(null)
  const imageRef = useRef(null)
  const contentRef = useRef(null)

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
    const image = imageRef.current
    const content = contentRef.current
    if (!section || !slide) return undefined

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(slide, { y: 0, clearProps: 'transform' })
      gsap.set([image, content].filter(Boolean), {
        clearProps: 'transform,opacity',
      })
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

      // Parallax across the pin + cover so the lobby image stays visible
      // under advantages (no fade-to-black handoff).
      if (image) {
        gsap.fromTo(
          image,
          { y: '0svh', force3D: true },
          {
            y: '-10svh',
            ease: 'none',
            force3D: true,
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        )
      }

      if (content) {
        gsap.fromTo(
          content,
          { y: '10svh', force3D: true },
          {
            y: '-10svh',
            ease: 'none',
            force3D: true,
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        )
      }
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`lobby-section ${isVisible ? 'is-visible' : ''}`}
      id="lobby"
      aria-labelledby="lobby-title"
    >
      <div className="lobby-sticky">
        <div className="lobby-slide" ref={slideRef}>
          <picture className="lobby-image" ref={imageRef}>
            <img
              src={lobbyBg}
              alt=""
              width="2016"
              height="1484"
              draggable="false"
            />
          </picture>

          <div className="lobby-content" ref={contentRef}>
            <div className="lobby-title-wrap">
              <h2 id="lobby-title" className="lobby-title">
                <span className="lobby-title-line">Our Vision</span>
                <span className="lobby-title-line">Our Mission</span>
              </h2>
            </div>

            <div className="lobby-copy-row">
              <p className="lobby-copy">
                Our mission is to develop high-quality residential and commercial
                communities that exceed expectations in design, construction, and
                customer experience. Our purpose extends beyond constructing
                buildings—we create modern lifestyles, sustainable communities,
                and investment opportunities that shape a better future.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LobbySection
