import { useEffect, useState } from 'react'

const MOBILE_MQ = '(max-width: 760px)'

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

const TABS = [
  { id: 'about', label: 'About' },
  { id: 'plan', label: 'Plan' },
  { id: 'units', label: 'Unit Information' },
]

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

function ProjectDetail({ project, activeTab, onTabChange, onBack }) {
  const isMobile = useIsMobile()
  const floors = project.plan.floors ?? null
  const [selectedFloorId, setSelectedFloorId] = useState(floors?.[0]?.id ?? null)
  const [selectedUnitId, setSelectedUnitId] = useState(project.units[0]?.id ?? null)
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    if (isMobile) setLightbox(null)
  }, [isMobile])

  useEffect(() => {
    setSelectedFloorId(project.plan.floors?.[0]?.id ?? null)
    setSelectedUnitId(project.units[0]?.id ?? null)
    setLightbox(null)
  }, [project.id, activeTab])

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
  const lightboxItem = lightbox?.items[lightbox.index] ?? null

  const closeLightbox = () => setLightbox(null)

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

  const selectFloor = (floorId) => {
    setSelectedFloorId(floorId)
    setLightbox(null)
  }

  const selectUnit = (unitId) => {
    setSelectedUnitId(unitId)
    setLightbox(null)
  }

  return (
    <div className="projects-detail">
      <button type="button" className="projects-back" onClick={onBack}>
        <svg viewBox="0 0 24 14" fill="none" aria-hidden="true">
          <path
            d="M24 7H2M8 1 1 7l7 6"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        All Projects
      </button>

      <div
        className={`projects-detail-hero${activeTab === 'units' ? ' is-units' : ''}${activeTab === 'plan' ? ' is-plan' : ''}`}
      >
        <div className="projects-detail-copy">
          <p className="projects-detail-kicker">{project.short}</p>
          <h2 className="projects-detail-title">{project.title}</h2>
          <p className="projects-detail-subtitle">{project.subtitle}</p>

          <div
            className="projects-tabs"
            role="tablist"
            aria-label={`${project.title} information`}
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`projects-tab-${project.id}-${tab.id}`}
                className={`projects-tab${activeTab === tab.id ? ' is-active' : ''}`}
                aria-selected={activeTab === tab.id}
                aria-controls={`projects-panel-${project.id}-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="projects-panels projects-panels--inline">
              <div
                id={`projects-panel-${project.id}-about`}
                role="tabpanel"
                aria-labelledby={`projects-tab-${project.id}-about`}
                className={`projects-panel${activeTab === 'about' ? ' is-active' : ''}`}
                hidden={activeTab !== 'about'}
              >
                <p className="projects-panel-text">{project.about.description}</p>
                <ul className="projects-highlights">
                  {project.about.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div
                id={`projects-panel-${project.id}-plan`}
                role="tabpanel"
                aria-labelledby={`projects-tab-${project.id}-plan`}
                className={`projects-panel${activeTab === 'plan' ? ' is-active' : ''}`}
                hidden={activeTab !== 'plan'}
              >
                <p className="projects-panel-lead">
                  {isMobile
                    ? floors
                      ? 'Select a floor to browse the plans.'
                      : 'Browse the floor plans below.'
                    : floors
                      ? 'Select a floor, then click a plan to view it full size.'
                      : 'Click a plan to view it full size.'}
                </p>
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
                        onClick={() => selectFloor(floor.id)}
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
                    <div className="projects-plan-thumbs" role="list">
                      {planImages.map((plan) => {
                        const thumbContent = (
                          <>
                            <span className="projects-plan-thumb-media">
                              <img src={plan.src} alt="" draggable="false" loading="lazy" />
                            </span>
                            {plan.label ? (
                              <span className="projects-plan-thumb-label">{plan.label}</span>
                            ) : null}
                          </>
                        )

                        if (isMobile) {
                          return (
                            <div
                              key={`${currentFloor?.id ?? 'plan'}-thumb-${plan.alt}`}
                              role="listitem"
                              className="projects-plan-thumb is-static"
                            >
                              {thumbContent}
                            </div>
                          )
                        }

                        return (
                          <button
                            key={`${currentFloor?.id ?? 'plan'}-thumb-${plan.alt}`}
                            type="button"
                            role="listitem"
                            className="projects-plan-thumb"
                            aria-label={`View ${plan.label ?? plan.alt} full size`}
                            onClick={() =>
                              openLightbox(
                                planImages,
                                planImages.indexOf(plan),
                                currentFloor?.label ?? project.title,
                              )
                            }
                          >
                            {thumbContent}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ) : null}
              </div>

              <div
                id={`projects-panel-${project.id}-units`}
                role="tabpanel"
                aria-labelledby={`projects-tab-${project.id}-units`}
                className={`projects-panel${activeTab === 'units' ? ' is-active' : ''}`}
                hidden={activeTab !== 'units'}
              >
                <p className="projects-panel-lead">
                  {isMobile
                    ? 'Select a unit type to browse the photos.'
                    : 'Select a unit type, then click a photo to view it full size.'}
                </p>
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
                      onClick={() => selectUnit(unit.id)}
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
                    <div className="projects-plan-thumbs is-photos" role="list">
                      {unitImages.map((image, index) => {
                        const label = isUsefulImageLabel(image.label)
                          ? image.label
                          : null

                        const thumbContent = (
                          <>
                            <span className="projects-plan-thumb-media is-photo">
                              <img
                                src={image.src}
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
                              key={`${currentUnit?.id ?? 'unit'}-thumb-${image.alt}-${index}`}
                              role="listitem"
                              className="projects-plan-thumb is-static"
                            >
                              {thumbContent}
                            </div>
                          )
                        }

                        return (
                          <button
                            key={`${currentUnit?.id ?? 'unit'}-thumb-${image.alt}-${index}`}
                            type="button"
                            role="listitem"
                            className="projects-plan-thumb"
                            aria-label={`View ${label ?? currentUnit?.type ?? 'interior'} full size`}
                            onClick={() =>
                              openLightbox(
                                unitImages,
                                index,
                                currentUnit?.type ?? project.title,
                              )
                            }
                          >
                            {thumbContent}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
        </div>

        {activeTab === 'about' ? (
          <div className="projects-detail-media">
            <div className="projects-detail-image">
              <img
                className="projects-parallax-image"
                src={project.image}
                alt=""
                draggable="false"
              />
            </div>
          </div>
        ) : null}
      </div>

      {lightboxItem ? (
        <div
          className="projects-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={lightboxItem.alt}
          onClick={closeLightbox}
        >
          <button
            type="button"
            className="projects-lightbox-close"
            aria-label="Close image"
            onClick={closeLightbox}
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
                  stepLightbox(-1)
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
                  stepLightbox(1)
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
            <img src={lightboxItem.src} alt={lightboxItem.alt} draggable="false" />
            {lightboxItem.label || lightbox.title ? (
              <figcaption>
                {lightbox.title && lightboxItem.label
                  ? `${lightbox.title} · ${lightboxItem.label}`
                  : (lightboxItem.label ?? lightbox.title)}
                {lightbox.items.length > 1
                  ? ` · ${lightbox.index + 1} / ${lightbox.items.length}`
                  : ''}
              </figcaption>
            ) : null}
          </figure>
        </div>
      ) : null}
    </div>
  )
}

export default ProjectDetail
