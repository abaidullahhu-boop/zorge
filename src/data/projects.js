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

const dlInventoryFiles = import.meta.glob(
  '../assets/images/dl-inventory/**/*.{png,jpg,jpeg,PNG,JPG,JPEG}',
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
    images: livingResidentialImages,
  },
  {
    id: 'second',
    label: '2nd Floor',
    images: livingResidentialImages,
  },
  {
    id: 'third',
    label: '3rd Floor',
    images: livingResidentialImages,
  },
  {
    id: 'fourth',
    label: '4th Floor',
    images: livingResidentialImages,
  },
  {
    id: 'fifth',
    label: '5th Floor',
    images: livingResidentialImages,
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
    brand: 'Living',
    subtitle: 'Block C Commercial · Al-Kabir Town Phase 2, Lahore.',
    image: livingImage,
    mapsUrl: 'https://share.google/uQuucywNcsJaxM1TJ',
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
        'Hotel Service Living',
        'High Rental',
      ],
      typologies: 'Studio (Executive & Deluxe)',
    },
    story: {
      journey: {
        title: 'Construction Underway',
        body: 'Construction of Dayim Living is already in progress. We have successfully completed key foundation-stage milestones.',
        tagline: 'Hotel Service Living. High Rental.',
        items: [
          {
            id: 'living-vision',
            src: livingImage,
            alt: 'Dayim Living project vision',
            label: 'Raft work completed',
            detail:
              'The raft work has been completed, which is the foundation of the building. This is a critical step in the construction process as it provides a stable base for the building to stand on.',
          },
          {
            id: 'living-site',
            src: livingImage,
            alt: 'Dayim Living site progress',
            label: 'Retaining walls completed',
            detail:
              'The retaining walls have been completed, which are the walls that hold the soil back. This is a critical step in the construction process as it provides a stable base for the building to stand on.',
          },
          {
            id: 'living-value',
            src: livingImage,
            alt: 'Dayim Living investment potential',
            label: 'Lower Ground Slab Completed',
            detail:
              'The lower ground slab has been completed, which is the foundation of the building. This is a critical step in the construction process as it provides a stable base for the building to stand on.',
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
      ],
      interiors: {
        brandLines: [ 'INTERIORS'],
        services: [
          {
            id: 'living-studio-deluxe',
            title: 'Studio Deluxe',
            images: [
              { src: livingResidentialImages[0].src, label: '268 Sq.Ft.' },
              { src: livingResidentialImages[1].src, label: '354 Sq.Ft.' },
            ],
            width: 1024,
            height: 768,
            text: 'Compact hotel-service studios planned for efficient city living.',
          },
          {
            id: 'living-executive-studio',
            title: 'Executive Studio',
            images: [{ src: livingResidentialImages[2].src, label: '425 Sq.Ft.' }],
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
        images: [
          { src: livingResidentialImages[0].src, label: '268 Sq.Ft.', alt: livingResidentialImages[0].alt },
          { src: livingResidentialImages[1].src, label: '354 Sq.Ft.', alt: livingResidentialImages[1].alt },
        ],
      },
      {
        id: 'executive-studio',
        label: 'Executive Studio',
        type: 'Executive Studio',
        area: '425 Sq.Ft.',
        beds: 0,
        status: 'Available',
        images: [
          { src: livingResidentialImages[2].src, label: 'Residence', alt: livingResidentialImages[2].alt },
        ],
      },
    ],
  },
  {
    id: 'zindagi',
    title: 'Dayim Zindagi',
    short: 'Zindagi Elevated',
    brand: 'Zindagi',
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
          id: 'zindagi-shop-plan',
          src: zindagiImage,
          alt: 'Dayim Zindagi commercial shop typology',
          label: 'Shop',
          detail: '350 sq ft retail units for high-visibility business',
        },
        {
          id: 'zindagi-office-plan',
          src: zindagiImage,
          alt: 'Dayim Zindagi office typology',
          label: 'Office',
          detail: '800 sq ft workspaces for growing teams',
        },
        {
          id: 'zindagi-2bed-plan',
          src: zindagiImage,
          alt: 'Dayim Zindagi 2 bedroom typology',
          label: '2 Bed',
          detail: '950 sq ft apartments for elevated city living',
        },
      ],
      interiors: {
        brandLines: ['ZINDAGI', 'INTERIORS'],
        services: [
          {
            id: 'zindagi-shop',
            title: 'Commercial Shops',
            images: [{ src: zindagiImage, label: 'Retail' }],
            width: 1024,
            height: 768,
            text: '350 sq ft retail units positioned for foot traffic and brand presence.',
          },
          {
            id: 'zindagi-office',
            title: 'Office Spaces',
            images: [{ src: zindagiImage, label: 'Workspace' }],
            width: 1024,
            height: 768,
            text: '800 sq ft offices planned for focus, meetings, and professional growth.',
          },
          {
            id: 'zindagi-2bed',
            title: '2 Bedroom Apartments',
            images: [{ src: zindagiImage, label: 'Residence' }],
            width: 1024,
            height: 768,
            text: '950 sq ft homes designed for comfort above Business Bay.',
          },
        ],
      },
    },
    plan: {
      floors: [
        typologyInventoryFloor({
          id: 'zindagi-units',
          label: 'Typologies',
          image: zindagiImage,
          alt: 'Dayim Zindagi project overview',
          units: [
            { id: 'zindagi-shop', label: 'Shop', type: 'Commercial Shop', area: '350 sq ft', beds: null, status: 'Available' },
            { id: 'zindagi-office', label: 'Office', type: 'Office Space', area: '800 sq ft', beds: null, status: 'Available' },
            { id: 'zindagi-2bed', label: '2 Bed', type: '2 Bedroom Apartment', area: '950 sq ft', beds: 2, status: 'Limited' },
          ],
        }),
      ],
    },
    units: [
      { id: 'zindagi-shop', label: 'Shop', type: 'Commercial Shop', area: '350 sq ft', beds: null, status: 'Available', images: [{ src: zindagiImage, label: 'Retail', alt: 'Dayim Zindagi shop' }] },
      { id: 'zindagi-office', label: 'Office', type: 'Office Space', area: '800 sq ft', beds: null, status: 'Available', images: [{ src: zindagiImage, label: 'Workspace', alt: 'Dayim Zindagi office' }] },
      { id: 'zindagi-2bed', label: '2 Bed', type: '2 Bedroom Apartment', area: '950 sq ft', beds: 2, status: 'Limited', images: [{ src: zindagiImage, label: 'Residence', alt: 'Dayim Zindagi 2 bedroom' }] },
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
