import dsaImage from '../assets/images/dayim-signature.png'
import livingImage from '../assets/images/dayim-living.png'
import zindagiImage from '../assets/images/dayim-zindagi.png'
import dsaCover from '../assets/images/dayim-signature-cover.jpg'
import livingCover from '../assets/images/dayim-living-cover.jpg'
import zindagiCover from '../assets/images/dayim-zindagi-cover.jpg'
import dsaVideoPoster from '../assets/images/dayim-signature-start.jpg'
import livingVideoPoster from '../assets/images/dayim-living-start.jpg'
import zindagiVideoPoster from '../assets/images/dayim-zindagi-start.jpg'
import dsaVideo from '../assets/images/ds.mp4'
import livingVideo from '../assets/images/dl.mp4'
import zindagiVideo from '../assets/images/dz.mp4'
import dsaMark from '../assets/images/dsmark.png'
import livingMark from '../assets/images/dlmask.png'
import livingEnquireImage from '../assets/images/living-facilities.jpg'
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
import livingSlab1 from '../assets/images/living-slab-1.jpg'
import livingSlab2 from '../assets/images/living-slab-2.jpg'
import livingSlab3 from '../assets/images/living-slab-3.jpg'
import livingStudioDeluxeRoom from '../assets/images/03.jpg'
import livingStudioDeluxeLiving from '../assets/images/04.jpg'
import livingStudioDeluxeBath from '../assets/images/011.jpg'
import livingExecutiveStudioRoom from '../assets/images/05.jpg'
import livingExecutiveStudioLiving from '../assets/images/06.jpg'
import livingExecutiveStudioBath from '../assets/images/08.jpg'
import dsaStudio1 from '../assets/images/sstudio.png'
import dsaStudio2 from '../assets/images/sstudio2.png'
import dsaStudio3 from '../assets/images/sstudio3.png'
import dsaOneBedRoom from '../assets/images/sroom.jpg'
import dsaOneBedBath from '../assets/images/bath2.jpg'
import zindagiStudio1 from '../assets/images/z1.png'
import zindagiStudio2 from '../assets/images/z2.png'
import zindagiStudio3 from '../assets/images/z3.png'
import zindagiStudio4 from '../assets/images/z4.png'
import zindagiStudioPlan from '../assets/images/zstudio.png'
import zindagiOneBed1 from '../assets/images/zone1.png'
import zindagiOneBed2 from '../assets/images/zone2.png'
import zindagiOneBed3 from '../assets/images/zone3.png'
import zindagiOneBed4 from '../assets/images/zone4.png'
import zindagiOneBed5 from '../assets/images/zone5.png'
import zindagiOneBedPlan from '../assets/images/z1bed.png'
import zindagiTwoBed1 from '../assets/images/ztwo.png'
import zindagiTwoBed2 from '../assets/images/ztwo2.png'
import zindagiTwoBed3 from '../assets/images/ztwo3.png'
import zindagiTwoBed4 from '../assets/images/ztow4.png'
import zindagiTwoBed5 from '../assets/images/ztow5.png'
import zindagiTwoBed6 from '../assets/images/ztwo6.png'
import zindagiTwoBed7 from '../assets/images/zindagi1.png'
import zindagiTwoBedPlan from '../assets/images/z2bed.png'
import zindagiRooftop1 from '../assets/images/rooftop.jpg'
import zindagiRooftop2 from '../assets/images/rooftop2.jpg'
import zindagiRooftop3 from '../assets/images/rooftop3.jpg'
import zindagiLowerGroundPlan from '../assets/images/lowerground.png'
import zindagiGroundPlan from '../assets/images/ground.png'
import zindagiFirstSecondPlan from '../assets/images/1-2floor.png'
import zindagiThirdFifthPlan from '../assets/images/3-5floor.png'
import zindagiSixthSeventhPlan from '../assets/images/6-7floor.png'
import zindagiConstruction1 from '../assets/images/zcon.jpeg'
import zindagiConstruction2 from '../assets/images/zcon2.jpeg'

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
    'Studio Deluxe',
    'Executive Studio',
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

