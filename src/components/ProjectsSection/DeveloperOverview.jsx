import { useCallback, useState } from 'react'
import dayimLogo from '../../assets/images/dayim-logo.png'
import { DEVELOPER, projects } from '../../data/projects'

function ProjectCard({ project, onSelect }) {
  const [cta, setCta] = useState({ x: 0, y: 0, visible: false })

  const moveCta = useCallback((event) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    setCta({
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
      visible: true,
    })
  }, [])

  const hideCta = useCallback(() => {
    setCta((current) => ({ ...current, visible: false }))
  }, [])

  return (
    <button
      type="button"
      className="projects-card"
      onClick={() => onSelect(project.id)}
      aria-label={`View details for ${project.title}`}
    >
      <span
        className={`projects-card-media${cta.visible ? ' is-cta-active' : ''}`}
        onPointerMove={moveCta}
        onPointerEnter={moveCta}
        onPointerLeave={hideCta}
      >
        <img
          className="projects-parallax-image"
          src={project.image}
          alt=""
          draggable="false"
          loading="lazy"
        />
        <span
          className="projects-card-cta"
          aria-hidden="true"
          style={{
            '--cta-x': cta.x,
            '--cta-y': cta.y,
          }}
        >
          View project
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
      <span className="projects-card-body">
        <span className="projects-card-kicker">{project.short}</span>
        <span className="projects-card-title">{project.title}</span>
        <span className="projects-card-subtitle">{project.subtitle}</span>
      </span>
    </button>
  )
}

function DeveloperOverview({ onSelectProject }) {
  return (
    <div className="projects-overview">
      <div className="projects-intro-block">
        <div className="projects-intro-copy">
          <p className="projects-kicker">{DEVELOPER.tagline}</p>
          <h2 className="projects-heading" aria-hidden="true">
            {DEVELOPER.name}
          </h2>
          <p className="projects-intro">{DEVELOPER.description}</p>
          <p className="projects-story">{DEVELOPER.story}</p>
        </div>

        <div className="projects-logo-wrap">
          <img
            className="projects-logo"
            src={dayimLogo}
            alt="Dayim Developers"
            width={518}
            height={776}
            draggable="false"
            loading="lazy"
          />
        </div>
      </div>

      <div className="projects-grid-header">
        <h3 className="projects-grid-label">Our Projects</h3>
      </div>

      <div className="projects-grid" role="list">
        {projects.map((project) => (
          <div key={project.id} role="listitem">
            <ProjectCard project={project} onSelect={onSelectProject} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default DeveloperOverview
