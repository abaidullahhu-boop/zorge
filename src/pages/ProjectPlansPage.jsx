import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import {
  ProjectNav,
} from '../components/ProjectsSection/ProjectDetail'
import ProjectInventoryBoard from '../components/ProjectsSection/ProjectInventoryBoard'
import Footer from '../components/Footer/Footer'
import { getProjectById, getProjectPath } from '../data/projects'
import '../assets/styles/ProjectsSection.css'
import './ProjectPage.css'

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function ProjectPlansPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const project = getProjectById(projectId)
  const pageRef = useRef(null)
  const leavingRef = useRef(false)
  const closeRef = useRef(() => {})
  const [motion, setMotion] = useState(() => ({
    projectId,
    leaving: false,
    settled: prefersReducedMotion(),
  }))

  if (motion.projectId !== projectId) {
    setMotion({
      projectId,
      leaving: false,
      settled: prefersReducedMotion(),
    })
  }

  const { leaving, settled } = motion

  const goToProject = (scrollTo = null) => {
    navigate(getProjectPath(projectId), {
      state: scrollTo ? { scrollTo } : undefined,
    })
  }

  const closeToProject = () => {
    if (leavingRef.current) return
    leavingRef.current = true

    if (prefersReducedMotion()) {
      goToProject()
      return
    }

    setMotion((current) => ({
      ...current,
      leaving: true,
      settled: false,
    }))
  }

  useEffect(() => {
    closeRef.current = closeToProject
  })

  useEffect(() => {
    if (!project) return undefined

    const previousTitle = document.title
    document.title = `${project.title} Inventory · Dayim Developers`
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
    if (!project) return undefined

    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return
      if (pageRef.current?.querySelector('.projects-lightbox')) return
      if (document.body.classList.contains('inventory-booking-open')) return
      event.preventDefault()
      closeRef.current()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [project])

  if (!project) {
    return <Navigate to="/" replace />
  }

  const handleAnimationEnd = (event) => {
    if (event.target !== pageRef.current) return

    if (leavingRef.current) {
      goToProject()
      return
    }

    setMotion((current) => ({ ...current, settled: true }))
  }

  const handleNavigate = (id) => {
    if (id === 'plans') {
      pageRef.current?.scrollTo({
        top: 0,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      })
      return
    }

    goToProject(id)
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
        'project-plans-page',
        settled ? 'is-settled' : '',
        leaving ? 'is-leaving' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      id="project-plans-page"
      ref={pageRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} inventory`}
      data-lenis-prevent
      data-lenis-prevent-wheel
      data-lenis-prevent-touch
      onAnimationEnd={handleAnimationEnd}
    >
      <ProjectNav
        key={`plans-nav-${project.id}`}
        project={project}
        scrollRootRef={pageRef}
        onBack={closeToProject}
        onNavigate={handleNavigate}
        activeId="plans"
        backLabel="Back to project"
      />

      <ProjectInventoryBoard key={`inventory-${project.id}`} project={project} />

      <Footer onScrollTop={scrollToTop} />
    </main>
  )
}

export default ProjectPlansPage
