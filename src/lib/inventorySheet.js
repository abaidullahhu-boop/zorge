const STATUS_SOLD = new Set(['sold', 'sale'])
const STATUS_RESERVED = new Set(['reserved', 'reserve', 'booked', 'hold', 'onhold'])
const STATUS_AVAILABLE = new Set(['available', 'open', 'free', 'unsold'])

function normalizeKeyPart(value) {
  return String(value ?? '')
    .normalize('NFKC')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

export function inventoryUnitKey(projectId, floorId, unit) {
  return [projectId, floorId, unit].map(normalizeKeyPart).join('|')
}

function parseCsv(text) {
  const rows = []
  let row = []
  let cell = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]
    const next = text[i + 1]

    if (inQuotes) {
      if (char === '"' && next === '"') {
        cell += '"'
        i += 1
      } else if (char === '"') {
        inQuotes = false
      } else {
        cell += char
      }
      continue
    }

    if (char === '"') {
      inQuotes = true
      continue
    }

    if (char === ',') {
      row.push(cell)
      cell = ''
      continue
    }

    if (char === '\n' || (char === '\r' && next === '\n')) {
      row.push(cell)
      if (row.some((value) => value.trim() !== '')) rows.push(row)
      row = []
      cell = ''
      if (char === '\r') i += 1
      continue
    }

    if (char === '\r') {
      row.push(cell)
      if (row.some((value) => value.trim() !== '')) rows.push(row)
      row = []
      cell = ''
      continue
    }

    cell += char
  }

  if (cell.length || row.length) {
    row.push(cell)
    if (row.some((value) => value.trim() !== '')) rows.push(row)
  }

  return rows
}

function headerIndex(headers, aliases) {
  const normalized = headers.map((header) => normalizeKeyPart(header).replace(/[\s_]+/g, ''))
  for (const alias of aliases) {
    const needle = normalizeKeyPart(alias).replace(/[\s_]+/g, '')
    const index = normalized.indexOf(needle)
    if (index !== -1) return index
  }
  return -1
}

function normalizeStatus(rawStatus, buyer) {
  const value = normalizeKeyPart(rawStatus)
  if (STATUS_SOLD.has(value)) return 'sold'
  if (STATUS_RESERVED.has(value) || value.includes('reserv')) return 'reserved'
  if (STATUS_AVAILABLE.has(value)) return 'available'
  if (buyer) return 'sold'
  if (rawStatus) return value.includes('sold') ? 'sold' : 'available'
  return null
}

function formatSqft(raw) {
  const value = String(raw ?? '').trim()
  if (!value) return null
  if (/sq\.?\s*ft/i.test(value)) {
    const amount = value.match(/(\d[\d,]*)/)
    return amount ? `${amount[1]} Sq.Ft.` : value
  }
  const amount = value.match(/(\d[\d,]*)/)
  return amount ? `${amount[1]} Sq.Ft.` : value
}

function unitNumber(label) {
  const match = String(label ?? '').match(/(\d+)/)
  return match ? Number.parseInt(match[1], 10) : null
}

function areaNumber(area) {
  const match = String(area ?? '').match(/(\d[\d,]*)/)
  return match ? Number.parseInt(match[1].replace(/,/g, ''), 10) : null
}

