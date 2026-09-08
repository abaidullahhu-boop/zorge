import { useEffect, useMemo, useState } from 'react'
import { getProjectInventory } from '../data/projects'
import {
  applyInventoryOverrides,
  fetchInventoryOverrides,
} from '../lib/inventorySheet'

const SHEET_CSV_URL = import.meta.env.VITE_INVENTORY_SHEET_CSV_URL?.trim() || ''

export default function useProjectInventory(project) {
  const baseInventory = useMemo(() => getProjectInventory(project), [project])
  const [overrides, setOverrides] = useState(null)

  useEffect(() => {
    if (!SHEET_CSV_URL || !project?.id) {
      setOverrides(null)
      return undefined
    }

    const controller = new AbortController()
    let active = true

    fetchInventoryOverrides(SHEET_CSV_URL, { signal: controller.signal })
      .then((next) => {
        if (active) setOverrides(next)
      })
      .catch((error) => {
        if (controller.signal.aborted) return
        console.warn('[inventory] Google Sheet sync failed, using local data.', error)
        if (active) setOverrides(null)
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [project?.id])

  const inventory = useMemo(
    () => applyInventoryOverrides(baseInventory, project?.id, overrides),
    [baseInventory, overrides, project?.id],
  )

  return {
    inventory,
    source: overrides ? 'sheet' : 'local',
  }
}
