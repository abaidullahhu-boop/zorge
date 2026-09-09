import dsaImage from '../assets/images/dayim-signature.png'
import livingImage from '../assets/images/dayim-living.png'
import zindagiImage from '../assets/images/dayim-zindagi.png'

const signaturePlanFiles = import.meta.glob(
  '../assets/images/Signature floor plans/FLOOR PLANS/Floor Plans/*.png',
  { eager: true, import: 'default' },
)

const dsaInventoryFiles = import.meta.glob(
  '../assets/images/DSA Inventory /**/*.{png,jpg,jpeg,PNG,JPG,JPEG}',
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
    /^(Studio Executive|Studio Deluxe|One Bed Executive|One Bed Deluxe|2 Bed Executive)/i,
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
    title = 'Office'
    code = `Office # ${officeMatch[1].padStart(2, '0')}`
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

function dsaInventoryImages(folderHint, altPrefix) {
  const typeOrder = [
    'Studio Executive',
    'Studio Deluxe',
    'One Bed Executive',
    'One Bed Deluxe',
    '2 Bed Executive',
    'Shop',
    'Commercial Hall',
    'Office',
  ]

  const images = Object.entries(dsaInventoryFiles)
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
    throw new Error(`Missing DSA inventory images: ${folderHint}`)
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
const dsaRooftopImages = signatureInteriorPicks(
  '/6- Rooftop/',
  'Dayim Signature rooftop lounge',
  [
    { file: 'IMG_4568', label: 'Bar' },
    { file: 'IMG_4567', label: 'Lounge' },
    { file: 'IMG_4570', label: 'Seating' },
    { file: 'IMG_4575', label: 'View' },
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

export const DEVELOPER = {
  name: 'Dayim Developers',
  tagline: 'Building Trust. Creating Lifestyles. Shaping the Future.',
  description:
    'At Dayim Developers, our vision is to redefine the future of real estate by setting new benchmarks in innovation, quality, and trust. We aspire to create iconic developments that inspire confidence, enrich communities, and deliver lasting value for generations to come.',
  story:
    'Led by our CEO, Waleed Ahmad, and Director, Ubaid Ullah, Dayim Developers is driven by the belief that real estate is more than constructing buildings—it is about creating communities, improving lifestyles, and delivering long-term value.',
}

export const projects = [
  {
    id: 'dsa',
    title: 'Dayim Signature Apartments',
    short: 'A Signature Address. A Smarter Way to Live',
    brand: 'DSA',
    subtitle: 'Broadway Commercial · Al-Kabir Town Phase 2, Lahore.',
    image: dsaImage,
    mapsUrl: 'https://share.google/1Z56ADgZS5XvUwBgB',
    x: 43,
    y: 69,
    mobile: { x: 42.5, y: 66.8 },
    kind: 'photo',
    about: {
      description:
        'Dayim Signature Apartments brings together contemporary design, premium amenities, and a prime location opposite Lake City. A professionally planned high-rise residential development offering lifestyle and investment value on Broadway Commercial.',
      highlights: [
        'Prime Location',
        'Temporary High-rise Residential',
        'On Ground Delivered Project ( Possession Harded Over )',
        'Premium Amenities',
        'Construction Commenced April 2024',
      ],
    },
    plan: {
      floors: dsaFloors,
    },
    units: [
      {
        id: 'studio',
        label: 'Studio',
        type: 'Studio',
        area: '360–410 sq ft',
        beds: 0,
        status: 'Available',
        images: dsaStudioImages,
      },
      {
        id: 'one-bed',
        label: 'One Bed',
        type: 'One Bedroom',
        area: '573–625 sq ft',
        beds: 1,
        status: 'Available',
        images: dsaOneBedImages,
      },
      {
        id: 'two-bed',
        label: 'Two Bed',
        type: 'Two Bedroom',
        area: '959 sq ft',
        beds: 2,
        status: 'Available',
        images: dsaTwoBedImages,
      },
      {
        id: 'shop',
        label: 'Shop',
        type: 'Retail Shop',
        area: 'Lower Ground',
        beds: null,
        status: 'Available',
        images: dsaShopImages,
      },
      {
        id: 'office',
        label: 'Office',
        type: 'Office / Commercial Hall',
        area: 'Ground & First Floor',
        beds: null,
        status: 'Available',
        images: dsaOfficeImages,
      },
      {
        id: 'rooftop',
        label: 'Rooftop',
        type: 'Rooftop Lounge',
        area: 'Shared amenity',
        beds: null,
        status: 'Included',
        images: dsaRooftopImages,
      },
    ],
  },
  {
    id: 'living',
    title: 'Dayim Living',
    short: 'Smart Living',
    subtitle: 'Block C Commercial · Al-Kabir Town Phase 2, Lahore.',
    image: livingImage,
    mapsUrl: 'https://share.google/uQuucywNcsJaxM1TJ',
    x: 50,
    y: 71,
    mobile: { x: 50, y: 71 },
    kind: 'photo',
    about: {
      description:
        'Dayim Living offers thoughtfully designed residential spaces in the heart of Al-Kabir Town Phase 2. Built with the same commitment to quality and trust that defines every Dayim development.',
      highlights: [
        'Hotel Service Studio Apartments',
        'Investment Potential',
        'Construction In Process',
        'On Ground Delivered Project ( Possession Harded Over )',
      ],
    },
    plan: {
      images: [{ src: livingImage, alt: 'Dayim Living project overview' }],
    },
    units: [
      { id: 'living-2bed', label: '2 Bed', type: '2 Bedroom', area: '900 sq ft', beds: 2, status: 'Available' },
      { id: 'living-3bed', label: '3 Bed', type: '3 Bedroom', area: '1,100 sq ft', beds: 3, status: 'Available' },
      { id: 'living-4bed', label: '4 Bed', type: '4 Bedroom', area: '1,400 sq ft', beds: 4, status: 'Enquire' },
    ],
  },
  {
    id: 'zindagi',
    title: 'Dayim Zindagi',
    short: 'Zindagi Elevated',
    subtitle: 'Business Bay Commercial · Al-Kabir Town Phase 2, Lahore.',
    image: zindagiImage,
    mapsUrl: 'https://share.google/ntyEvG8FmQl5EgXMT',
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
    plan: {
      images: [{ src: zindagiImage, alt: 'Dayim Zindagi project overview' }],
    },
    units: [
      { id: 'zindagi-shop', label: 'Shop', type: 'Commercial Shop', area: '350 sq ft', beds: null, status: 'Available' },
      { id: 'zindagi-office', label: 'Office', type: 'Office Space', area: '800 sq ft', beds: null, status: 'Available' },
      { id: 'zindagi-2bed', label: '2 Bed', type: '2 Bedroom Apartment', area: '950 sq ft', beds: 2, status: 'Limited' },
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
