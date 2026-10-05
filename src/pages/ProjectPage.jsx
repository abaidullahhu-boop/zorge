import { useEffect, useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  ProjectEnquire,
  ProjectHero,
  ProjectNav,
  ProjectOverview,
} from '../components/ProjectsSection/ProjectDetail'
import ProjectStorySection from '../components/ProjectsSection/ProjectStorySection'
import ProjectRooftopSection from '../components/ProjectsSection/ProjectRooftopSection'
import TimeSection from '../components/TimeSection/TimeSection'
import ServicesSection from '../components/ServicesSection/ServicesSection'
import Footer from '../components/Footer/Footer'
import GallerySection from '../components/GallerySection/GallerySection'
import { getProjectGallery } from '../data/galleries'
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
  const projectGallery = project ? getProjectGallery(project.id) : null
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

  const openProjectsOverlay = (instant = false) => {
    const dispatch = () => {
      window.dispatchEvent(
        new CustomEvent('dayim:projects', { detail: { instant } }),
      )
    }

    // Instant prepare must win the same frame as leave — no home flash.
    if (instant) {
      dispatch()
      return
    }

    window.requestAnimationFrame(dispatch)
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

    // Prepare the destination under the sheet before it slides away,
    // so Home never flashes between project → all projects.
    if (target === 'home') revealHomeLanding()
    if (target === 'projects') openProjectsOverlay(true)

    if (prefersReducedMotion()) {
      navigate('/')
      if (target === 'projects') openProjectsOverlay(true)
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
      // All-projects is already open under the sheet — don't unlock scroll.
      if (leaveTargetRef.current === 'projects' && leavingRef.current) return
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
    // Hero only — overview keeps its bottom facts bar readable while pinned.
    // Translating overview up with overflow:hidden clips that white strip early.
    const pairs = [['.project-stack--hero', '.project-hero']]

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
      if (document.querySelector('.gallery-modal.is-open')) return
      event.preventDefault()
      closeRef.current()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [project])

  // Nav jumps skip pinned galleries. Smooth scroll would scrub every image
  // frame in the sections between here and the target before arriving.
  const jumpScrollerTo = (top) => {
    const root = pageRef.current
    if (!root) return
    root.scrollTop = Math.max(0, top)
    ScrollTrigger.update()
  }

  const scrollToId = (id) => {
    const root = pageRef.current
    const target = root?.querySelector(`#${CSS.escape(id)}`)
    if (!root || !target) return

    // Sticky panels report their stuck visual box via getBoundingClientRect,
    // so jumping back to Overview (and similar) from further down barely moves.
    // offsetTop is the in-flow layout position — where the section first pins.
    const frame =
      target.closest('.project-stack') ||
      target.closest('.time-section') ||
      target.closest('.architecture-section') ||
      target.closest('.services-section') ||
      target

    let top = 0
    let node = frame
    while (node && node !== root) {
      top += node.offsetTop
      node = node.offsetParent
    }

    if (node !== root) {
      top =
        frame.getBoundingClientRect().top -
        root.getBoundingClientRect().top +
        root.scrollTop
    }

    // Panels stick at top:0 and already pad under the fixed nav.
    jumpScrollerTo(top)
  }

  useEffect(() => {
    const scrollTo = pendingScrollRef.current
    if (!scrollTo || !project || !settled) return undefined

    pendingScrollRef.current = null
    if (location.state?.scrollTo) {
      navigate('.', { replace: true, state: {} })
    }

    const frame = window.requestAnimationFrame(() => {
      if (scrollTo === 'hero') {
        const root = pageRef.current
        if (root) root.scrollTop = 0
        ScrollTrigger.update()
        return
      }
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
      // Keep/restore all-projects under the sheet (already prepared on leave).
      if (leaveTargetRef.current === 'projects') openProjectsOverlay(true)
      else revealHomeLanding()
      return
    }

    setMotion((current) => ({ ...current, settled: true }))
  }

  const scrollToTop = () => {
    pageRef.current?.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }

  const handleNavigate = (id) => {
    if (id === 'plans') {
      navigate(getProjectInventoryPath(project.id))
      return
    }

    if (id === 'hero') {
      jumpScrollerTo(0)
      return
    }

    scrollToId(id)
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
      <ProjectHero
        project={project}
        onNavigate={handleNavigate}
        playReveal={!leaving}
      />
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
      <ProjectRooftopSection project={project} scrollContainerRef={pageRef} />
      {projectGallery ? (
        <GallerySection
          previewImages={projectGallery.previewImages}
          photoCount={projectGallery.photoCount}
          modalItems={projectGallery.modalItems}
          sectionId={`${project.id}-gallery`}
          modalId={`${project.id}-gallery-modal`}
          className="gallery-section--project"
          scrollContainerRef={pageRef}
        />
      ) : null}
      <ProjectEnquire project={project} />
      <Footer onScrollTop={scrollToTop} />
    </main>
  )
}

export default ProjectPage
