import { useMemo, useState } from 'react'
import useProjectInventory from '../../hooks/useProjectInventory'
import InventoryBookingModal from './InventoryBookingModal'

function InventoryCard({ unit, onBook }) {
  const status = unitStatus(unit)
  const heading = unit.unitLabel || unit.title
  const typeLabel =
    unit.unitLabel && unit.title && unit.title !== unit.unitLabel
      ? unit.title
      : null

  return (
    <article className={`inventory-card is-${status}`}>
      <div className="inventory-card__media">
        <img src={unit.src} alt={unit.alt} draggable="false" loading="lazy" />
        <span className={`inventory-card__badge is-${status}`}>
          {status === 'sold' ? 'Sold' : status === 'reserved' ? 'Reserved' : 'Available'}
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

        {status === 'sold' ? (
          unit.buyer ? (
            <p className="inventory-card__buyer">
              <span className="inventory-card__buyer-label">Purchased by</span>
              <span className="inventory-card__buyer-name">{unit.buyer}</span>
            </p>
          ) : null
        ) : status === 'reserved' ? (
          <span className="inventory-card__book inventory-card__book--reserved" aria-disabled="true">
            Reserved
          </span>
        ) : (
          <button
            type="button"
            className="inventory-card__book"
            onClick={() => onBook(unit)}
          >
            Book now
          </button>
        )}
      </div>
    </article>
  )
}

function unitStatus(unit) {
  return unit.status === 'sold' || unit.status === 'reserved' ? unit.status : 'available'
}

export default function ProjectInventoryBoard({ project }) {
  const { inventory } = useProjectInventory(project)
  const floors = project.plan?.floors ?? []
  const [selectedFloorId, setSelectedFloorId] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [bookingUnit, setBookingUnit] = useState(null)

  const floorStats = useMemo(() => {
    const empty = () => ({ total: 0, available: 0, reserved: 0, sold: 0 })
    const byFloor = Object.fromEntries(floors.map((floor) => [floor.id, empty()]))
    const all = empty()

    for (const unit of inventory) {
      const status = unitStatus(unit)
      all.total += 1
      all[status] += 1

      const bucket = byFloor[unit.floorId]
      if (!bucket) continue
      bucket.total += 1
      bucket[status] += 1
    }

    return { all, byFloor }
  }, [floors, inventory])

  const visibleUnits = useMemo(() => {
    const byFloor =
      selectedFloorId === 'all'
        ? inventory
        : inventory.filter((unit) => unit.floorId === selectedFloorId)

    if (selectedStatus === 'all') return byFloor
    return byFloor.filter((unit) => unitStatus(unit) === selectedStatus)
  }, [inventory, selectedFloorId, selectedStatus])

  const activeStats =
    selectedFloorId === 'all'
      ? floorStats.all
      : floorStats.byFloor[selectedFloorId] ?? {
          total: 0,
          available: 0,
          reserved: 0,
          sold: 0,
        }

  const toggleStatus = (status) => {
    setSelectedStatus((current) => (current === status ? 'all' : status))
  }

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

        <div className="inventory-summary" role="group" aria-label="Filter by status">
          <button
            type="button"
            className={`inventory-summary__item${selectedStatus === 'all' ? ' is-active' : ''}`}
            aria-pressed={selectedStatus === 'all'}
            onClick={() => setSelectedStatus('all')}
          >
            <span className="inventory-summary__label">Showing</span>
            <span className="inventory-summary__value">{visibleUnits.length}</span>
          </button>
          <button
            type="button"
            className={`inventory-summary__item is-available${selectedStatus === 'available' ? ' is-active' : ''}`}
            aria-pressed={selectedStatus === 'available'}
            onClick={() => toggleStatus('available')}
          >
            <span className="inventory-summary__label">Available</span>
            <span className="inventory-summary__value">{activeStats.available}</span>
          </button>
          <button
            type="button"
            className={`inventory-summary__item is-reserved${selectedStatus === 'reserved' ? ' is-active' : ''}`}
            aria-pressed={selectedStatus === 'reserved'}
            onClick={() => toggleStatus('reserved')}
          >
            <span className="inventory-summary__label">Reserved</span>
            <span className="inventory-summary__value">{activeStats.reserved}</span>
          </button>
          <button
            type="button"
            className={`inventory-summary__item is-sold${selectedStatus === 'sold' ? ' is-active' : ''}`}
            aria-pressed={selectedStatus === 'sold'}
            onClick={() => toggleStatus('sold')}
          >
            <span className="inventory-summary__label">Sold</span>
            <span className="inventory-summary__value">{activeStats.sold}</span>
          </button>
        </div>
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
              <InventoryCard unit={unit} onBook={setBookingUnit} />
            </div>
          ))}
        </div>
      ) : (
        <p className="inventory-empty">
          {selectedStatus === 'all'
            ? 'No units on this floor yet.'
            : `No ${selectedStatus} units on this floor.`}
        </p>
      )}

      {bookingUnit ? (
        <InventoryBookingModal
          project={project}
          unit={bookingUnit}
          onClose={() => setBookingUnit(null)}
        />
      ) : null}
    </section>
  )
}
