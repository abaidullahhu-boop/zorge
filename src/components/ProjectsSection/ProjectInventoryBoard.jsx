import { useState } from 'react'
import { getProjectInventory } from '../../data/projects'
import { SITE_CONTACT } from '../../data/siteContact'

function InventoryCard({ unit }) {
  const isSold = unit.status === 'sold'
  const meta = [unit.unitLabel, unit.area].filter(Boolean).join('  ')

  return (
    <article className={`inventory-card${isSold ? ' is-sold' : ' is-available'}`}>
      <div className="inventory-card__media">
        <img src={unit.src} alt={unit.alt} draggable="false" loading="lazy" />
      </div>

      <div className="inventory-card__status">
        {isSold ? (
          <>
            <span className="inventory-card__badge is-sold">Sold</span>
            {unit.buyer ? (
              <p className="inventory-card__buyer">
                <span>Purchased By</span>
                <span className="inventory-card__buyer-name">{unit.buyer}</span>
              </p>
            ) : null}
          </>
        ) : (
          <>
            <span className="inventory-card__badge is-available">Available</span>
            <a
              className="inventory-card__book"
              href={SITE_CONTACT.phone.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              Book Now
            </a>
          </>
        )}
      </div>

      <div className="inventory-card__body">
        <h3 className="inventory-card__title">{unit.title}</h3>
        <p className="inventory-card__floor">{unit.floorLabel}</p>
        {meta ? <p className="inventory-card__meta">{meta}</p> : null}
      </div>

      {!isSold ? (
        <div className="inventory-card__actions">
          <a
            className="inventory-card__contact"
            href={SITE_CONTACT.phone.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact
          </a>
        </div>
      ) : null}
    </article>
  )
}

export default function ProjectInventoryBoard({ project }) {
  const inventory = getProjectInventory(project)
  const floors = project.plan?.floors ?? []
  const [selectedFloorId, setSelectedFloorId] = useState('all')

  const visibleUnits =
    selectedFloorId === 'all'
      ? inventory
      : inventory.filter((unit) => unit.floorId === selectedFloorId)

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
      </div>

      {floors.length ? (
        <div
          className="projects-floor-nav"
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
            All floors
          </button>
          {floors.map((floor) => (
            <button
              key={floor.id}
              type="button"
              role="tab"
              className={`projects-floor-btn${selectedFloorId === floor.id ? ' is-active' : ''}`}
              aria-selected={selectedFloorId === floor.id}
              onClick={() => setSelectedFloorId(floor.id)}
            >
              {floor.label}
            </button>
          ))}
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