function titleFromSheetUnit(label) {
  const match = String(label ?? '').match(/^(.+?)\s*#/i)
  if (!match) return null
  const prefix = match[1].trim()
  if (/^shop$/i.test(prefix)) return 'Shop'
  if (/^hall$/i.test(prefix)) return 'Commercial Hall'
  if (/^office$/i.test(prefix)) return 'Office'
  return null
}

function splitOverrideKey(key) {
  const parts = String(key).split('|')
  if (parts.length < 3) return null
  return {
    projectId: parts[0],
    floorId: parts[1],
    unit: parts.slice(2).join('|'),
  }
}

export function parseInventorySheetCsv(text) {
  const rows = parseCsv(text)
  if (rows.length < 2) return new Map()

  const headers = rows[0]
  const projectIdx = headerIndex(headers, ['project_id', 'project', 'projectid'])
  const floorIdx = headerIndex(headers, ['floor_id', 'floor', 'floorid'])
  const unitIdx = headerIndex(headers, ['unit', 'unit_label', 'unitlabel', 'code'])
  const statusIdx = headerIndex(headers, ['status'])
  const buyerIdx = headerIndex(headers, ['buyer', 'purchased_by', 'purchasedby', 'owner'])
  const sqftIdx = headerIndex(headers, ['sqft', 'sq_ft', 'area', 'size'])

  if (projectIdx === -1 || floorIdx === -1 || unitIdx === -1) {
    throw new Error('Inventory sheet needs project_id, floor_id, and unit columns')
  }

  const overrides = new Map()

  for (const row of rows.slice(1)) {
    const projectId = row[projectIdx]?.trim()
    const floorId = row[floorIdx]?.trim()
    const unit = row[unitIdx]?.trim()
    if (!projectId || !floorId || !unit) continue

    const buyerRaw = buyerIdx === -1 ? '' : (row[buyerIdx] ?? '').trim()
    const buyer = buyerRaw || null
    const status = normalizeStatus(
      statusIdx === -1 ? '' : row[statusIdx],
      buyer,
    )
    const area = sqftIdx === -1 ? null : formatSqft(row[sqftIdx])

    const patch = {
      // Sheet unit column is the display name on the site.
      unitLabel: unit,
    }
    if (status) patch.status = status
    if (buyerIdx !== -1) patch.buyer = buyer
    if (area) patch.area = area
    if (status === 'available') patch.buyer = null
    else if ((status === 'sold' || status === 'reserved') && buyer) patch.buyer = buyer

    const derivedTitle = titleFromSheetUnit(unit)
    if (derivedTitle) patch.title = derivedTitle

    overrides.set(inventoryUnitKey(projectId, floorId, unit), patch)
  }

  return overrides
}

export function resolveInventorySheetCsvUrl(rawUrl) {
  const value = String(rawUrl ?? '').trim()
  if (!value) return ''

  try {
    const url = new URL(value)
    const sheetMatch = url.pathname.match(/\/spreadsheets\/d\/([^/]+)/)
    if (!sheetMatch) return value

    const sheetId = sheetMatch[1]
    const gid =
      url.searchParams.get('gid') ||
      (url.hash.match(/gid=(\d+)/) || [])[1] ||
      '0'

    return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`
  } catch {
    return value
  }
}

function assertCsvPayload(text) {
  const sample = text.slice(0, 200).trim().toLowerCase()
  if (
    sample.startsWith('<!doctype') ||
    sample.startsWith('<html') ||
    sample.includes('page not found') ||
    sample.includes('sign in')
  ) {
    throw new Error(
      'Inventory sheet is not publicly readable. Share it as Anyone with the link (Viewer).',
    )
  }
}

export async function fetchInventoryOverrides(csvUrl, { signal } = {}) {
  const resolvedUrl = resolveInventorySheetCsvUrl(csvUrl)
  if (!resolvedUrl) return new Map()

  const response = await fetch(resolvedUrl, {
    signal,
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Inventory sheet fetch failed (${response.status})`)
  }

  const text = await response.text()
  assertCsvPayload(text)
  return parseInventorySheetCsv(text)
}

function findOverridePatch(unit, projectId, overrides, usedKeys) {
  const exactKey = inventoryUnitKey(projectId, unit.floorId, unit.unitLabel)
  if (overrides.has(exactKey) && !usedKeys.has(exactKey)) {
    usedKeys.add(exactKey)
    return overrides.get(exactKey)
  }

  const projectKey = normalizeKeyPart(projectId)
  const floorKey = normalizeKeyPart(unit.floorId)
  const num = unitNumber(unit.unitLabel)
  const area = areaNumber(unit.area)

  if (num != null) {
    for (const [key, patch] of overrides) {
      if (usedKeys.has(key)) continue
      const parts = splitOverrideKey(key)
      if (!parts) continue
      if (parts.projectId !== projectKey || parts.floorId !== floorKey) continue
      if (unitNumber(parts.unit) === num) {
        usedKeys.add(key)
        return patch
      }
    }
  }

  if (area != null) {
    for (const [key, patch] of overrides) {
      if (usedKeys.has(key)) continue
      const parts = splitOverrideKey(key)
      if (!parts) continue
      if (parts.projectId !== projectKey || parts.floorId !== floorKey) continue
      if (areaNumber(patch.area) === area) {
        usedKeys.add(key)
        return patch
      }
    }
  }

  return null
}

export function applyInventoryOverrides(units, projectId, overrides) {
  if (!overrides?.size) return units

  const usedKeys = new Set()

  return units.map((unit) => {
    const patch = findOverridePatch(unit, projectId, overrides, usedKeys)
    if (!patch) return unit

    const next = { ...unit, ...patch }
    if (next.status === 'available') next.buyer = null
    return next
  })
}