const dsaStudioImages = [
  {
    src: dsaStudio3,
    label: 'Bedroom',
    alt: 'Dayim Signature studio apartment — bedroom',
  },
  {
    src: dsaStudio1,
    label: 'Kitchen',
    alt: 'Dayim Signature studio apartment — kitchen',
  },
  {
    src: dsaStudio2,
    label: 'Bathroom',
    alt: 'Dayim Signature studio apartment — bathroom',
  },
]
const dsaOneBedImages = [
  ...signatureInteriorPicks(
    'One Bed Apartment Red Theme',
    'Dayim Signature one bedroom apartment',
    [
      { file: '2', label: 'Room' },
      { file: '9', label: 'Kitchen' },
      { file: '12', label: 'Bathroom' },
      { file: '1', label: 'Living' },
    ],
  ),
  {
    src: dsaOneBedRoom,
    label: 'Bedroom',
    alt: 'Dayim Signature one bedroom apartment — bedroom',
  },
  {
    src: dsaOneBedBath,
    label: 'Bath',
    alt: 'Dayim Signature one bedroom apartment — bathroom',
    orientation: 'portrait',
    width: 2443,
    height: 2780,
  },
]
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
    alt: 'Dayim Living Studio Apartment (Deluxe) — room',
  },
  {
    src: livingStudioDeluxeLiving,
    label: 'Living',
    alt: 'Dayim Living Studio Apartment (Deluxe) — living',
  },
  
]

const livingExecutiveStudioImages = [
  {
    src: livingExecutiveStudioRoom,
    label: 'Room',
    alt: 'Dayim Living Studio Apartment (Executive) — room',
  },
  {
    src: livingExecutiveStudioLiving,
    label: 'Living',
    alt: 'Dayim Living Studio Apartment (Executive) — living',
  },
  {
    src: livingExecutiveStudioBath,
    label: 'Bathroom',
    alt: 'Dayim Living Studio Apartment (Executive) — bathroom',
  },
  {
    src: livingStudioDeluxeBath,
    label: 'Bathroom',
    alt: 'Dayim Living Studio Apartment (Deluxe) — bathroom',
  },
]

