import { useEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'
import DeveloperOverview from './DeveloperOverview'
import '../../assets/styles/ProjectsSection.css'

function ProjectsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)
  const slideRef = useRef(null)

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
      { threshold: 0.12 },
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
            scrub: 0.45,
            invalidateOnRefresh: true,
          },
        },
      )
    }, section)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const isTouchLayout = window.matchMedia('(max-width: 980px)').matches
    if (reduceMotion || isTouchLayout) return undefined

    const getScrollProgress = (bounds, viewportHeight) => {
      const travel = viewportHeight + bounds.height
      if (travel <= 0) return 0.5
      return Math.max(0, Math.min(1, (viewportHeight - bounds.top) / travel))
    }

    const updateParallax = () => {
      section.querySelectorAll('.projects-parallax-image').forEach((image) => {
        const frame = image.closest('.projects-card-media')
        if (!frame) return

        image.style.setProperty(
          '--projects-parallax',
          String(getScrollProgress(frame.getBoundingClientRect(), window.innerHeight)),
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

  return (
    <section
      ref={sectionRef}
      className={`projects-section${isVisible ? ' is-visible' : ''}`}
      id="projects"
      aria-labelledby="projects-title"
    >
      <h2 id="projects-title" className="projects-sr-only">
        Dayim Developers Projects
      </h2>
      <div className="projects-slide" ref={slideRef}>
        <div className="projects-inner">
          <DeveloperOverview />
        </div>
      </div>
    </section>
  )
}

export default ProjectsSection
