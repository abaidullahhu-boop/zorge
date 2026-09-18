import { useEffect, useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  ProjectEnquire,
  ProjectHero,
  ProjectNav,
  ProjectOverview,
} from '../components/ProjectsSection/ProjectDetail'
import ProjectStorySection from '../components/ProjectsSection/ProjectStorySection'
import TimeSection from '../components/TimeSection/TimeSection'
import ServicesSection from '../components/ServicesSection/ServicesSection'
import Footer from '../components/Footer/Footer'
import { getProjectById, getProjectInventoryPath } from '../data/projects'
import { gsap, ScrollTrigger } from '../lib/gsap'
import '../assets/styles/ProjectsSection.css'
import './ProjectPage.css'

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function ProjectPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const project = getProjectById(projectId)
  const pageRef = useRef(null)
  const leavingRef = useRef(false)
  const leaveTargetRef = useRef('projects')
  const closeRef = useRef(() => {})
  const pendingScrollRef = useRef(location.state?.scrollTo ?? null)
  const [motion, setMotion] = useState(() => ({
    projectId,
    leaving: false,
    settled: prefersReducedMotion(),
  }))

  if (location.state?.scrollTo) {
    pendingScrollRef.current = location.state.scrollTo
  }

  if (motion.projectId !== projectId) {
    setMotion({
      projectId,
      leaving: false,
      settled: prefersReducedMotion(),
    })
  }

  const { leaving, settled } = motion

  const openProjectsOverlay = () => {
    window.requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent('dayim:projects'))
    })
  }

  const revealHomeLanding = () => {
    window.setTimeout(() => {
      window.__dayimLenis?.start?.()
      window.dispatchEvent(new CustomEvent('dayim:home'))
    }, 0)
  }

  const leaveProject = (target = 'projects') => {
    if (leavingRef.current) return
    leavingRef.current = true
    leaveTargetRef.current = target

    if (prefersReducedMotion()) {
      navigate('/')
      if (target === 'projects') openProjectsOverlay()
      else revealHomeLanding()
      return
    }

    setMotion((current) => ({
      ...current,
      leaving: true,
      settled: false,
    }))
  }

  const closeToProjects = () => leaveProject('projects')
  const closeToHome = () => leaveProject('home')

  useEffect(() => {
    closeRef.current = closeToProjects
  })

  useEffect(() => {
    if (!project) return undefined

    const previousTitle = document.title
    document.title = `${project.title} · Dayim Developers`
    return () => {
      document.title = previousTitle
    }
  }, [project])

  useEffect(() => {
    if (!project) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.__dayimLenis?.stop?.()

    return () => {
      document.body.style.overflow = previousOverflow
      window.__dayimLenis?.start?.()
    }
  }, [project])

  useEffect(() => {
    if (!project) return undefined

    leavingRef.current = false
    if (pageRef.current) pageRef.current.scrollTop = 0
  }, [project, projectId])

  useEffect(() => {
    if (!settled || !project) return undefined

    const frame = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })

    return () => window.cancelAnimationFrame(frame)
  }, [settled, project])

  // Back panels drift up slightly while the next section slides over them.
  // Desktop only — stacked scroll is disabled below 981px.
  useEffect(() => {
    if (!settled || !project || prefersReducedMotion()) return undefined

    const scroller = pageRef.current
    if (!scroller) return undefined

    const mq = window.matchMedia('(min-width: 981px)')
    const pairs = [
      ['.project-stack--hero', '.project-hero'],
      ['.project-stack--overview', '.project-overview'],
      ['.architecture-materials-stack', '.architecture-materials'],
    ]

    let ctx = null

    const setup = () => {
      ctx?.revert()
      ctx = null
      if (!mq.matches) return

      ctx = gsap.context(() => {
        pairs.forEach(([frameSel, panelSel]) => {
          const frame = scroller.querySelector(frameSel)
          const panel = scroller.querySelector(panelSel)
          if (!frame || !panel) return

          gsap.to(panel, {
            y: () => -window.innerHeight * 0.14,
            ease: 'none',
            force3D: true,
            scrollTrigger: {
              scroller,
              trigger: frame,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
              invalidateOnRefresh: true,
            },
          })
        })
      }, scroller)
    }

    setup()
    mq.addEventListener('change', setup)

    return () => {
      mq.removeEventListener('change', setup)
      ctx?.revert()
    }
  }, [settled, project, projectId])

  useEffect(() => {
    if (!project) return undefined

    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return
      if (pageRef.current?.querySelector('.projects-lightbox')) return
      event.preventDefault()
      closeRef.current()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [project])

  const scrollToId = (id) => {
    const root = pageRef.current
    const target = root?.querySelector(`#${CSS.escape(id)}`)
    if (!root || !target) return

    const nav = root.querySelector('.project-nav')
    const offset = nav instanceof HTMLElement ? nav.getBoundingClientRect().height : 0
    const nextTop =
      target.getBoundingClientRect().top -
      root.getBoundingClientRect().top +
      root.scrollTop -
      offset

    root.scrollTo({
      top: Math.max(0, nextTop),
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }

  useEffect(() => {
    const scrollTo = pendingScrollRef.current
    if (!scrollTo || !project || !settled) return undefined

    pendingScrollRef.current = null
    if (location.state?.scrollTo) {
      navigate('.', { replace: true, state: {} })
    }

    const frame = window.requestAnimationFrame(() => {
      scrollToId(scrollTo)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [project, settled, location.state, navigate])

  if (!project) {
    return <Navigate to="/" replace />
  }

  const handleAnimationEnd = (event) => {
    if (event.target !== pageRef.current) return

    if (leavingRef.current) {
      navigate('/')
      if (leaveTargetRef.current === 'projects') openProjectsOverlay()
      else revealHomeLanding()
      return
    }

    setMotion((current) => ({ ...current, settled: true }))
  }

  const handleNavigate = (id) => {
    if (id === 'plans') {
      navigate(getProjectInventoryPath(project.id))
      return
    }

    scrollToId(id)
  }

  const scrollToTop = () => {
    pageRef.current?.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }

  return (
    <main
      className={[
        'project-page',
        settled ? 'is-settled' : '',
        leaving ? 'is-leaving' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      id="project-page"
      ref={pageRef}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      data-lenis-prevent
      data-lenis-prevent-wheel
      data-lenis-prevent-touch
      onAnimationEnd={handleAnimationEnd}
    >
      <ProjectNav
        key={`nav-${project.id}`}
        project={project}
        scrollRootRef={pageRef}
        onBack={closeToProjects}
        onHome={closeToHome}
        onNavigate={handleNavigate}
      />
      <ProjectHero project={project} onNavigate={handleNavigate} />
      <ProjectOverview project={project} />

      <TimeSection
        variant="project"
        project={project}
        scrollContainerRef={pageRef}
      />
      <ProjectStorySection project={project} scrollContainerRef={pageRef} />
      <ServicesSection
        variant="project"
        project={project}
        scrollContainerRef={pageRef}
      />

      <ProjectEnquire project={project} />
      <Footer onScrollTop={scrollToTop} />
    </main>
  )
}

export default ProjectPage