const livingStudioApartmentImages = [
  ...livingStudioDeluxeImages,
  ...livingExecutiveStudioImages,
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

function zindagiFloorOverview(src, alt) {
  return {
    src,
    label: 'Floor layout',
    alt,
    title: 'Floor layout',
    area: null,
    code: null,
    buyer: null,
    status: 'available',
  }
}

const zindagiLowerGroundOverview = zindagiFloorOverview(
  zindagiLowerGroundPlan,
  'Dayim Zindagi lower ground floor layout',
)
const zindagiGroundOverview = zindagiFloorOverview(
  zindagiGroundPlan,
  'Dayim Zindagi ground floor layout',
)
const zindagiFirstSecondOverview = zindagiFloorOverview(
  zindagiFirstSecondPlan,
  'Dayim Zindagi 1st to 2nd floor layout',
)
const zindagiThirdFifthOverview = zindagiFloorOverview(
  zindagiThirdFifthPlan,
  'Dayim Zindagi 3rd to 5th floor layout',
)
const zindagiSixthSeventhOverview = zindagiFloorOverview(
  zindagiSixthSeventhPlan,
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

const zindagiStudioInteriorImages = [
  {
    src: zindagiStudio1,
    label: 'Living',
    alt: 'Dayim Zindagi Studio Apartment — living',
  },
  {
    src: zindagiStudio2,
    label: 'Kitchen',
    alt: 'Dayim Zindagi Studio Apartment — kitchen',
  },
  {
    src: zindagiStudio3,
    label: 'Bedroom',
    alt: 'Dayim Zindagi Studio Apartment — bedroom',
  },
  {
    src: zindagiStudio4,
    label: 'Interior',
    alt: 'Dayim Zindagi Studio Apartment — interior',
  },
]

const zindagiOneBedInteriorImages = [
  {
    src: zindagiOneBed1,
    label: 'Living',
    alt: 'Dayim Zindagi One Bedroom Apartment — living',
  },
  {
    src: zindagiOneBed2,
    label: 'Bedroom',
    alt: 'Dayim Zindagi One Bedroom Apartment — bedroom',
  },
  {
    src: zindagiOneBed3,
    label: 'Kitchen',
    alt: 'Dayim Zindagi One Bedroom Apartment — kitchen',
  },
  {
    src: zindagiOneBed5,
    label: 'Balcony',
    alt: 'Dayim Zindagi One Bedroom Apartment — balcony',
  },
  {
    src: zindagiOneBed4,
    label: 'Interior',
    alt: 'Dayim Zindagi One Bedroom Apartment — interior',
  },
]

const zindagiTwoBedInteriorImages = [
  {
    src: zindagiTwoBed6,
    label: 'Interior',
    alt: 'Dayim Zindagi Two Bedroom Apartment — interior',
  },
  {
    src: zindagiTwoBed5,
    label: 'Bathroom',
    alt: 'Dayim Zindagi Two Bedroom Apartment — bathroom',
  },
  
  {
    src: zindagiTwoBed1,
    label: 'Living',
    alt: 'Dayim Zindagi Two Bedroom Apartment — living',
  },
  
  {
    src: zindagiTwoBed3,
    label: 'Kitchen',
    alt: 'Dayim Zindagi Two Bedroom Apartment — kitchen',
  },
  {
    src: zindagiTwoBed4,
    label: 'Dining',
    alt: 'Dayim Zindagi Two Bedroom Apartment — dining',
  },
  {
    src: zindagiTwoBed7,
    label: 'Bathroom',
    alt: 'Dayim Zindagi Two Bedroom Apartment — bathroom',
  },
]

const zindagiRooftopImages = [
  {
    src: zindagiRooftop1,
    label: 'Bar',
    alt: 'Dayim Zindagi Rooftop Garden — bar lounge',
  },
  {
    src: zindagiRooftop2,
    label: 'Overview',
    alt: 'Dayim Zindagi Rooftop Garden — aerial overview',
  },
  {
    src: zindagiRooftop3,
    label: 'Lounge',
    alt: 'Dayim Zindagi Rooftop Garden — lounge seating',
  },
]

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
    id: 'dayim-signature-apartments',
    title: 'Dayim Signature Apartments',
    short: 'A Signature Address',
    brand: 'Dayim Signature Apartments',
    subtitle: 'Broadway Commercial, Al-Kabir Town Phase 2, Lahore.',
    status: 'Delivered ( Possession Handed Over )',
    image: dsaImage,
    cover: dsaCover,
    video: dsaVideo,
    videoPoster: dsaVideoPoster,
    mark: dsaMark,
    enquireImage: livingEnquireImage,
    address: [
      'Dayim Signature Apartments',
      'Broadway Commercial, Al-Kabir Town Phase 2, Opposite Lake City, Raiwind Road, Lahore, Pakistan.',
    ],
    mapsUrl: mapsSearch(
      'Dayim Signature Apartments, Broadway Commercial, Al-Kabir Town Phase 2, Lahore',
    ),
    downloads: {
      catalog: '/downloads/signaturecatalogue.pdf',
      paymentPlan: '/downloads/signature-payment-plan.pdf',
    },
    x: 43,
    y: 69,
    mobile: { x: 42.5, y: 66.8 },
    kind: 'photo',
    cardHighlights: [
      'Premium High-Rise Living',
      'Contemporary Architectural Design',
      'Thoughtfully Planned Apartments',
    ],
    about: {
      description: [
        'Dayim Signature Apartments is a thoughtfully designed high-rise residential, created for those who value modern living, quality construction, convenience, and long-term investment potential.',
        'Designed to bring together contemporary architecture, comfortable living spaces, and essential lifestyle amenities, Dayim Signature Apartments offers residents an elevated urban living experience in a location designed for accessibility and convenience.',
      ],
      highlights: [
        'Premium High-Rise Living',
        'Contemporary Architectural Design',
        'Thoughtfully Planned Apartments',
        'Modern Lifestyle Amenities',
        'Secure & Comfortable Environment',
        'Prime Location',
        'Quality Construction',
        'Strong Investment Potential',
        'Professional Project Management',
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
        type: 'Studio Apartments',
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
        label: 'Two Bed',
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
    subtitle: 'Block C Commercial, Al-Kabir Town Phase 2, Lahore.',
    status: 'Under Construction',
    image: livingImage,
    cover: livingCover,
    video: livingVideo,
    videoPoster: livingVideoPoster,
    mark: livingMark,
    enquireImage: livingEnquireImage,
    address: [
      'Dayim Living',
      'Block C Commercial, Al-Kabir Town Phase 2, Raiwind Road, Lahore, Pakistan.',
    ],
    mapsUrl: mapsSearch(
      'Dayim Living, Block C Commercial, Al-Kabir Town Phase 2, Lahore',
    ),
    downloads: {
      catalog: '/downloads/livingcatalogue.pdf',
      paymentPlan: '/downloads/living-payment-plan.pdf',
    },
    x: 50,
    y: 71,
    mobile: { x: 50, y: 71 },
    kind: 'photo',
    cardHighlights: [
      'Designed for Rental Income',
      'Hotel-Service Living',
      'Smart Investment Opportunity',
    ],
    about: {
      headline: 'WHERE MODERN LIVING FINDS IT’S PLACE.',
      description: [
        'Introducing Dayim Living, our second development by Dayim Developers, located in the prime surroundings of Al-Kabir Town Phase 2.',
        'Designed as a hotel-service studio apartment building, Dayim Living is created for clients who want more than a conventional apartment. It offers a modern, managed living experience with amenities designed to make every stay comfortable while creating an attractive opportunity for rental income.',
        'With a structured 3-year payment plan and possession planned within 2 years, Dayim Living is designed to provide our clients with a practical path toward property ownership and income generation.',
      ],
      highlights: [
        'Designed for Rental Income',
        'Hotel-Service Living',
        'Smart Investment Opportunity',
        'Comfort Meets Convenience',
        'Professionally Managed Living',
        'Designed for Modern Lifestyles',
        'A Location with Potential',
        'Built for Long-Term Value',
        'Your Property, Your Income',
        'Live Well. Invest Smart.',
      ],
      typologies: 'Commercial Outlet, Studio Apartment (Executive & Deluxe)',
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
          {
            id: 'living-slab-1',
            phase: 'slab',
            src: livingSlab1,
            alt: 'Dayim Living ground floor slab shuttering',
            label: 'Ground Floor – Slab Shuttering, Rebar & Concrete Pouring',
            detail:
              'Following the completion of the Lower Ground Floor slab, the project has progressed rapidly into the ground-floor structural phase. Slab shuttering and rebar work have been successfully completed, followed by the successful concrete pouring of the Ground Floor slab.',
          },
          {
            id: 'living-slab-2',
            phase: 'slab',
            src: livingSlab2,
            alt: 'Dayim Living ground floor slab shuttering',
            label: 'Ground Floor – Slab Shuttering, Rebar & Concrete Pouring',
            detail:
              'Following the completion of the Lower Ground Floor slab, the project has progressed rapidly into the ground-floor structural phase. Slab shuttering and rebar work have been successfully completed, followed by the successful concrete pouring of the Ground Floor slab.',
          },
          {
            id: 'living-slab-3',
            phase: 'slab',
            src: livingSlab3,
            alt: 'Dayim Living ground floor slab shuttering',
            label: 'Ground Floor – Slab Shuttering, Rebar & Concrete Pouring',
            detail:
              'Following the completion of the Lower Ground Floor slab, the project has progressed rapidly into the ground-floor structural phase. Slab shuttering and rebar work have been successfully completed, followed by the successful concrete pouring of the Ground Floor slab.',
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
            id: 'living-studio-apartment',
            title: 'Studio Apartment',
            subtitle: '(Executive or Deluxe)',
            images: livingStudioApartmentImages,
            width: 1024,
            height: 768,
            text: 'Compact hotel-service studios planned for efficient city living.',
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
    subtitle: 'Business Bay Commercial, Al-Kabir Town Phase 2, Lahore.',
    status: 'Construction Starting Soon',
    image: zindagiImage,
    cover: zindagiCover,
    video: zindagiVideo,
    videoPoster: zindagiVideoPoster,
    mark: zindagiMark,
    address: [
      'Dayim Zindagi',
      'Business Bay Commercial, Al-Kabir Town Phase 2, Main Raiwind Road, Lahore, Pakistan.',
    ],
    mapsUrl: mapsSearch(
      'Dayim Zindagi, Business Bay Commercial, Al-Kabir Town Phase 2, Lahore',
    ),
    downloads: {
      catalog: '/downloads/zindagi-catalogue.pdf',
      paymentPlan: '/downloads/zindagi-payment-plan.pdf',
    },
    x: 44,
    y: 59,
    mobile: { x: 44.5, y: 59 },
    kind: 'photo',
    cardHighlights: [
      'Luxury Living Experience',
      'Premium Lifestyle Above The City',
      'Construction Starting Soon',
    ],
    about: {
      headline: 'ELEVATED THE WAY YOU LIVE WITH A NEW STANDARD OF LUXURY',
      description: [
        'Introducing Dayim Zindagi, our newly launched project created for those who believe that a home should be more than a place to live—it should be an experience.',
        'Located in Business Bay Commercial, Al-Kabir Town Phase 2, one of the prominent commercial destinations of Al-Kabir Developers, Dayim Zindagi is a corner building designed to bring together modern architecture, premium amenities, convenience, and an elevated lifestyle.',
        'With thoughtfully designed residential options and a flexible 4-year payment plan, Dayim Zindagi offers an opportunity to own a modern home in a prime commercial location, with possession planned within 3 years.',
      ],
      highlights: [
        'Modern & Luxury Design',
        'Luxury One-Bedroom Residences',
        'Private Balcony',
        'Resort-Inspired Living',
        'Rooftop Garden',
        'Panoramic City Views',
        'Prime Location',
        'Secure Investment',
        'Family-Friendly Environment',
        'Premium Lifestyle',
        'High-Quality Construction',
      ],
      typologies: 'Commercial Outlet, Studio, One Bed, Two Bed Apartments',
    },
    story: {
      journey: {
        title: 'Construction Underway',
        body: 'The journey of Dayim Zindagi has officially begun. With work commencing earlier than anticipated, we are moving forward with our commitment to build with precision, quality, and purpose.',
        tagline: 'Premium lifestyle. City presence.',
        items: [
          {
            id: 'zindagi-construction-1',
            phase: 'construction',
            src: zindagiConstruction1,
            alt: 'Dayim Zindagi construction progress on site',
            label: 'Geotechnical Testing',
            detail:
              'This crucial step helps determine the strength, composition, and bearing capacity of the soil. It allows our technical team to plan a secure, stable, and strong foundation for the project. ',
          },
          {
            id: 'zindagi-construction-2',
            phase: 'construction',
            src: zindagiConstruction2,
            alt: 'Dayim Zindagi construction progress on site',
            label: 'Construction Progress',
            detail:
              'Work is underway at Dayim Zindagi with Dayim supervision—building forward with the quality and pace our clients expect.',
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
        title: 'Homes Designed Around Your Lifestyle',
        body: 'Dayim Zindagi offers a range of apartment options designed to suit different lifestyles, needs, and investment goals.',
        services: [
          {
            id: 'zindagi-studio',
            title: 'Studio Apartments',
            images: zindagiStudioInteriorImages,
            plan: zindagiStudioPlan,
            width: 1024,
            height: 768,
            text: 'Smartly planned studio residences designed for modern individuals seeking comfort, convenience, and efficient use of space.',
          },
          {
            id: 'zindagi-onebed',
            title: 'Luxury One-Bedroom Apartments with Private Pool',
            images: zindagiOneBedInteriorImages,
            plan: zindagiOneBedPlan,
            width: 1024,
            height: 768,
            text: 'Experience a truly distinctive lifestyle with our luxury one-bedroom apartments featuring a private pool on the balcony—a premium concept designed for those who want privacy, exclusivity, and resort-style living at home.',
          },
          {
            id: 'zindagi-twin',
            title: 'Two-Bedroom Apartments',
            images: zindagiTwoBedInteriorImages,
            plan: zindagiTwoBedPlan,
            width: 1024,
            height: 768,
            text: 'Spacious two-bedroom residences designed for families who want additional space without compromising on style and convenience.',
          },
        ],
      },
      rooftop: {
        kicker: 'Rooftop Garden',
        images: [
          {
            id: 'zindagi-rooftop-bar',
            ...zindagiRooftopImages[0],
            label: 'Bar Lounge',
            detail:
              'Ambient seating and a rooftop bar designed for evening gatherings under the city sky.',
          },
          
          {
            id: 'zindagi-rooftop-lounge',
            ...zindagiRooftopImages[2],
            label: 'Lounge Seating',
            detail:
              'Dedicated lounge and BBQ spaces planned for celebrations and memorable evenings above the city.',
          },
          {
            id: 'zindagi-rooftop-overview',
            ...zindagiRooftopImages[1],
            label: 'Garden Overview',
            detail:
              'An elevated garden with panoramic views across Business Bay and the surrounding skyline.',
          },
        ],
      },
    },
    plan: {
      floors: zindagiFloors,
    },
    units: [
      {
        id: 'zindagi-twin',
        label: 'Twin Treat',
        type: '2 Bedroom Apartment',
        area: '664–813 Sq.Ft.',
        beds: 2,
        status: 'Available',
        images: zindagiTwoBedInteriorImages,
      },
      {
        id: 'zindagi-studio',
        label: 'Studio',
        type: 'Studio Apartment',
        area: '357–434 Sq.Ft.',
        beds: 0,
        status: 'Available',
        images: zindagiStudioInteriorImages,
      },
      {
        id: 'zindagi-onebed',
        label: 'One Bed',
        type: 'One Bedroom Apartment',
        area: '444–778 Sq.Ft.',
        beds: 1,
        status: 'Available',
        images: zindagiOneBedInteriorImages,
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
