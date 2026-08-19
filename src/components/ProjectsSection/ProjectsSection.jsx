import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { getProjectById } from '../../data/projects'
import DeveloperOverview from './DeveloperOverview'
import ProjectDetail from './ProjectDetail'
import '../../assets/styles/ProjectsSection.css'

const DETAIL_TRANSITION_MS = 820

function ProjectsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [view, setView] = useState('developer')
  const [selectedId, setSelectedId] = useState(null)
  const [activeTab, setActiveTab] = useState('about')
  const [detailMotion, setDetailMotion] = useState('idle')
  const sectionRef = useRef(null)
  const slideRef = useRef(null)
  const closeTimeoutRef = useRef(null)

  const selectedProject = selectedId ? getProjectById(selectedId) : null

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

  const scrollToSectionTop = useCallback(() => {
    const section = sectionRef.current
    if (!section) return
    window.__dayimLenis?.resize()
    window.dispatchEvent(
      new CustomEvent('dayim:scroll-to', { detail: { el: section } }),
    )
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('is-projects-detail', view === 'project')
    ScrollTrigger.refresh()

    if (view !== 'project') {
      return () => document.documentElement.classList.remove('is-projects-detail')
    }

    scrollToSectionTop()
    const raf = window.requestAnimationFrame(scrollToSectionTop)

    return () => {
      window.cancelAnimationFrame(raf)
      document.documentElement.classList.remove('is-projects-detail')
    }
  }, [view, scrollToSectionTop])

  useEffect(() => {
    const section = sectionRef.current
    const slide = slideRef.current
    if (!section || !slide) return undefined

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(slide, { y: 0, clearProps: 'transform' })
      return undefined
    }

    if (view === 'project') {
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
  }, [view])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (reduceMotion) return undefined

    const getScrollProgress = (bounds, viewportHeight) => {
      const travel = viewportHeight + bounds.height
      if (travel <= 0) return 0.5
      return Math.max(0, Math.min(1, (viewportHeight - bounds.top) / travel))
    }

    const updateParallax = () => {
      section.querySelectorAll('.projects-parallax-image').forEach((image) => {
        const frame = image.closest(
          '.projects-card-media, .projects-detail-image, .projects-plan-item',
        )
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
  }, [view, activeTab])

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (detailMotion !== 'entering') return undefined

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (reduceMotion) {
      setDetailMotion('idle')
      return undefined
    }

    const enterTimeout = window.setTimeout(() => {
      setDetailMotion('idle')
    }, DETAIL_TRANSITION_MS)

    return () => window.clearTimeout(enterTimeout)
  }, [detailMotion])

  const openProject = useCallback((id) => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    scrollToSectionTop()
    setSelectedId(id)
    setActiveTab('about')
    setDetailMotion('entering')
    setView('project')
  }, [scrollToSectionTop])

  useEffect(() => {
    const handleOpenProject = (event) => {
      const { id } = event.detail ?? {}
      if (id) openProject(id)
    }
    window.addEventListener('dayim:open-project', handleOpenProject)
    return () => window.removeEventListener('dayim:open-project', handleOpenProject)
  }, [openProject])

  const goBack = useCallback(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (reduceMotion) {
      setView('developer')
      setSelectedId(null)
      setActiveTab('about')
      setDetailMotion('idle')
    } else {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current)
      }
      setDetailMotion('exiting')
      closeTimeoutRef.current = window.setTimeout(() => {
        setView('developer')
        setSelectedId(null)
        setActiveTab('about')
        setDetailMotion('idle')
        closeTimeoutRef.current = null
      }, DETAIL_TRANSITION_MS)
    }

    const section = sectionRef.current
    if (!section) return
    window.dispatchEvent(
      new CustomEvent('dayim:scroll-to', { detail: { el: section } }),
    )
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`projects-section${isVisible ? ' is-visible' : ''}${view === 'project' ? ' is-detail' : ''}`}
      id="projects"
      aria-labelledby="projects-title"
    >
      <h2 id="projects-title" className="projects-sr-only">
        {view === 'developer' ? 'Dayim Developers Projects' : selectedProject?.title}
      </h2>
      <div className="projects-slide" ref={slideRef}>
        <div className="projects-inner">
          <div
            className="projects-overview-layer"
            aria-hidden={Boolean(selectedProject)}
            inert={selectedProject ? true : undefined}
          >
            <DeveloperOverview onSelectProject={openProject} />
          </div>
          {selectedProject ? (
            <div className={`projects-detail-shell is-${detailMotion}`}>
              <ProjectDetail
                project={selectedProject}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onBack={goBack}
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default ProjectsSection
