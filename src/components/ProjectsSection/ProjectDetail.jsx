import { useEffect, useState } from 'react'
import { SITE_CONTACT } from '../../data/siteContact'

const MOBILE_MQ = '(max-width: 980px)'

const PROJECT_NAV = [
  { id: 'overview', label: 'Overview' },
  { id: 'daily-schedule', label: 'Journey' },
  { id: 'story', label: 'Floor Plan' },
  { id: 'services', label: 'Interiors' },
  { id: 'plans', label: 'Inventory' },
]

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_MQ).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ)
    const handleChange = () => setIsMobile(mq.matches)
    handleChange()
    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
  }, [])

  return isMobile
}

function getFloorImages(floor) {
  if (!floor) return []
  return floor.overview ? [floor.overview, ...floor.images] : floor.images
}

function isUsefulImageLabel(label) {
  if (!label) return false
  if (/^[\d\s]+$/.test(label)) return false
  if (/^IMG[_\s-]?\d+$/i.test(label)) return false
  if (/cut\s*out/i.test(label)) return false
  return /[A-Za-z]/.test(label)
}

function BackArrow() {
  return (
    <svg viewBox="0 0 24 14" fill="none" aria-hidden="true">
      <path
        d="M24 7H2M8 1 1 7l7 6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ProjectNav({
  project,
  scrollRootRef,
  onBack,
  onNavigate,
  activeId: activeIdProp = null,
  backLabel = 'All projects',
}) {
  const [scrolled, setScrolled] = useState(false)
  const [activeId, setActiveId] = useState(activeIdProp ?? 'overview')
  const navItems = PROJECT_NAV
  const lockActive = activeIdProp != null

  useEffect(() => {
    if (lockActive) setActiveId(activeIdProp)
  }, [lockActive, activeIdProp])

  useEffect(() => {
    const root = scrollRootRef?.current
    if (!root) return undefined

    const onScroll = () => {
      setScrolled(root.scrollTop > 40)
    }

    onScroll()
    root.addEventListener('scroll', onScroll, { passive: true })
    return () => root.removeEventListener('scroll', onScroll)
  }, [scrollRootRef])

  useEffect(() => {
    if (lockActive) return undefined

    const root = scrollRootRef?.current
    if (!root) return undefined

    const targets = navItems
      .map(({ id }) => root.querySelector(`#${id}`))
      .filter(Boolean)
    if (!targets.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        root,
        rootMargin: '-18% 0px -62% 0px',
        threshold: [0, 0.15, 0.4, 0.7],
      },
    )

    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [scrollRootRef, project.id, navItems, lockActive])

  return (
    <nav
      className={`project-nav${scrolled ? ' is-scrolled' : ''}`}
      aria-label={`${project.title} sections`}
    >
      <div className="project-nav__bar">
        <button
          type="button"
          className="project-nav__back"
          onClick={onBack}
          aria-label={backLabel}
        >
          <BackArrow />
          <span>{backLabel}</span>
        </button>

        <p className="project-nav__brand">{project.brand ?? project.short}</p>

        <div className="project-nav__links" role="list">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              role="listitem"
              className={`project-nav__link${activeId === item.id ? ' is-active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="project-nav__cta"
          onClick={() => onNavigate('enquire')}
        >
          Enquire
        </button>
      </div>
    </nav>
  )
}

export function ProjectHero({ project, onNavigate }) {
  return (
    <header className="project-hero">
      <div className="project-hero__media">
        <img src={project.image} alt="" draggable="false" />
      </div>
      <div className="project-hero__veil" />

      <div className="project-hero__content">
        <p className="project-hero__kicker">A PROJECT BY DAYIM DEVELOPERS</p>
        <h1 className="project-hero__title">{project.title}</h1>
        <p className="project-hero__location">{project.subtitle}</p>

        <div className="project-hero__actions">
          <button
            type="button"
            className="project-hero__btn project-hero__btn--solid"
            onClick={() => onNavigate('enquire')}
          >
            Enquire now
          </button>
          <button
            type="button"
            className="project-hero__btn project-hero__btn--ghost"
            onClick={() => onNavigate('plans')}
          >
            View inventory
          </button>
          {project.mapsUrl ? (
            <a
              className="project-hero__btn project-hero__btn--ghost"
              href={project.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open map
            </a>
          ) : null}
        </div>
      </div>
    </header>
  )
}

export function ProjectOverview({ project }) {
  const floors = project.plan.floors ?? []
  const facts = [
    { label: 'Location', value: project.subtitle },
    floors.length
      ? { label: 'Floors', value: `${floors.length} levels` }
      : null,
    {
      label: 'Typologies',
      value: project.units.map((unit) => unit.label ?? unit.type).join(' · '),
    },
    { label: 'Status', value: 'Available' },
  ].filter(Boolean)

  return (
    <section className="project-overview" id="overview" aria-labelledby="overview-title">
      <div className="project-overview__grid">
        <div className="project-overview__intro">
          <p className="project-kicker">The project</p>
          <h2 id="overview-title" className="project-heading">
            A landmark address, planned with care
          </h2>
          <p className="project-overview__text">{project.about.description}</p>
        </div>

        <ul className="project-overview__highlights">
          {project.about.highlights.map((item, index) => (
            <li key={item}>
              <span className="project-overview__index">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <dl className="project-facts">
        {facts.map((fact) => (
          <div key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function ProjectLightbox({ lightbox, onClose, onStep }) {
  const item = lightbox?.items[lightbox.index] ?? null
  if (!item) return null

  return (
    <div
      className="projects-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
      onClick={onClose}
    >
      <button
        type="button"
        className="projects-lightbox-close"
        aria-label="Close image"
        onClick={onClose}
      >
        Close
      </button>
      {lightbox.items.length > 1 ? (
        <>
          <button
            type="button"
            className="projects-lightbox-nav is-prev"
            aria-label="Previous image"
            onClick={(event) => {
              event.stopPropagation()
              onStep(-1)
            }}
          >
            Previous
          </button>
          <button
            type="button"
            className="projects-lightbox-nav is-next"
            aria-label="Next image"
            onClick={(event) => {
              event.stopPropagation()
              onStep(1)
            }}
          >
            Next
          </button>
        </>
      ) : null}
      <figure
        className="projects-lightbox-figure"
        onClick={(event) => event.stopPropagation()}
      >
        <img src={item.src} alt={item.alt} draggable="false" />
        {item.label || lightbox.title ? (
          <figcaption>
            {lightbox.title && item.label
              ? `${lightbox.title} · ${item.label}`
              : (item.label ?? lightbox.title)}
            {lightbox.items.length > 1
              ? ` · ${lightbox.index + 1} / ${lightbox.items.length}`
              : ''}
          </figcaption>
        ) : null}
      </figure>
    </div>
  )
}

export function ProjectInventory({
  project,
  includePlans = true,
  includeUnits = true,
}) {
  const isMobile = useIsMobile()
  const floors = project.plan.floors ?? null
  const [selectedFloorId, setSelectedFloorId] = useState(floors?.[0]?.id ?? null)
  const [selectedUnitId, setSelectedUnitId] = useState(project.units[0]?.id ?? null)
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    if (lightbox === null) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setLightbox(null)
        return
      }

      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      if (lightbox.items.length < 2) return

      const step = event.key === 'ArrowRight' ? 1 : -1
      setLightbox((current) => {
        if (!current) return current
        const nextIndex =
          (current.index + step + current.items.length) % current.items.length
        return { ...current, index: nextIndex }
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightbox])

  const currentFloor =
    floors?.find((floor) => floor.id === selectedFloorId) ?? floors?.[0] ?? null
  const planImages = currentFloor
    ? getFloorImages(currentFloor)
    : (project.plan.images ?? [])
  const currentUnit =
    project.units.find((unit) => unit.id === selectedUnitId) ??
    project.units[0] ??
    null
  const unitImages = currentUnit?.images ?? []

  const openLightbox = (items, index = 0, title = '') => {
    if (!items?.length || isMobile) return
    setLightbox({ items, index, title })
  }

  const stepLightbox = (step) => {
    setLightbox((current) => {
      if (!current || current.items.length < 2) return current
      const nextIndex =
        (current.index + step + current.items.length) % current.items.length
      return { ...current, index: nextIndex }
    })
  }

  const renderThumbs = (items, { photo = false, title = '' } = {}) => (
    <div
      className={`projects-plan-thumbs${photo ? ' is-photos' : ''}`}
      role="list"
    >
      {items.map((item, index) => {
        const label = photo
          ? isUsefulImageLabel(item.label)
            ? item.label
            : null
          : item.label

        const thumbContent = (
          <>
            <span
              className={`projects-plan-thumb-media${photo ? ' is-photo' : ''}`}
            >
              <img
                src={item.src}
                alt=""
                draggable="false"
                loading="lazy"
              />
            </span>
            {label ? (
              <span className="projects-plan-thumb-label">{label}</span>
            ) : null}
          </>
        )

        if (isMobile) {
          return (
            <div
              key={`${title}-thumb-${item.alt}-${index}`}
              role="listitem"
              className="projects-plan-thumb is-static"
            >
              {thumbContent}
            </div>
          )
        }

        return (
          <button
            key={`${title}-thumb-${item.alt}-${index}`}
            type="button"
            role="listitem"
            className="projects-plan-thumb"
            aria-label={`View ${label ?? item.alt} full size`}
            onClick={() => openLightbox(items, index, title)}
          >
            {thumbContent}
          </button>
        )
      })}
    </div>
  )

  return (
    <>
      {includePlans ? (
      <section className="project-inventory" id="plans" aria-labelledby="plans-title">
        <div className="project-inventory__intro">
          <p className="project-kicker">Floor plans</p>
          <h2 id="plans-title" className="project-heading">
            Layouts for every level
          </h2>
          <p className="project-inventory__lead">
            {isMobile
              ? floors
                ? 'Select a floor to browse the plans.'
                : 'Browse the floor plans below.'
              : floors
                ? 'Select a floor, then click a plan to view it full size.'
                : 'Click a plan to view it full size.'}
          </p>
        </div>

        {floors ? (
          <div
            className="projects-floor-nav"
            role="tablist"
            aria-label={`${project.title} floors`}
          >
            {floors.map((floor) => (
              <button
                key={floor.id}
                type="button"
                role="tab"
                className={`projects-floor-btn${selectedFloorId === floor.id ? ' is-active' : ''}`}
                aria-selected={selectedFloorId === floor.id}
                onClick={() => {
                  setSelectedFloorId(floor.id)
                  setLightbox(null)
                }}
              >
                {floor.label}
              </button>
            ))}
          </div>
        ) : null}

        {planImages.length ? (
          <div
            className="projects-detail-media is-plan"
            aria-label={`${currentFloor?.label ?? project.title} floor plans`}
          >
            {renderThumbs(planImages, {
              title: currentFloor?.label ?? project.title,
            })}
          </div>
        ) : null}
      </section>
      ) : null}

      {includeUnits ? (
      <section className="project-inventory is-units" id="units" aria-labelledby="units-title">
        <div className="project-inventory__intro">
          <p className="project-kicker">Unit information</p>
          <h2 id="units-title" className="project-heading">
            Residences, retail &amp; workspace
          </h2>
          <p className="project-inventory__lead">
            {isMobile
              ? 'Select a unit type to browse the photos.'
              : 'Select a unit type, then click a photo to view it full size.'}
          </p>
        </div>

        <div
          className="projects-floor-nav is-units"
          role="tablist"
          aria-label={`${project.title} unit types`}
        >
          {project.units.map((unit) => (
            <button
              key={unit.id}
              type="button"
              role="tab"
              className={`projects-floor-btn${selectedUnitId === unit.id ? ' is-active' : ''}`}
              aria-selected={selectedUnitId === unit.id}
              onClick={() => {
                setSelectedUnitId(unit.id)
                setLightbox(null)
              }}
            >
              {unit.label ?? unit.type}
            </button>
          ))}
        </div>

        {currentUnit ? (
          <dl className="projects-unit-details">
            <div>
              <dt>Type</dt>
              <dd>{currentUnit.type}</dd>
            </div>
            <div>
              <dt>Area</dt>
              <dd>{currentUnit.area}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>
                <span className="projects-unit-status">{currentUnit.status}</span>
              </dd>
            </div>
          </dl>
        ) : null}

        {unitImages.length ? (
          <div
            className="projects-detail-media is-plan"
            aria-label={`${currentUnit?.type ?? project.title} interiors`}
          >
            {renderThumbs(unitImages, {
              photo: true,
              title: currentUnit?.type ?? project.title,
            })}
          </div>
        ) : null}
      </section>
      ) : null}

      {!isMobile ? (
        <ProjectLightbox
          lightbox={lightbox}
          onClose={() => setLightbox(null)}
          onStep={stepLightbox}
        />
      ) : null}
    </>
  )
}

export function ProjectEnquire({ project }) {
  return (
    <section className="project-enquire" id="enquire" aria-labelledby="enquire-title">
      <div className="project-enquire__copy">
        <p className="project-kicker is-light">Visit us</p>
        <h2 id="enquire-title" className="project-heading is-light">
          Enquire about {project.brand ?? project.short}
        </h2>
        <p className="project-enquire__text">
          Speak with the Dayim team for availability, payment plans, and a
          private viewing of {project.title}.
        </p>
      </div>

      <ul className="project-enquire__contacts">
        <li>
          <span>Call</span>
          <a href={SITE_CONTACT.phone.href}>{SITE_CONTACT.phone.display}</a>
        </li>
        <li>
          <span>Email</span>
          <a href={SITE_CONTACT.email.href}>{SITE_CONTACT.email.display}</a>
        </li>
        <li>
          <span>Address</span>
          <address>
            {SITE_CONTACT.address.lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
        </li>
        {project.mapsUrl ? (
          <li>
            <span>Location</span>
            <a href={project.mapsUrl} target="_blank" rel="noopener noreferrer">
              View on Google Maps
            </a>
          </li>
        ) : null}
      </ul>
    </section>
  )
}
