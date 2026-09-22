import dsaImage from '../assets/images/dayim-signature.png'
import livingImage from '../assets/images/dayim-living.png'
import zindagiImage from '../assets/images/dayim-zindagi.png'
import dsaMark from '../assets/images/dsmark.png'
import livingMark from '../assets/images/dlmask.png'
import zindagiMark from '../assets/images/dzmask.png'
import livingExcavation1 from '../assets/images/l1.jpg'
import livingExcavation2 from '../assets/images/l4.jpg'
import livingExcavation3 from '../assets/images/l5.jpg'
import livingPcc1 from '../assets/images/l2.jpg'
import livingPcc2 from '../assets/images/l3.jpg'
import livingPcc3 from '../assets/images/l6.jpg'
import livingGround1 from '../assets/images/f1.jpg'
import livingGround2 from '../assets/images/f2.jpg'
import livingGround3 from '../assets/images/f3.jpg'
import livingStudioDeluxeRoom from '../assets/images/03.jpg'
import livingStudioDeluxeLiving from '../assets/images/04.jpg'
import livingStudioDeluxeBath from '../assets/images/011.jpg'
import livingExecutiveStudioRoom from '../assets/images/05.jpg'
import livingExecutiveStudioLiving from '../assets/images/06.jpg'
import livingExecutiveStudioBath from '../assets/images/08.jpg'

