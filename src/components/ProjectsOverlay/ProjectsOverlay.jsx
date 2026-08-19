import { useEffect } from 'react'
import { projects } from '../../data/projects'
import '../../assets/styles/ProjectsOverlay.css'

const ICONS = '/assets/images/icons.svg'

function ProjectsOverlay({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  const handleSelect = (id) => {
    onClose()
    window.setTimeout(() => {
      const section = document.querySelector('#projects')
      if (section) {
        window.dispatchEvent(
          new CustomEvent('dayim:scroll-to', { detail: { el: section } }),
        )
      }
      window.setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent('dayim:open-project', { detail: { id } }),
        )
      }, 400)
    }, 120)
  }

  return (
    <div
      className={`projects-overlay${open ? ' is-open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Our Projects"
      aria-hidden={!open}
      onClick={onClose}
    >
      <div
        className="projects-overlay__panel"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="projects-overlay__header">
          <p className="projects-overlay__kicker">Our Projects</p>
          <button
            className="projects-overlay__close"
            type="button"
            aria-label="Close"
            onClick={onClose}
          >
            <svg
              width="18"
              height="16"
              aria-hidden="true"
              viewBox="0 0 18 16"
            >
              <use href={`${ICONS}#close`} />
            </svg>
          </button>
        </header>

        <div className="projects-overlay__grid">
          {projects.map((project, i) => (
            <button
              key={project.id}
              type="button"
              className="projects-overlay__card"
              style={{ '--delay': `${i * 0.08}s` }}
              onClick={() => handleSelect(project.id)}
            >
              <span className="projects-overlay__card-img-wrap">
                <img
                  className="projects-overlay__card-img"
                  src={project.image}
                  alt=""
                  draggable="false"
                  loading="lazy"
                />
              </span>
              <span className="projects-overlay__card-body">
                <span className="projects-overlay__card-short">{project.short}</span>
                <span className="projects-overlay__card-title">{project.title}</span>
                <span className="projects-overlay__card-subtitle">{project.subtitle}</span>
                {project.about?.highlights?.length > 0 && (
                  <ul className="projects-overlay__card-highlights">
                    {project.about.highlights.slice(0, 3).map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                )}
                <span className="projects-overlay__card-cta" aria-hidden="true">
                  View Project
                  <svg viewBox="0 0 24 14" fill="none" aria-hidden="true">
                    <path
                      d="M0 7h22M16 1l7 6-7 6"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProjectsOverlay
