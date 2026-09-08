import { useMemo, useState } from 'react'
import useProjectInventory from '../../hooks/useProjectInventory'
import { SITE_CONTACT } from '../../data/siteContact'

function InventoryCard({ unit }) {
  const isSold = unit.status === 'sold'
  const heading = unit.unitLabel || unit.title
  const typeLabel =
    unit.unitLabel && unit.title && unit.title !== unit.unitLabel
      ? unit.title
      : null

  return (
    <article className={`inventory-card${isSold ? ' is-sold' : ' is-available'}`}>
      <div className="inventory-card__media">
        <img src={unit.src} alt={unit.alt} draggable="false" loading="lazy" />
        <span
          className={`inventory-card__badge${isSold ? ' is-sold' : ' is-available'}`}
        >
          {isSold ? 'Sold' : 'Available'}
        </span>
      </div>

      <div className="inventory-card__body">
        <div className="inventory-card__copy">
          <h3 className="inventory-card__title">{heading}</h3>
          <p className="inventory-card__floor">
            {[typeLabel, unit.floorLabel].filter(Boolean).join(' · ')}
          </p>
          {unit.area ? (
            <p className="inventory-card__meta">{unit.area}</p>
          ) : null}
        </div>

        {isSold ? (
          unit.buyer ? (
            <p className="inventory-card__buyer">
              <span className="inventory-card__buyer-label">Purchased by</span>
              <span className="inventory-card__buyer-name">{unit.buyer}</span>
            </p>
          ) : null
        ) : (
          <a
            className="inventory-card__book"
            href={SITE_CONTACT.phone.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            Book now
          </a>
        )}
      </div>
    </article>
  )
}

export default function ProjectInventoryBoard({ project }) {
  const { inventory } = useProjectInventory(project)
  const floors = project.plan?.floors ?? []
  const [selectedFloorId, setSelectedFloorId] = useState('all')

  const floorStats = useMemo(() => {
    const byFloor = Object.fromEntries(
      floors.map((floor) => [floor.id, { total: 0, available: 0, sold: 0 }]),
    )
    let available = 0
    let sold = 0

    for (const unit of inventory) {
      const isSold = unit.status === 'sold'
      if (isSold) sold += 1
      else available += 1

      const bucket = byFloor[unit.floorId]
      if (!bucket) continue
      bucket.total += 1
      if (isSold) bucket.sold += 1
      else bucket.available += 1
    }

    return {
      all: { total: inventory.length, available, sold },
      byFloor,
    }
  }, [floors, inventory])

  const visibleUnits =
    selectedFloorId === 'all'
      ? inventory
      : inventory.filter((unit) => unit.floorId === selectedFloorId)

  const activeStats =
    selectedFloorId === 'all'
      ? floorStats.all
      : floorStats.byFloor[selectedFloorId] ?? { total: 0, available: 0, sold: 0 }

  return (
    <section
      className="project-inventory project-inventory--board"
      id="plans"
      aria-labelledby="inventory-title"
    >
      <div className="project-inventory__intro">
        <p className="project-kicker">Inventory</p>
        <h2 id="inventory-title" className="project-heading">
          Units across every level
        </h2>
        <p className="project-inventory__lead">
          Browse availability by floor. Book open units or see who already secured
          each layout.
        </p>

        <dl className="inventory-summary" aria-live="polite">
          <div className="inventory-summary__item">
            <dt>Showing</dt>
            <dd>{activeStats.total}</dd>
          </div>
          <div className="inventory-summary__item is-available">
            <dt>Available</dt>
            <dd>{activeStats.available}</dd>
          </div>
          <div className="inventory-summary__item is-sold">
            <dt>Sold</dt>
            <dd>{activeStats.sold}</dd>
          </div>
        </dl>
      </div>

      {floors.length ? (
        <div
          className="projects-floor-nav projects-floor-nav--inventory"
          role="tablist"
          aria-label={`${project.title} floors`}
        >
          <button
            type="button"
            role="tab"
            className={`projects-floor-btn${selectedFloorId === 'all' ? ' is-active' : ''}`}
            aria-selected={selectedFloorId === 'all'}
            onClick={() => setSelectedFloorId('all')}
          >
            All
            <span className="projects-floor-btn__count">{floorStats.all.total}</span>
          </button>
          {floors.map((floor) => {
            const count = floorStats.byFloor[floor.id]?.total ?? 0
            return (
              <button
                key={floor.id}
                type="button"
                role="tab"
                className={`projects-floor-btn${selectedFloorId === floor.id ? ' is-active' : ''}`}
                aria-selected={selectedFloorId === floor.id}
                onClick={() => setSelectedFloorId(floor.id)}
              >
                {floor.label}
                <span className="projects-floor-btn__count">{count}</span>
              </button>
            )
          })}
        </div>
      ) : null}

      {visibleUnits.length ? (
        <div className="inventory-grid" role="list">
          {visibleUnits.map((unit) => (
            <div key={unit.id} role="listitem">
              <InventoryCard unit={unit} />
            </div>
          ))}
        </div>
      ) : (
        <p className="inventory-empty">No units on this floor yet.</p>
      )}
    </section>
  )
}