function mapsSearch(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

const signaturePlanFiles = import.meta.glob(
  '../assets/images/Signature floor plans/FLOOR PLANS/Floor Plans/*.png',
  { eager: true, import: 'default' },
)

const dsaInventoryFiles = import.meta.glob(
  '../assets/images/DSA Inventory /**/*.{png,jpg,jpeg,PNG,JPG,JPEG}',
  { eager: true, import: 'default' },
)

const dlInventoryFiles = import.meta.glob(
  '../assets/images/dl-inventory/**/*.{png,jpg,jpeg,PNG,JPG,JPEG}',
  { eager: true, import: 'default' },
)

const dzInventoryFiles = import.meta.glob(
  '../assets/images/dz-inventory/**/*.{png,jpg,jpeg,PNG,JPG,JPEG}',
  { eager: true, import: 'default' },
)

const signatureInteriorFiles = import.meta.glob(
  '../assets/images/Signature-Interior-Images/**/*.{png,jpg,jpeg,JPG,JPEG,PNG}',
  { eager: true, import: 'default' },
)

function signaturePlan(relativePath) {
  const key = `../assets/images/Signature floor plans/FLOOR PLANS/${relativePath}`
  const src = signaturePlanFiles[key]
  if (!src) {
    throw new Error(`Missing Signature floor plan: ${relativePath}`)
  }
  return src
}

function overviewImage(relativePath, alt) {
  return {
    src: signaturePlan(relativePath),
    label: 'Floor layout',
    alt,
    title: 'Floor layout',
    area: null,
    code: null,
    buyer: null,
    status: 'available',
  }
}

function parseDsaInventoryMeta(fileName) {
  const base = fileName
    .replace(/\.[^.]+$/, '')
    .replace(/_+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  const areaMatch = base.match(/(\d[\d,]*)\s*Sq\.?\s*ft/i)
  const area = areaMatch ? `${areaMatch[1].replace(/,/g, '')} Sq.Ft.` : null

  const shopMatch = base.match(/Commercial\s+Shop\s*0*(\d+)/i)
  const hallMatch = base.match(/Commercial\s+Hall\s*0*(\d+)/i)
  const officeMatch = base.match(/Commercial\s+Office\s*0*(\d+)/i)
  const aptMatch = base.match(
    /^(Studio Executive|Executive Studio|Studio Deluxe|One Bed Executive|One Bed Deluxe|2 Bed Executive)/i,
  )

  let title = base
  let code = null

  if (shopMatch) {
    title = 'Shop'
    code = `Shop # ${shopMatch[1].padStart(2, '0')}`
  } else if (hallMatch) {
    title = 'Commercial Hall'
    code = `Hall # ${hallMatch[1].padStart(2, '0')}`
  } else if (officeMatch) {
    // DSA first-floor files are named "Commercial Office" but sold as shops.
    title = 'Shop'
    code = `Shop # ${officeMatch[1].padStart(2, '0')}`
  } else if (aptMatch) {
    title = aptMatch[1].replace(/\s+/g, ' ')
  }

  // Buyer name after sqft — mark sold, never expose the name.
  const afterArea = areaMatch ? base.slice(areaMatch.index + areaMatch[0].length) : ''
  const buyerPart = afterArea.replace(/^[\s_\-–—]+/, '').replace(/[_\s]+$/, '').trim()
  const markedSold = Boolean(buyerPart)

  return {
    title,
    area,
    code,
    buyer: null,
    status: markedSold ? 'sold' : 'available',
  }
}

function inventoryImagesFrom(files, folderHint, altPrefix, missingLabel) {
  const typeOrder = [
    'Studio Executive',
    'Executive Studio',
    'Studio Deluxe',
    'One Bed Executive',
    'One Bed Deluxe',
    '2 Bed Executive',
    'Shop',
    'Commercial Hall',
    'Office',
  ]

  const images = Object.entries(files)
    .filter(([key]) => key.includes(folderHint))
    .map(([key, src]) => {
      const fileName = key.split('/').pop()
      const meta = parseDsaInventoryMeta(fileName)
      return { key, src, fileName, meta }
    })
    .sort((a, b) => {
      const aCodeNum = Number.parseInt(a.meta.code?.match(/\d+/)?.[0] ?? '', 10)
      const bCodeNum = Number.parseInt(b.meta.code?.match(/\d+/)?.[0] ?? '', 10)
      if (!Number.isNaN(aCodeNum) && !Number.isNaN(bCodeNum) && aCodeNum !== bCodeNum) {
        return aCodeNum - bCodeNum
      }

      const aType = typeOrder.indexOf(a.meta.title)
      const bType = typeOrder.indexOf(b.meta.title)
      if (aType !== bType) {
        return (aType === -1 ? 99 : aType) - (bType === -1 ? 99 : bType)
      }

      const aArea = Number.parseInt(a.meta.area ?? '', 10) || 0
      const bArea = Number.parseInt(b.meta.area ?? '', 10) || 0
      if (aArea !== bArea) return aArea - bArea

      return a.key.localeCompare(b.key, undefined, {
        numeric: true,
        sensitivity: 'base',
      })
    })
    .map(({ src, meta }, index) => {
      const code = meta.code ?? `Apartment # ${index + 1}`
      return {
        src,
        label: meta.title,
        alt: `${altPrefix} — ${meta.title}${meta.area ? ` (${meta.area})` : ''}`,
        ...meta,
        code,
      }
    })

  if (!images.length) {
    throw new Error(`Missing ${missingLabel} inventory images: ${folderHint}`)
  }

  return images
}

function dsaInventoryImages(folderHint, altPrefix) {
  return inventoryImagesFrom(dsaInventoryFiles, folderHint, altPrefix, 'DSA')
}

function dlInventoryImages(folderHint, altPrefix) {
  return inventoryImagesFrom(dlInventoryFiles, folderHint, altPrefix, 'DL')
}

function dlOverviewImage(fileName, alt) {
  const entry = Object.entries(dlInventoryFiles).find(([key]) => {
    const name = key.split('/').pop()
    return name === fileName
  })
  if (!entry) {
    throw new Error(`Missing DL floor plan: ${fileName}`)
  }
  return {
    src: entry[1],
    label: 'Floor layout',
    alt,
    title: 'Floor layout',
    area: null,
    code: null,
    buyer: null,
    status: 'available',
  }
}

function normalizeDzFileName(fileName) {
  return fileName
    .replace(/\.[^.]+$/, '')
    .replace(/_+$/g, '')
    .replace(/Apartmenr/gi, 'Apartment')
    .replace(/\bObe\b/gi, 'One')
    .replace(/Commercia(?=\s+Outlet)/gi, 'Commercial')
    .replace(/Studioapartment/gi, 'Studio Apartment')
    .replace(/Twin\s+treat/gi, 'Twin Treat')
    .replace(/\s+/g, ' ')
    .trim()
}

function dzFileQuality(fileName) {
  let score = 0
  if (/apartmenr/i.test(fileName)) score += 10
  if (/\bobe\b/i.test(fileName)) score += 10
  if (/commercia\s+outlet/i.test(fileName)) score += 10
  if (/studioapartment/i.test(fileName)) score += 10
  if (/apartment-\s/i.test(fileName)) score += 2
  if (/ {2,}/.test(fileName)) score += 1
  return score
}

function parseDzInventoryMeta(fileName) {
  const base = normalizeDzFileName(fileName)

  const areaMatch = base.match(/(\d[\d,]*)\s*Sq\.?\s*ft/i)
  const area = areaMatch ? `${areaMatch[1].replace(/,/g, '')} Sq.Ft.` : null

  const outletMatch = base.match(/Commercial\s+Outlet\s*0*(\d+)/i)
  const twinMatch = base.match(/Twin\s+Treat/i)
  const studioMatch = base.match(/Studio\s+Apartment\s*[-–—]?\s*(Elite|Royale)/i)
  const oneBedMatch = base.match(
    /One\s+Bed\s+Apartment\s*[-–—]?\s*(Elite|Royale|Blue\s*View)/i,
  )

  let title = base
  let code = null

  if (outletMatch) {
    title = 'Commercial Outlet'
    code = `Outlet # ${outletMatch[1].padStart(2, '0')}`
  } else if (twinMatch) {
    title = 'Twin Treat 2 Bed'
  } else if (studioMatch) {
    title = `Studio ${studioMatch[1]}`
  } else if (oneBedMatch) {
    title = `One Bed ${oneBedMatch[1].replace(/\s+/g, ' ')}`
  }

  return {
    title,
    area,
    code,
    buyer: null,
    status: 'available',
  }
}

function dzInventoryImages(folderHint, altPrefix) {
  const typeOrder = [
    'Commercial Outlet',
    'Twin Treat 2 Bed',
    'Studio Elite',
    'Studio Royale',
    'One Bed Elite',
    'One Bed Royale',
    'One Bed Blue View',
  ]

  const seen = new Map()
  const images = Object.entries(dzInventoryFiles)
    .filter(([key]) => key.includes(folderHint) && !key.includes('00- Main Page'))
    .map(([key, src]) => {
      const fileName = key.split('/').pop()
      const meta = parseDzInventoryMeta(fileName)
      return { key, src, fileName, meta, quality: dzFileQuality(fileName) }
    })
    .sort((a, b) => {
      if (a.quality !== b.quality) return a.quality - b.quality

      const aCodeNum = Number.parseInt(a.meta.code?.match(/\d+/)?.[0] ?? '', 10)
      const bCodeNum = Number.parseInt(b.meta.code?.match(/\d+/)?.[0] ?? '', 10)
      if (!Number.isNaN(aCodeNum) && !Number.isNaN(bCodeNum) && aCodeNum !== bCodeNum) {
        return aCodeNum - bCodeNum
      }

      const aType = typeOrder.indexOf(a.meta.title)
      const bType = typeOrder.indexOf(b.meta.title)
      if (aType !== bType) {
        return (aType === -1 ? 99 : aType) - (bType === -1 ? 99 : bType)
      }

      const aArea = Number.parseInt(a.meta.area ?? '', 10) || 0
      const bArea = Number.parseInt(b.meta.area ?? '', 10) || 0
      if (aArea !== bArea) return aArea - bArea

      return a.key.localeCompare(b.key, undefined, {
        numeric: true,
        sensitivity: 'base',
      })
    })
    .filter((entry) => {
      const dedupeKey = `${entry.meta.title}|${entry.meta.area ?? ''}|${entry.meta.code ?? ''}`
        .toLowerCase()
      if (seen.has(dedupeKey)) return false
      seen.set(dedupeKey, true)
      return true
    })
    .sort((a, b) => {
      const aCodeNum = Number.parseInt(a.meta.code?.match(/\d+/)?.[0] ?? '', 10)
      const bCodeNum = Number.parseInt(b.meta.code?.match(/\d+/)?.[0] ?? '', 10)
      if (!Number.isNaN(aCodeNum) && !Number.isNaN(bCodeNum) && aCodeNum !== bCodeNum) {
        return aCodeNum - bCodeNum
      }

      const aType = typeOrder.indexOf(a.meta.title)
      const bType = typeOrder.indexOf(b.meta.title)
      if (aType !== bType) {
        return (aType === -1 ? 99 : aType) - (bType === -1 ? 99 : bType)
      }

      const aArea = Number.parseInt(a.meta.area ?? '', 10) || 0
      const bArea = Number.parseInt(b.meta.area ?? '', 10) || 0
      if (aArea !== bArea) return aArea - bArea

      return a.key.localeCompare(b.key, undefined, {
        numeric: true,
        sensitivity: 'base',
      })
    })
    .map(({ src, meta }, index) => {
      const code = meta.code ?? `Apartment # ${index + 1}`
      return {
        src,
        label: meta.title,
        alt: `${altPrefix} — ${meta.title}${meta.area ? ` (${meta.area})` : ''}`,
        ...meta,
        code,
      }
    })

  if (!images.length) {
    throw new Error(`Missing DZ inventory images: ${folderHint}`)
  }

  return images
}

function dzOverviewImage(fileName, alt) {
  const needle = fileName.toLowerCase()
  const entry = Object.entries(dzInventoryFiles).find(([key]) => {
    const name = key.split('/').pop()?.toLowerCase()
    return name === needle
  })
  if (!entry) {
    throw new Error(`Missing DZ floor plan: ${fileName}`)
  }
  return {
    src: entry[1],
    label: 'Floor layout',
    alt,
    title: 'Floor layout',
    area: null,
    code: null,
    buyer: null,
    status: 'available',
  }
}

function dzPickImage(folderHint, titleMatch) {
  const images = dzInventoryImages(folderHint, 'Dayim Zindagi')
  const match = images.find((image) =>
    String(image.title).toLowerCase().includes(titleMatch.toLowerCase()),
  )
  return match ?? images[0]
}

export function getProjectInventory(project) {
  const floors = project?.plan?.floors
  if (!floors?.length) return []

  return floors.flatMap((floor) =>
    (floor.images ?? []).map((image, index) => ({
      id: `${floor.id}-${index}`,
      floorId: floor.id,
      floorLabel: floor.label,
      src: image.src,
      alt: image.alt,
      title: image.title ?? image.label,
      area: image.area ?? null,
      unitLabel: image.code ?? `Apartment # ${index + 1}`,
      status: image.status ?? 'available',
      buyer: image.buyer ?? null,
    })),
  )
}

function signatureInteriors(folderPart, altPrefix) {
  const images = Object.entries(signatureInteriorFiles)
    .filter(([key]) => key.includes(folderPart))
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
    .map(([key, src]) => {
      const file = key.split('/').pop()
      const label = file.replace(/\.[^.]+$/, '').replace(/\s+/g, ' ').trim()
      return { src, label, alt: `${altPrefix} — ${label}` }
    })

  if (!images.length) {
    throw new Error(`Missing Signature interiors: ${folderPart}`)
  }

  return images
}

function signatureInteriorPicks(folderPart, altPrefix, picks) {
  const images = signatureInteriors(folderPart, altPrefix)
  return picks.map(({ file, label }) => {
    const match = images.find((image) => image.label === file)
    if (!match) {
      throw new Error(`Missing Signature interior: ${folderPart} / ${file}`)
    }
    return { ...match, label, alt: `${altPrefix} — ${label}` }
  })
}

const dsaStudioImages = signatureInteriorPicks(
  'Studio Apartment Light Blue Theme',
  'Dayim Signature studio apartment',
  [
    { file: '1', label: 'Room' },
    { file: '3', label: 'Kitchen' },
    { file: '8', label: 'Bathroom' },
    { file: '5', label: 'Living' },
  ],
)
const dsaOneBedImages = signatureInteriorPicks(
  'One Bed Apartment Red Theme',
  'Dayim Signature one bedroom apartment',
  [
    { file: '2', label: 'Room' },
    { file: '9', label: 'Kitchen' },
    { file: '12', label: 'Bathroom' },
    { file: '1', label: 'Living' },
  ],
)
const dsaTwoBedImages = signatureInteriorPicks(
  '2 Bed Apartment White Gold Theme',
  'Dayim Signature two bedroom apartment',
  [
    { file: '06', label: 'Room' },
    { file: '04', label: 'Kitchen' },
    { file: '11', label: 'Bathroom' },
    { file: '01', label: 'Living' },
  ],
)
const dsaShopImages = signatureInteriorPicks(
  'Lower Ground Floor',
  'Dayim Signature retail and lobby',
  [
    { file: 'Front View Lobby 1', label: 'Lobby' },
    { file: 'Pharmacy', label: 'Pharmacy' },
    { file: 'Gift shop', label: 'Gift Shop' },
    { file: 'Grocery Shop', label: 'Grocery' },
  ],
)
const dsaOfficeImages = signatureInteriorPicks(
  '/5- Office/',
  'Dayim Signature office',
  [
    { file: '02', label: 'Workspace' },
    { file: '01', label: 'Lounge' },
    { file: '05', label: 'Meeting' },
    { file: '10', label: 'Cabin' },
  ],
)
const dsaFloors = [
  {
    id: 'lower-ground',
    label: 'Lower Ground',
    overview: overviewImage(
      'Floor Plans/Lower Ground.png',
      'Dayim Signature Apartments lower ground floor layout',
    ),
    images: dsaInventoryImages(
      '01- Lower Ground',
      'Dayim Signature Apartments lower ground',
    ),
  },
  {
    id: 'ground',
    label: 'Ground Floor',
    overview: overviewImage(
      'Floor Plans/Ground Floor.png',
      'Dayim Signature Apartments ground floor layout',
    ),
    images: dsaInventoryImages(
      '2- Ground Floor',
      'Dayim Signature Apartments ground floor',
    ),
  },
  {
    id: 'first',
    label: 'First Floor',
    overview: overviewImage(
      'Floor Plans/First Floor.png',
      'Dayim Signature Apartments first floor layout',
    ),
    images: dsaInventoryImages(
      '3- First Floor',
      'Dayim Signature Apartments first floor',
    ),
  },
  {
    id: 'second',
    label: '2nd Floor',
    overview: overviewImage(
      'Floor Plans/2nd to 4th Floor.png',
      'Dayim Signature Apartments 2nd to 4th floor layout',
    ),
    images: dsaInventoryImages(
      '4- Second Floor',
      'Dayim Signature Apartments 2nd floor',
    ),
  },
  {
    id: 'third',
    label: '3rd Floor',
    overview: overviewImage(
      'Floor Plans/2nd to 4th Floor.png',
      'Dayim Signature Apartments 2nd to 4th floor layout',
    ),
    images: dsaInventoryImages(
      '5- Third Floor',
      'Dayim Signature Apartments 3rd floor',
    ),
  },
  {
    id: 'fourth',
    label: '4th Floor',
    overview: overviewImage(
      'Floor Plans/2nd to 4th Floor.png',
      'Dayim Signature Apartments 2nd to 4th floor layout',
    ),
    images: dsaInventoryImages(
      '6- Fourth Floor',
      'Dayim Signature Apartments 4th floor',
    ),
  },
  {
    id: 'fifth',
    label: '5th Floor',
    overview: overviewImage(
      'Floor Plans/5th to 6th Floor.png',
      'Dayim Signature Apartments 5th to 6th floor layout',
    ),
    images: dsaInventoryImages(
      '7- Fifth Floor',
      'Dayim Signature Apartments 5th floor',
    ),
  },
  {
    id: 'sixth',
    label: '6th Floor',
    overview: overviewImage(
      'Floor Plans/5th to 6th Floor.png',
      'Dayim Signature Apartments 5th to 6th floor layout',
    ),
    images: dsaInventoryImages(
      '8- Sixth Floor',
      'Dayim Signature Apartments 6th floor',
    ),
  },
]

const livingLowerGroundImages = dlInventoryImages(
  '01- Lower Ground',
  'Dayim Living lower ground',
)
const livingGroundImages = dlInventoryImages(
  '02- Ground',
  'Dayim Living ground floor',
)
const livingResidentialImages = dlInventoryImages(
  '1st - 5th Floor',
  'Dayim Living 1st to 5th floor',
)

const livingStudioDeluxeImages = [
  {
    src: livingStudioDeluxeRoom,
    label: 'Room',
    alt: 'Dayim Living Studio Deluxe — room',
  },
  {
    src: livingStudioDeluxeLiving,
    label: 'Living',
    alt: 'Dayim Living Studio Deluxe — living',
  },
  {
    src: livingStudioDeluxeBath,
    label: 'Bathroom',
    alt: 'Dayim Living Studio Deluxe — bathroom',
  },
]

const livingExecutiveStudioImages = [
  {
    src: livingExecutiveStudioRoom,
    label: 'Room',
    alt: 'Dayim Living Executive Studio — room',
  },
  {
    src: livingExecutiveStudioLiving,
    label: 'Living',
    alt: 'Dayim Living Executive Studio — living',
  },
  {
    src: livingExecutiveStudioBath,
    label: 'Bathroom',
    alt: 'Dayim Living Executive Studio — bathroom',
  },
]

const livingResidentialOverview = dlOverviewImage(
  '1st-5th.png',
  'Dayim Living 1st to 5th floor studio apartments layout',
)

const livingFloors = [
  {
    id: 'lower-ground',
    label: 'Lower Ground',
    overview: dlOverviewImage(
      'Lower Ground.png',
      'Dayim Living lower ground floor layout',
    ),
    images: livingLowerGroundImages,
  },
  {
    id: 'ground',
    label: 'Ground Floor',
    overview: dlOverviewImage(
      'Ground.png',
      'Dayim Living ground floor layout',
    ),
    images: livingGroundImages,
  },
  {
    id: 'first',
    label: '1st Floor',
    overview: livingResidentialOverview,
    images: livingResidentialImages,
  },
  {
    id: 'second',
    label: '2nd Floor',
    overview: livingResidentialOverview,
    images: livingResidentialImages,
  },
  {
    id: 'third',
    label: '3rd Floor',
    overview: livingResidentialOverview,
    images: livingResidentialImages,
  },
  {
    id: 'fourth',
    label: '4th Floor',
    overview: livingResidentialOverview,
    images: livingResidentialImages,
  },
  {
    id: 'fifth',
    label: '5th Floor',
    overview: livingResidentialOverview,
    images: livingResidentialImages,
  },
]

const zindagiLowerGroundOverview = dzOverviewImage(
  'lower ground.png',
  'Dayim Zindagi lower ground floor layout',
)
const zindagiGroundOverview = dzOverviewImage(
  'ground.png',
  'Dayim Zindagi ground floor layout',
)
const zindagiFirstSecondOverview = dzOverviewImage(
  '1-2 floor.jpg',
  'Dayim Zindagi 1st to 2nd floor layout',
)
const zindagiThirdFifthOverview = dzOverviewImage(
  '3-5 floor.png',
  'Dayim Zindagi 3rd to 5th floor layout',
)
const zindagiSixthSeventhOverview = dzOverviewImage(
  '6-7 floor.jpg',
  'Dayim Zindagi 6th to 7th floor layout',
)

const zindagiLowerGroundImages = dzInventoryImages(
  '01- Lower Ground',
  'Dayim Zindagi lower ground',
)
const zindagiGroundImages = dzInventoryImages(
  '02- Ground Floor',
  'Dayim Zindagi ground floor',
)
const zindagiFirstImages = dzInventoryImages(
  '03- First Floor',
  'Dayim Zindagi first floor',
)
const zindagiSecondImages = dzInventoryImages(
  '04- Second Floor',
  'Dayim Zindagi second floor',
)
const zindagiThirdImages = dzInventoryImages(
  '05- Third Floor',
  'Dayim Zindagi third floor',
)
const zindagiFourthImages = dzInventoryImages(
  '06- Fourth Floor',
  'Dayim Zindagi fourth floor',
)
const zindagiFifthImages = dzInventoryImages(
  '07- Fifth Floor',
  'Dayim Zindagi fifth floor',
)
const zindagiSixthImages = dzInventoryImages(
  '08- Sixth Floor',
  'Dayim Zindagi sixth floor',
)
const zindagiSeventhImages = dzInventoryImages(
  '09- Seventh Floor',
  'Dayim Zindagi seventh floor',
)

const zindagiOutletPlan = dzPickImage('02- Ground Floor', 'Commercial Outlet')
const zindagiTwinTreatPlan = dzPickImage('01- Lower Ground', 'Twin Treat')
const zindagiStudioElitePlan = dzPickImage('03- First Floor', 'Studio Elite')
const zindagiStudioRoyalePlan = dzPickImage('03- First Floor', 'Studio Royale')
const zindagiOneBedElitePlan = dzPickImage('05- Third Floor', 'One Bed Elite')
const zindagiOneBedRoyalePlan = dzPickImage('05- Third Floor', 'One Bed Royale')
const zindagiOneBedBlueViewPlan = dzPickImage('08- Sixth Floor', 'Blue View')

const zindagiFloors = [
  {
    id: 'lower-ground',
    label: 'Lower Ground',
    overview: zindagiLowerGroundOverview,
    images: zindagiLowerGroundImages,
  },
  {
    id: 'ground',
    label: 'Ground Floor',
    overview: zindagiGroundOverview,
    images: zindagiGroundImages,
  },
  {
    id: 'first',
    label: '1st Floor',
    overview: zindagiFirstSecondOverview,
    images: zindagiFirstImages,
  },
  {
    id: 'second',
    label: '2nd Floor',
    overview: zindagiFirstSecondOverview,
    images: zindagiSecondImages,
  },
  {
    id: 'third',
    label: '3rd Floor',
    overview: zindagiThirdFifthOverview,
    images: zindagiThirdImages,
  },
  {
    id: 'fourth',
    label: '4th Floor',
    overview: zindagiThirdFifthOverview,
    images: zindagiFourthImages,
  },
  {
    id: 'fifth',
    label: '5th Floor',
    overview: zindagiThirdFifthOverview,
    images: zindagiFifthImages,
  },
  {
    id: 'sixth',
    label: '6th Floor',
    overview: zindagiSixthSeventhOverview,
    images: zindagiSixthImages,
  },
  {
    id: 'seventh',
    label: '7th Floor',
    overview: zindagiSixthSeventhOverview,
    images: zindagiSeventhImages,
  },
]

export const DEVELOPER = {
  name: 'Dayim Developers',
  tagline: 'Building Trust. Creating Lifestyles. Shaping the Future.',
  description:
    'At Dayim Developers, our vision is to redefine the future of real estate by setting new benchmarks in innovation, quality, and trust. We aspire to create iconic developments that inspire confidence, enrich communities, and deliver lasting value for generations to come.',
  story:
    'Led by our CEO, Waleed Ahmad, and Director, Ubaid Ullah, Dayim Developers is driven by the belief that real estate is more than constructing buildings—it is about creating communities, improving lifestyles, and delivering long-term value.',
}

function inventoryStatus(status) {
  const value = String(status ?? '').toLowerCase()
  if (value === 'sold') return 'sold'
  if (value === 'limited' || value === 'reserved') return 'reserved'
  return 'available'
}

function typologyInventoryFloor({ id, label, image, alt, units }) {
  return {
    id,
    label,
    overview: {
      src: image,
      label: 'Project overview',
      alt,
      title: 'Project overview',
      area: null,
      code: null,
      buyer: null,
      status: 'available',
    },
    images: units.map((unit) => ({
      src: image,
      alt: `${unit.type} — ${unit.area}`,
      label: unit.label,
      title: unit.type,
      area: unit.area,
      code: unit.label,
      buyer: null,
      status: inventoryStatus(unit.status),
    })),
  }
}

export const projects = [
  {
    id: 'dsa',
    title: 'Dayim Signature Apartments',
    short: 'A Signature Address',
    brand: 'DSA',
    subtitle: 'Broadway Commercial · Al-Kabir Town Phase 2, Lahore.',
    image: dsaImage,
    mark: dsaMark,
    address: [
      'Dayim Signature Apartments',
      'Broadway Commercial, Al-Kabir Town Phase 2, Opposite Lake City, Raiwind Road, Lahore, Pakistan.',
    ],
    mapsUrl: mapsSearch(
      'Dayim Signature Apartments, Broadway Commercial, Al-Kabir Town Phase 2, Lahore',
    ),
    x: 43,
    y: 69,
    mobile: { x: 42.5, y: 66.8 },
    kind: 'photo',
    about: {
      description:
        'Dayim Signature Apartments brings together contemporary design, premium amenities, and a prime location opposite Lake City. A professionally planned high-rise residential development offering lifestyle and investment value on Broadway Commercial.',
      highlights: [
        'Prime Location',
        'Contemporary High-rise Residential',
        'On Ground Delivered Project ( Possession Handed Over )',
        'Premium Amenities',
        'Construction Commenced April 2024',
      ],
    },
    plan: {
      floors: dsaFloors,
    },
    units: [
      {
        id: 'shop',
        label: 'Commercial Shop',
        type: 'Commercial Shop',
        area: 'Lower Ground',
        beds: null,
        status: 'Available',
        images: dsaShopImages,
      },
      {
        id: 'office',
        label: 'Commercial Office',
        type: 'Commercial Office',
        area: 'Ground & First Floor',
        beds: null,
        status: 'Available',
        images: dsaOfficeImages,
      },
      {
        id: 'studio',
        label: 'Studio',
        type: 'Studio Apartment',
        area: '360–410 sq ft',
        beds: 0,
        status: 'Available',
        images: dsaStudioImages,
      },
      {
        id: 'one-bed',
        label: 'One Bed',
        type: 'One Bedroom Apartment',
        area: '573–625 sq ft',
        beds: 1,
        status: 'Available',
        images: dsaOneBedImages,
      },
      {
        id: 'two-bed',
        label: 'Two Bed Apartments',
        type: 'Two Bedroom Apartment',
        area: '959 sq ft',
        beds: 2,
        status: 'Available',
        images: dsaTwoBedImages,
      },
    ],
  },
  {
    id: 'dayim-living',
    title: 'Dayim Living',
    short: 'Smart Living',
    brand: 'Dayim Living',
    subtitle: 'Block C Commercial · Al-Kabir Town Phase 2, Lahore.',
    image: livingImage,
    mark: livingMark,
    address: [
      'Dayim Living',
      'Block C Commercial, Al-Kabir Town Phase 2, Raiwind Road, Lahore, Pakistan.',
    ],
    mapsUrl: mapsSearch(
      'Dayim Living, Block C Commercial, Al-Kabir Town Phase 2, Lahore',
    ),
    x: 50,
    y: 71,
    mobile: { x: 50, y: 71 },
    kind: 'photo',
    about: {
      description: [
        'Introducing Dayim Living, our second development by Dayim Developers, located in the prime surroundings of Al-Kabir Town Phase 2.',
        'Designed as a hotel-service studio apartment building, Dayim Living is created for clients who want more than a conventional apartment. It offers a modern, managed living experience with amenities designed to make every stay comfortable while creating an attractive opportunity for rental income.',
        'With a structured 3-year payment plan and possession planned within 2 years, Dayim Living is designed to provide our clients with a practical path toward property ownership and income generation.',
      ],
      highlights: [
        'Hotel Service Studio Apartments',
        'Investment Potential',
        'Construction In Progress',
        'High Rental',
      ],
      typologies: 'Studio (Executive & Deluxe)',
    },
    story: {
      journey: {
        title: 'Construction Underway',
        body: 'Our goal is not simply to complete the project within the committed timeline. We aim to deliver before time wherever possible, continuing our track record of efficient project execution.',
        tagline: 'Hotel Service Living. High Rental.',
        items: [
          {
            id: 'living-excavation-1',
            phase: 'excavation',
            src: livingExcavation1,
            alt: 'Dayim Living excavation and site development progress',
            label: 'Excavation & Site Development',
            detail:
              'Excavation work at Dayim Living has been successfully completed, marking the beginning of our construction journey. The site has progressed rapidly from excavation toward the structural development phase.',
          },
          {
            id: 'living-excavation-2',
            phase: 'excavation',
            src: livingExcavation2,
            alt: 'Dayim Living excavation and site development progress',
            label: 'Excavation & Site Development',
            detail:
              'Excavation work at Dayim Living has been successfully completed, marking the beginning of our construction journey. The site has progressed rapidly from excavation toward the structural development phase.',
          },
          {
            id: 'living-excavation-3',
            phase: 'excavation',
            src: livingExcavation3,
            alt: 'Dayim Living excavation and site development progress',
            label: 'Excavation & Site Development',
            detail:
              'Excavation work at Dayim Living has been successfully completed, marking the beginning of our construction journey. The site has progressed rapidly from excavation toward the structural development phase.',
          },
          {
            id: 'living-pcc-1',
            phase: 'pcc',
            src: livingPcc1,
            alt: 'Dayim Living PCC and raft foundation progress',
            label: 'PCC & Raft Foundation',
            detail:
              'Following excavation, PCC (Plain Cement Concrete) work was completed to prepare the foundation base. The raft foundation work has now been successfully completed, providing a strong structural foundation and moving the project forward toward the Lower Ground and Ground Floor stages.',
          },
          {
            id: 'living-pcc-2',
            phase: 'pcc',
            src: livingPcc2,
            alt: 'Dayim Living PCC and raft foundation progress',
            label: 'PCC & Raft Foundation',
            detail:
              'Following excavation, PCC (Plain Cement Concrete) work was completed to prepare the foundation base. The raft foundation work has now been successfully completed, providing a strong structural foundation and moving the project forward toward the Lower Ground and Ground Floor stages.',
          },
          {
            id: 'living-pcc-3',
            phase: 'pcc',
            src: livingPcc3,
            alt: 'Dayim Living PCC and raft foundation progress',
            label: 'PCC & Raft Foundation',
            detail:
              'Following excavation, PCC (Plain Cement Concrete) work was completed to prepare the foundation base. The raft foundation work has now been successfully completed, providing a strong structural foundation and moving the project forward toward the Lower Ground and Ground Floor stages.',
          },
          {
            id: 'living-ground-1',
            phase: 'ground',
            src: livingGround1,
            alt: 'Dayim Living ground floor column and lift steel binding',
            label: 'Ground Floor – Column & Lift Steel Binding',
            detail:
              'Construction is progressing rapidly toward the Ground Floor. Steel binding work for the columns and lift structure is currently underway, forming the reinforcement required for the next stage of structural development.',
          },
          {
            id: 'living-ground-2',
            phase: 'ground',
            src: livingGround2,
            alt: 'Dayim Living ground floor column and lift steel binding',
            label: 'Ground Floor – Column & Lift Steel Binding',
            detail:
              'Construction is progressing rapidly toward the Ground Floor. Steel binding work for the columns and lift structure is currently underway, forming the reinforcement required for the next stage of structural development.',
          },
          {
            id: 'living-ground-3',
            phase: 'ground',
            src: livingGround3,
            alt: 'Dayim Living ground floor column and lift steel binding',
            label: 'Ground Floor – Column & Lift Steel Binding',
            detail:
              'Construction is progressing rapidly toward the Ground Floor. Steel binding work for the columns and lift structure is currently underway, forming the reinforcement required for the next stage of structural development.',
          },
        ],
      },
      floorPlans: [
        {
          id: 'living-lower-ground',
          ...dlOverviewImage(
            'Lower Ground.png',
            'Dayim Living lower ground floor layout',
          ),
          label: 'Lower Ground',
          detail: 'Commercial hall with lobby & service core',
          orientation: 'portrait',
        },
        {
          id: 'living-ground',
          ...dlOverviewImage(
            'Ground.png',
            'Dayim Living ground floor layout',
          ),
          label: 'Ground Floor',
          detail: 'Commercial hall with lobby & service core',
          orientation: 'portrait',
        },
        {
          id: 'living-1st-5th',
          ...livingResidentialOverview,
          label: '1st – 5th Floor',
          detail: 'Studio apartments with lobby, lift & balconies',
          orientation: 'portrait',
        },
      ],
      interiors: {
        brandLines: [ 'INTERIORS'],
        services: [
          {
            id: 'living-studio-deluxe',
            title: 'Studio Deluxe',
            images: livingStudioDeluxeImages,
            width: 1024,
            height: 768,
            text: 'Compact hotel-service studios planned for efficient city living.',
          },
          {
            id: 'living-executive-studio',
            title: 'Executive Studio',
            images: livingExecutiveStudioImages,
            width: 1024,
            height: 768,
            text: 'Larger studio layouts with more room for daily routines and guests.',
          },
        ],
      },
    },
    plan: {
      floors: livingFloors,
    },
    units: [
      {
        id: 'studio-deluxe',
        label: 'Studio Deluxe',
        type: 'Studio Deluxe',
        area: '268–354 Sq.Ft.',
        beds: 0,
        status: 'Available',
        images: livingStudioDeluxeImages,
      },
      {
        id: 'executive-studio',
        label: 'Executive Studio',
        type: 'Executive Studio',
        area: '425 Sq.Ft.',
        beds: 0,
        status: 'Available',
        images: livingExecutiveStudioImages,
      },
    ],
  },
  {
    id: 'dayim-zindagi',
    title: 'Dayim Zindagi',
    short: 'Zindagi Elevated',
    brand: 'Dayim Zindagi',
    subtitle: 'Business Bay Commercial · Al-Kabir Town Phase 2, Lahore.',
    image: zindagiImage,
    mark: zindagiMark,
    address: [
      'Dayim Zindagi',
      'Business Bay Commercial, Al-Kabir Town Phase 2, Main Raiwind Road, Lahore, Pakistan.',
    ],
    mapsUrl: mapsSearch(
      'Dayim Zindagi, Business Bay Commercial, Al-Kabir Town Phase 2, Lahore',
    ),
    x: 44,
    y: 59,
    mobile: { x: 44.5, y: 59 },
    kind: 'photo',
    about: {
      description:
        'Dayim Zindagi is positioned in Business Bay along Main Raiwind Road—a landmark address combining commercial potential with modern living. Designed for investors and residents seeking long-term value.',
      highlights: [
        'Luxury Living Experience',
        'Premium Lifestyle Above The City',
        'Construction Starting Soon',
        'Premium Amenities',
        'Construction Commenced April 2024',
      ],
    },
    story: {
      journey: {
        title: 'Zindagi Rising',
        body: 'A Business Bay landmark on Main Raiwind Road—commercial energy below, elevated living above.',
        tagline: 'Premium lifestyle. City presence.',
        items: [
          {
            id: 'zindagi-address',
            src: zindagiImage,
            alt: 'Dayim Zindagi landmark address',
            label: 'Address',
            detail: 'Business Bay Commercial on Main Raiwind Road—built for visibility and long-term value.',
          },
          {
            id: 'zindagi-mix',
            src: zindagiImage,
            alt: 'Dayim Zindagi mixed-use vision',
            label: 'Mix',
            detail: 'Shops, offices, and residences planned together for a complete urban lifestyle.',
          },
          {
            id: 'zindagi-launch',
            src: zindagiImage,
            alt: 'Dayim Zindagi construction launch',
            label: 'Launch',
            detail: 'Construction starting soon, with Dayim planning and supervision from day one.',
          },
          {
            id: 'zindagi-lifestyle',
            src: zindagiImage,
            alt: 'Dayim Zindagi premium lifestyle',
            label: 'Lifestyle',
            detail: 'Premium amenities and elevated living designed for residents above the city.',
          },
        ],
      },
      floorPlans: [
        {
          id: 'zindagi-lower-ground',
          ...zindagiLowerGroundOverview,
          label: 'Lower Ground',
          detail: 'Twin Treat 2 bed apartments',
          orientation: 'landscape',
        },
        {
          id: 'zindagi-ground',
          ...zindagiGroundOverview,
          label: 'Ground Floor',
          detail: 'Commercial outlets with street presence',
          orientation: 'landscape',
        },
        {
          id: 'zindagi-1-2',
          ...zindagiFirstSecondOverview,
          label: '1st – 2nd Floor',
          detail: 'Studio Elite & Royale apartments',
          orientation: 'landscape',
        },
        {
          id: 'zindagi-3-5',
          ...zindagiThirdFifthOverview,
          label: '3rd – 5th Floor',
          detail: 'One bed Elite & Royale apartments',
          orientation: 'landscape',
        },
        {
          id: 'zindagi-6-7',
          ...zindagiSixthSeventhOverview,
          label: '6th – 7th Floor',
          detail: 'One bed Elite, Royale & Blue View',
          orientation: 'landscape',
        },
      ],
      interiors: {
        brandLines: ['INTERIORS'],
        services: [
          {
            id: 'zindagi-outlet',
            title: 'Commercial Outlets',
            images: [{ src: zindagiOutletPlan.src, label: 'Outlet' }],
            width: 1024,
            height: 768,
            text: 'Ground-floor commercial outlets planned for visibility and foot traffic.',
          },
          {
            id: 'zindagi-twin',
            title: 'Twin Treat 2 Bed',
            images: [{ src: zindagiTwinTreatPlan.src, label: 'Residence' }],
            width: 1024,
            height: 768,
            text: 'Lower-ground twin treat apartments designed for spacious city living.',
          },
          {
            id: 'zindagi-studio',
            title: 'Studio Apartments',
            images: [
              { src: zindagiStudioElitePlan.src, label: 'Elite' },
              { src: zindagiStudioRoyalePlan.src, label: 'Royale' },
            ],
            width: 1024,
            height: 768,
            text: 'Studio Elite and Royale layouts for efficient elevated living.',
          },
          {
            id: 'zindagi-onebed',
            title: 'One Bed Apartments',
            images: [
              { src: zindagiOneBedElitePlan.src, label: 'Elite' },
              { src: zindagiOneBedRoyalePlan.src, label: 'Royale' },
              { src: zindagiOneBedBlueViewPlan.src, label: 'Blue View' },
            ],
            width: 1024,
            height: 768,
            text: 'One bed Elite, Royale, and Blue View homes above Business Bay.',
          },
        ],
      },
    },
    plan: {
      floors: zindagiFloors,
    },
    units: [
      {
        id: 'zindagi-outlet',
        label: 'Outlet',
        type: 'Commercial Outlet',
        area: '1,229–1,382 Sq.Ft.',
        beds: null,
        status: 'Available',
        images: [
          {
            src: zindagiOutletPlan.src,
            label: 'Outlet',
            alt: 'Dayim Zindagi commercial outlet',
          },
        ],
      },
      {
        id: 'zindagi-twin',
        label: 'Twin Treat',
        type: '2 Bedroom Apartment',
        area: '664–813 Sq.Ft.',
        beds: 2,
        status: 'Available',
        images: [
          {
            src: zindagiTwinTreatPlan.src,
            label: 'Residence',
            alt: 'Dayim Zindagi Twin Treat 2 bedroom',
          },
        ],
      },
      {
        id: 'zindagi-studio',
        label: 'Studio',
        type: 'Studio Apartment',
        area: '357–434 Sq.Ft.',
        beds: 0,
        status: 'Available',
        images: [
          {
            src: zindagiStudioElitePlan.src,
            label: 'Elite',
            alt: 'Dayim Zindagi Studio Elite',
          },
          {
            src: zindagiStudioRoyalePlan.src,
            label: 'Royale',
            alt: 'Dayim Zindagi Studio Royale',
          },
        ],
      },
      {
        id: 'zindagi-onebed',
        label: 'One Bed',
        type: 'One Bedroom Apartment',
        area: '444–778 Sq.Ft.',
        beds: 1,
        status: 'Available',
        images: [
          {
            src: zindagiOneBedElitePlan.src,
            label: 'Elite',
            alt: 'Dayim Zindagi One Bed Elite',
          },
          {
            src: zindagiOneBedRoyalePlan.src,
            label: 'Royale',
            alt: 'Dayim Zindagi One Bed Royale',
          },
          {
            src: zindagiOneBedBlueViewPlan.src,
            label: 'Blue View',
            alt: 'Dayim Zindagi One Bed Blue View',
          },
        ],
      },
    ],
  },
]

export function getProjectPath(id) {
  return `/projects/${id}`
}

export function getProjectInventoryPath(id) {
  return `/projects/${id}/inventory`
}

export function getProjectById(id) {
  return projects.find((project) => project.id === id) ?? null
}
