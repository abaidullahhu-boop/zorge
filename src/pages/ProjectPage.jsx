import { useEffect, useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  ProjectEnquire,
  ProjectHero,
  ProjectInventory,
  ProjectNav,
  ProjectOverview,
} from '../components/ProjectsSection/ProjectDetail'
import ProjectStorySection from '../components/ProjectsSection/ProjectStorySection'
import TimeSection from '../components/TimeSection/TimeSection'
import ServicesSection from '../components/ServicesSection/ServicesSection'
import Footer from '../components/Footer/Footer'
import { getProjectById, getProjectInventoryPath } from '../data/projects'
import { ScrollTrigger } from '../lib/gsap'
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

  const closeToProjects = () => {
    if (leavingRef.current) return
    leavingRef.current = true

    if (prefersReducedMotion()) {
      navigate('/')
      openProjectsOverlay()
      return
    }

    setMotion((current) => ({
      ...current,
      leaving: true,
      settled: false,
    }))
  }

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
      openProjectsOverlay()
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
        onNavigate={handleNavigate}
      />
      <ProjectHero project={project} onNavigate={handleNavigate} />
      <ProjectOverview project={project} />

      {project.id === 'dsa' ? (
        <>
          <TimeSection variant="project" scrollContainerRef={pageRef} />
          <ProjectStorySection scrollContainerRef={pageRef} />
          <ServicesSection variant="project" scrollContainerRef={pageRef} />
        </>
      ) : null}

      {project.id !== 'dsa' ? (
        <ProjectInventory
          key={project.id}
          project={project}
          includePlans={false}
          includeUnits
        />
      ) : null}

      <ProjectEnquire project={project} />
      <Footer onScrollTop={scrollToTop} />
    </main>
  )
}

export default ProjectPage
