import { Fragment, useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import fitness1 from '../../assets/images/fitness-1.webp'
import fitness2 from '../../assets/images/fitness-2.webp'
import fitness3 from '../../assets/images/fitness-3.webp'
import fitness4 from '../../assets/images/fitness-4.webp'
import fitness5 from '../../assets/images/fitness-5.webp'
import fitness6 from '../../assets/images/fitness-6.webp'
import fitness7 from '../../assets/images/fitness-7.webp'
import infrastructureHero from '../../assets/images/infrastructure-hero.webp'
import '../../assets/styles/FitnessSection.css'

function ParallaxImage({ src, width, height, objectPosition }) {
  return (
    <div className="fitness-parallax">
      <img
        src={src}
        alt=""
        width={width}
        height={height}
        draggable="false"
        style={objectPosition ? { objectPosition } : undefined}
      />
    </div>
  )
}

function formatBeds(beds) {
  if (beds == null) return null
  if (beds === 0) return 'Studio layout'
  return beds === 1 ? '1 Bedroom' : `${beds} Bedrooms`
}

function interiorLabels(images = []) {
  return images
    .map((image) => image.label)
    .filter((label) => label && /[A-Za-z]/.test(label) && !/^IMG/i.test(label))
}

function FitnessSection({
  variant = 'default',
  scrollContainerRef = null,
  project = null,
}) {
  const isProjectVariant = variant === 'project'
  const units = project?.units ?? []
  const showUnits = isProjectVariant && units.length > 0
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)
  const stickyRef = useRef(null)
  const trackRef = useRef(null)
  const infraTitleRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const sticky = stickyRef.current
    if (!section || !sticky) return undefined

    // Observe the sticky viewport — not the tall scroll section. Section height
    // grows with the horizontal track (incl. infra hero), so a % threshold on
    // the section itself may never fire while advantages is still on screen.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0, rootMargin: '0px' },
    )

    observer.observe(sticky)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    const sticky = stickyRef.current
    const track = trackRef.current
    if (!section || !sticky || !track) return undefined

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const scroller = scrollContainerRef?.current ?? undefined
    const scrollTriggerBase = scroller ? { scroller } : {}

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(track, { x: 0, clearProps: 'transform' })
        return
      }

      // Mobile: slight vertical climb like other sections.
      ScrollTrigger.matchMedia({
        '(max-width: 980px)': () => {
          const getLift = () => Math.min(window.innerHeight * 0.2, 180)

          gsap.fromTo(
            sticky,
            { y: getLift, force3D: true },
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

          track.querySelectorAll('.fitness-parallax').forEach((frame) => {
            const img = frame.querySelector('img')
            if (!img) return

            gsap.fromTo(
              img,
              { scale: 1.18 },
              {
                scale: 1,
                ease: 'none',
                force3D: true,
                transformOrigin: '50% 50%',
                scrollTrigger: {
                  ...scrollTriggerBase,
                  trigger: frame,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              },
            )
          })
        },
        '(min-width: 981px)': () => {
          // Desktop: no vertical climb — content enters from the right
          // over the last advantages card via the leading transparent spacer.
          gsap.set(sticky, { y: 0, clearProps: 'transform' })

          const getScrollDistance = () =>
            Math.max(0, track.scrollWidth - window.innerWidth)

          // Extra viewport keeps the infra hero fully pinned while the
          // Restaurant panel covers it (CSS sticky only stays put while
          // section height remains above one viewport).
          const getInfraPin = () =>
            isProjectVariant ? 0 : window.innerHeight

          const syncSectionHeight = () => {
            section.style.setProperty(
              '--fitness-scroll',
              `${getScrollDistance() + window.innerHeight + getInfraPin()}px`,
            )
          }

          syncSectionHeight()

          const scrollTween = gsap.to(track, {
            x: () => -getScrollDistance(),
            ease: 'none',
            force3D: true,
            scrollTrigger: {
              ...scrollTriggerBase,
              trigger: section,
              start: 'top top',
              end: () => `+=${getScrollDistance()}`,
              scrub: true,
              invalidateOnRefresh: true,
              onRefresh: syncSectionHeight,
            },
          })

          // Each image zooms + drifts as it crosses the viewport during
          // the horizontal scrub (containerAnimation ties it to track x).
          track.querySelectorAll('.fitness-parallax').forEach((frame) => {
            const img = frame.querySelector('img')
            if (!img) return

            gsap.fromTo(
              img,
              { scale: 1.22, xPercent: 0 },
              {
                scale: 1,
                xPercent: -14,
                ease: 'none',
                force3D: true,
                transformOrigin: '50% 50%',
                scrollTrigger: {
                  ...scrollTriggerBase,
                  trigger: frame,
                  containerAnimation: scrollTween,
                  start: 'left 95%',
                  end: 'right 5%',
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              },
            )
          })

          // Infrastructure streetscape: very slight pan while it enters + stays pinned.
          const infraHero = track.querySelector('.fitness-infra-hero')
          const infraImg = infraHero?.querySelector('.fitness-infra-hero-image img')
          const infraTitle = infraTitleRef.current

          if (infraImg) {
            gsap.fromTo(
              infraImg,
              { yPercent: 4 },
              {
                yPercent: -4,
                ease: 'none',
                force3D: true,
                transformOrigin: '50% 50%',
                scrollTrigger: {
                  ...scrollTriggerBase,
                  trigger: section,
                  start: () =>
                    `top+=${getScrollDistance() - window.innerWidth * 0.85} top`,
                  end: () =>
                    `+=${window.innerWidth * 0.85 + getInfraPin()}`,
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              },
            )
          }

          if (infraHero && infraTitle) {
            gsap.fromTo(
              infraTitle,
              { opacity: 0 },
              {
                opacity: 1,
                ease: 'none',
                scrollTrigger: {
                  ...scrollTriggerBase,
                  trigger: infraHero,
                  containerAnimation: scrollTween,
                  start: 'left 80%',
                  end: 'left 20%',
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              },
            )
          }

          return () => {
            gsap.set(track, { x: 0, clearProps: 'transform' })
            if (infraImg) gsap.set(infraImg, { clearProps: 'transform' })
            if (infraTitle) gsap.set(infraTitle, { clearProps: 'opacity' })
            section.style.removeProperty('--fitness-scroll')
          }
        },
      })
    }, section)

    return () => ctx.revert()
  }, [isProjectVariant, scrollContainerRef, showUnits])

  return (
    <section
      ref={sectionRef}
      className={[
        'fitness-section',
        isProjectVariant ? 'fitness-section--project' : '',
        showUnits ? 'fitness-section--units' : '',
        isVisible ? 'is-visible' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      id={showUnits ? 'units' : 'fitness'}
      aria-labelledby="fitness-title"
    >
      <div className="fitness-sticky" ref={stickyRef}>
        <div className="fitness-track" ref={trackRef}>
          <div className="fitness-spacer fitness-desktop-only" aria-hidden="true" />

          <div className="fitness-panel fitness-panel--title">
            <h2 id="fitness-title" className="fitness-title">
              {showUnits ? (
                <>
                  <span className="fitness-title-line">UNIT</span>
                  <span className="fitness-title-line">INFORMATION</span>
                </>
              ) : (
                <>
                  <span className="fitness-title-line">WHY CHOOSE</span>
                  <span className="fitness-title-line">DAYIM</span>
                  <span className="fitness-title-line">DEVELOPERS?</span>
                </>
              )}
            </h2>
          </div>

          {showUnits
            ? units.map((unit, index) => {
                const hero = unit.images?.[0]
                const secondary = unit.images?.[1]
                const tertiary = unit.images?.[2]
                const beds = formatBeds(unit.beds)
                const interiors = interiorLabels(unit.images)

                return (
                  <Fragment key={unit.id}>
                    <div
                      className="fitness-gap fitness-gap--1 fitness-desktop-only"
                      aria-hidden="true"
                    />

                    {hero ? (
                      <div className="fitness-panel fitness-panel--image-6">
                        <ParallaxImage
                          src={hero.src}
                          width={847}
                          height={800}
                          objectPosition="50% 40%"
                        />
                      </div>
                    ) : null}

                    <div className="fitness-panel fitness-panel--text-3 fitness-panel--align-end">
                      <div className="fitness-unit">
                        <p className="fitness-unit-index">
                          {String(index + 1).padStart(2, '0')} /{' '}
                          {String(units.length).padStart(2, '0')}
                        </p>
                        <h3 className="fitness-unit-name">
                          {unit.label ?? unit.type}
                        </h3>
                        <p className="fitness-unit-type">{unit.type}</p>
                        <dl className="fitness-unit-facts">
                          <div>
                            <dt>Area</dt>
                            <dd>{unit.area}</dd>
                          </div>
                          {beds ? (
                            <div>
                              <dt>Layout</dt>
                              <dd>{beds}</dd>
                            </div>
                          ) : null}
                          <div>
                            <dt>Status</dt>
                            <dd>{unit.status}</dd>
                          </div>
                          {interiors.length ? (
                            <div>
                              <dt>Interiors</dt>
                              <dd>{interiors.join(' · ')}</dd>
                            </div>
                          ) : null}
                        </dl>
                      </div>
                    </div>

                    {secondary ? (
                      <div className="fitness-mobile-pair fitness-mobile-only">
                        {[secondary, tertiary]
                          .filter(Boolean)
                          .map((image) => (
                            <div
                              key={`${unit.id}-mobile-${image.alt}`}
                              className="fitness-mobile-pair-item"
                            >
                              <ParallaxImage
                                src={image.src}
                                width={250}
                                height={342}
                              />
                            </div>
                          ))}
                      </div>
                    ) : null}

                    {secondary ? (
                      <>
                        <div
                          className="fitness-gap fitness-gap--1 fitness-desktop-only"
                          aria-hidden="true"
                        />
                        <div className="fitness-panel fitness-panel--image-3 fitness-desktop-only">
                          <ParallaxImage
                            src={secondary.src}
                            width={350}
                            height={420}
                          />
                        </div>
                      </>
                    ) : null}

                    {tertiary ? (
                      <div className="fitness-panel fitness-panel--image-3 fitness-panel--stack fitness-desktop-only">
                        <div className="fitness-desktop-only">
                          <ParallaxImage
                            src={tertiary.src}
                            width={360}
                            height={420}
                          />
                        </div>
                        {unit.images?.[3] ? (
                          <p className="fitness-copy fitness-copy--after-image">
                            {unit.images[3].label}
                          </p>
                        ) : null}
                      </div>
                    ) : null}
                  </Fragment>
                )
              })
            : (
              <>
          <div
            className="fitness-gap fitness-gap--1 fitness-desktop-only"
            aria-hidden="true"
          />

          <div className="fitness-panel fitness-panel--image-6">
            <ParallaxImage
              src={fitness1}
              width={847}
              height={800}
              objectPosition="80% 20%"
            />
          </div>

          <div className="fitness-panel fitness-panel--text-3 fitness-panel--align-end">
            <p className="fitness-copy">
              Choosing Dayim Developers means choosing a partner committed to
              your future. Founded on dedication, vision, and integrity, our
              leadership brings years of industry experience and a passion for
              excellence.
            </p>
          </div>

          <div
            className="fitness-gap fitness-gap--1 fitness-desktop-only"
            aria-hidden="true"
          />

          <div className="fitness-panel fitness-panel--image-3 fitness-desktop-only">
            <ParallaxImage src={fitness2} width={350} height={420} />
          </div>

          <div className="fitness-mobile-pair fitness-mobile-only">
            <div className="fitness-mobile-pair-item">
              <ParallaxImage src={fitness3} width={250} height={342} />
            </div>
            <div className="fitness-mobile-pair-item">
              <ParallaxImage src={fitness2} width={250} height={342} />
            </div>
          </div>

          <div className="fitness-panel fitness-panel--image-3 fitness-panel--stack">
            <div className="fitness-desktop-only">
              <ParallaxImage src={fitness3} width={360} height={420} />
            </div>
            <p className="fitness-copy fitness-copy--after-image">
              Every investment is backed by honest communication, clear
              processes, and ethical business practices—complete transparency
              in every transaction.
            </p>
          </div>

          <div
            className="fitness-gap fitness-gap--2 fitness-desktop-only"
            aria-hidden="true"
          />

          <div className="fitness-panel fitness-panel--text-3 fitness-panel--middle">
            <p className="fitness-copy fitness-copy--large">
              We create secure and rewarding investment opportunities, and
              build sustainable communities that enhance modern lifestyles.
            </p>
          </div>

          <div
            className="fitness-gap fitness-gap--1 fitness-desktop-only"
            aria-hidden="true"
          />

          <div className="fitness-panel fitness-panel--image-6">
            <ParallaxImage
              src={fitness4}
              width={720}
              height={900}
              objectPosition="20% 0%"
            />
          </div>

          <div className="fitness-panel fitness-panel--group-8">
            <div className="fitness-group-text">
              <p className="fitness-copy">
                From your first inquiry to project handover and beyond, we
                prioritize your satisfaction with responsive, personalized
                service.
              </p>
            </div>
            <div className="fitness-group-image">
              <ParallaxImage src={fitness5} width={590} height={420} />
            </div>
          </div>

          <div
            className="fitness-gap fitness-gap--1 fitness-desktop-only"
            aria-hidden="true"
          />

          <div className="fitness-panel fitness-panel--image-3 fitness-desktop-only">
            <ParallaxImage src={fitness6} width={350} height={420} />
          </div>

          <div className="fitness-panel fitness-panel--image-8">
            <ParallaxImage
              src={fitness7}
              width={960}
              height={680}
              objectPosition="50% 20%"
            />
          </div>

          <div className="fitness-panel fitness-panel--text-3 fitness-panel--align-end">
            <p className="fitness-copy fitness-copy--large">
              Dayim Signature Apartments brings together contemporary
              architecture, smart planning, and lifestyle-focused amenities
              designed for today&apos;s families and investors.
            </p>
          </div>

          <div className="fitness-panel fitness-panel--image-3 fitness-mobile-only">
            <ParallaxImage src={fitness6} width={250} height={342} />
          </div>
              </>
            )}

          {isProjectVariant ? null : (
            <div className="fitness-infra-hero fitness-desktop-only">
              <div className="fitness-infra-hero-image">
                <img
                  src={infrastructureHero}
                  alt=""
                  width="2016"
                  height="1092"
                  draggable="false"
                />
              </div>
            </div>
          )}
        </div>

        {isProjectVariant ? null : (
          <div
            className="fitness-infra-title fitness-desktop-only"
            ref={infraTitleRef}
            aria-hidden="true"
          >
            <p className="fitness-infra-title-text">OUR STANDARDS</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default FitnessSection
