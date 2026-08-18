import dsaImage from '../assets/images/dayim-signature.png'
import livingImage from '../assets/images/dayim-living.png'
import zindagiImage from '../assets/images/dayim-zindagi.png'

const signaturePlanFiles = import.meta.glob(
  '../assets/images/Signature floor plans/FLOOR PLANS/**/*.png',
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

function planImage(relativePath, label, alt) {
  return { src: signaturePlan(relativePath), label, alt }
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
    overview: planImage(
      'Floor Plans/Lower Ground.png',
      'Floor layout',
      'Dayim Signature Apartments lower ground floor layout',
    ),
    images: [
      planImage('Lower Ground/Lower Ground (Shop 01) (Surriya Perveen).png', 'Shop 01', 'Dayim Signature Apartments lower ground shop 01 floor plan'),
      planImage('Lower Ground/Lower Ground (Shop 02) (Imran Ali).png', 'Shop 02', 'Dayim Signature Apartments lower ground shop 02 floor plan'),
      planImage('Lower Ground/Lower Ground (Shop 03).png', 'Shop 03', 'Dayim Signature Apartments lower ground shop 03 floor plan'),
      planImage('Lower Ground/Lower Ground (Shop 04).png', 'Shop 04', 'Dayim Signature Apartments lower ground shop 04 floor plan'),
      planImage('Lower Ground/Lower Ground (Shop 05).png', 'Shop 05', 'Dayim Signature Apartments lower ground shop 05 floor plan'),
      planImage('Lower Ground/Lower Ground (Shop 06).png', 'Shop 06', 'Dayim Signature Apartments lower ground shop 06 floor plan'),
      planImage('Lower Ground/Lower Ground (Shop 07).png', 'Shop 07', 'Dayim Signature Apartments lower ground shop 07 floor plan'),
      planImage('Lower Ground/Lower Ground (Shop 08).png', 'Shop 08', 'Dayim Signature Apartments lower ground shop 08 floor plan'),
    ],
  },
  {
    id: 'ground',
    label: 'Ground Floor',
    overview: planImage(
      'Floor Plans/Ground Floor.png',
      'Floor layout',
      'Dayim Signature Apartments ground floor layout',
    ),
    images: [
      planImage('Ground Floor/Ground Floor (Office 01).png', 'Office 01', 'Dayim Signature Apartments ground floor office 01 floor plan'),
      planImage('Ground Floor/Ground Floor (Office 02).png', 'Office 02', 'Dayim Signature Apartments ground floor office 02 floor plan'),
      planImage('Ground Floor/Ground Floor (Office 03) (Muhammad Sadiq).png', 'Office 03', 'Dayim Signature Apartments ground floor office 03 floor plan'),
    ],
  },
  {
    id: 'first',
    label: 'First Floor',
    overview: planImage(
      'Floor Plans/First Floor.png',
      'Floor layout',
      'Dayim Signature Apartments first floor layout',
    ),
    images: [
      planImage('First Floor/First Floor (Shop 01).png', 'Shop 01', 'Dayim Signature Apartments first floor shop 01 floor plan'),
      planImage('First Floor/First Floor (Shop 02).png', 'Shop 02', 'Dayim Signature Apartments first floor shop 02 floor plan'),
      planImage('First Floor/First Floor (Shop 03).png', 'Shop 03', 'Dayim Signature Apartments first floor shop 03 floor plan'),
      planImage('First Floor/First Floor (Shop 04).png', 'Shop 04', 'Dayim Signature Apartments first floor shop 04 floor plan'),
      planImage('First Floor/First Floor (Shop 05).png', 'Shop 05', 'Dayim Signature Apartments first floor shop 05 floor plan'),
      planImage('First Floor/First Floor (Shop 06).png', 'Shop 06', 'Dayim Signature Apartments first floor shop 06 floor plan'),
      planImage('First Floor/First Floor (Shop 07).png', 'Shop 07', 'Dayim Signature Apartments first floor shop 07 floor plan'),
    ],
  },
  {
    id: 'second',
    label: '2nd Floor',
    overview: planImage(
      'Floor Plans/2nd to 4th Floor.png',
      'Floor layout',
      'Dayim Signature Apartments 2nd to 4th floor layout',
    ),
    images: [
      planImage('2nd Floor/Studio Executive (350 sqft)( Ali Imran).png', 'Studio Executive · 350 sqft', 'Dayim Signature Apartments 2nd floor studio executive 350 sqft floor plan'),
      planImage('2nd Floor/Studio Deluxe (369 sqft) (Muhammad Sadiq).png', 'Studio Deluxe · 369 sqft', 'Dayim Signature Apartments 2nd floor studio deluxe 369 sqft floor plan'),
      planImage('2nd Floor/Studio Deluxe (391 sqft).png', 'Studio Deluxe · 391 sqft', 'Dayim Signature Apartments 2nd floor studio deluxe 391 sqft floor plan'),
      planImage('2nd Floor/One Bed Executive (575 sqft) ( Muhammad Sadiq).png', 'One Bed Executive · 575 sqft', 'Dayim Signature Apartments 2nd floor one bed executive 575 sqft floor plan'),
      planImage('2nd Floor/One Bed Executive (593 sqft)(Shabaz Tariq).png', 'One Bed Executive · 593 sqft', 'Dayim Signature Apartments 2nd floor one bed executive 593 sqft floor plan'),
      planImage('2nd Floor/One Bed Deluxe (596 sqft) (Mujahid Farooqi).png', 'One Bed Deluxe · 596 sqft', 'Dayim Signature Apartments 2nd floor one bed deluxe 596 sqft floor plan'),
    ],
  },
  {
    id: 'third',
    label: '3rd Floor',
    overview: planImage(
      'Floor Plans/2nd to 4th Floor.png',
      'Floor layout',
      'Dayim Signature Apartments 2nd to 4th floor layout',
    ),
    images: [
      planImage('3rd Floor/Studio Executive (350 sqft)( Imran Bin Ali).png', 'Studio Executive · 350 sqft', 'Dayim Signature Apartments 3rd floor studio executive 350 sqft floor plan'),
      planImage('3rd Floor/Studio Deluxe (369 sqft) ( Muhammad Saqib).png', 'Studio Deluxe · 369 sqft', 'Dayim Signature Apartments 3rd floor studio deluxe 369 sqft floor plan'),
      planImage('3rd Floor/Studio Deluxe (391 sqft).png', 'Studio Deluxe · 391 sqft', 'Dayim Signature Apartments 3rd floor studio deluxe 391 sqft floor plan'),
      planImage('3rd Floor/One Bed Executive (575 sqft).png', 'One Bed Executive · 575 sqft', 'Dayim Signature Apartments 3rd floor one bed executive 575 sqft floor plan'),
      planImage('3rd Floor/One Bed Executive (593 sqft) ( jehad Khan).png', 'One Bed Executive · 593 sqft', 'Dayim Signature Apartments 3rd floor one bed executive 593 sqft floor plan'),
      planImage('3rd Floor/One Bed Deluxe (596 sqft).png', 'One Bed Deluxe · 596 sqft', 'Dayim Signature Apartments 3rd floor one bed deluxe 596 sqft floor plan'),
    ],
  },
  {
    id: 'fourth',
    label: '4th Floor',
    overview: planImage(
      'Floor Plans/2nd to 4th Floor.png',
      'Floor layout',
      'Dayim Signature Apartments 2nd to 4th floor layout',
    ),
    images: [
      planImage('4th Floor/Studio Executive (350 sqft) (Amir Saeed).png', 'Studio Executive · 350 sqft', 'Dayim Signature Apartments 4th floor studio executive 350 sqft floor plan'),
      planImage('4th Floor/Studio Deluxe (369 sqft).png', 'Studio Deluxe · 369 sqft', 'Dayim Signature Apartments 4th floor studio deluxe 369 sqft floor plan'),
      planImage('4th Floor/Studio Deluxe (391 sqft).png', 'Studio Deluxe · 391 sqft', 'Dayim Signature Apartments 4th floor studio deluxe 391 sqft floor plan'),
      planImage('4th Floor/One Bed Executive (575 sqft).png', 'One Bed Executive · 575 sqft', 'Dayim Signature Apartments 4th floor one bed executive 575 sqft floor plan'),
      planImage('4th Floor/One Bed Executive (593 sqft).png', 'One Bed Executive · 593 sqft', 'Dayim Signature Apartments 4th floor one bed executive 593 sqft floor plan'),
      planImage('4th Floor/One Bed Deluxe (596 sqft).png', 'One Bed Deluxe · 596 sqft', 'Dayim Signature Apartments 4th floor one bed deluxe 596 sqft floor plan'),
    ],
  },
  {
    id: 'fifth',
    label: '5th Floor',
    overview: planImage(
      'Floor Plans/5th to 6th Floor.png',
      'Floor layout',
      'Dayim Signature Apartments 5th to 6th floor layout',
    ),
    images: [
      planImage('5th Floor/Studio Executive (350 sqft)( Muhammad Faisal Shahid).png', 'Studio Executive · 350 sqft', 'Dayim Signature Apartments 5th floor studio executive 350 sqft floor plan'),
      planImage('5th Floor/Studio Deluxe (391 sqft).png', 'Studio Deluxe · 391 sqft', 'Dayim Signature Apartments 5th floor studio deluxe 391 sqft floor plan'),
      planImage('5th Floor/One Bed Executive (575 sqft).png', 'One Bed Executive · 575 sqft', 'Dayim Signature Apartments 5th floor one bed executive 575 sqft floor plan'),
      planImage('5th Floor/One Bed Deluxe (596 sqft).png', 'One Bed Deluxe · 596 sqft', 'Dayim Signature Apartments 5th floor one bed deluxe 596 sqft floor plan'),
      planImage('5th Floor/2 Bed Executive (959 sqft)  (Rabia Waseem).png', '2 Bed Executive · 959 sqft', 'Dayim Signature Apartments 5th floor 2 bed executive 959 sqft floor plan'),
    ],
  },
  {
    id: 'sixth',
    label: '6th Floor',
    overview: planImage(
      'Floor Plans/5th to 6th Floor.png',
      'Floor layout',
      'Dayim Signature Apartments 5th to 6th floor layout',
    ),
    images: [
      planImage('6th Floor/Studio Executive (350 sqft)( Muhammad Maisam).png', 'Studio Executive · 350 sqft', 'Dayim Signature Apartments 6th floor studio executive 350 sqft floor plan'),
      planImage('6th Floor/Studio Deluxe (391 sqft).png', 'Studio Deluxe · 391 sqft', 'Dayim Signature Apartments 6th floor studio deluxe 391 sqft floor plan'),
      planImage('6th Floor/One Bed Executive (575 sqft) ( Rao Shahrukh Suleman ).png', 'One Bed Executive · 575 sqft', 'Dayim Signature Apartments 6th floor one bed executive 575 sqft floor plan'),
      planImage('6th Floor/One Bed Deluxe (596 sqft).png', 'One Bed Deluxe · 596 sqft', 'Dayim Signature Apartments 6th floor one bed deluxe 596 sqft floor plan'),
      planImage('6th Floor/2 Bed Executive.png', '2 Bed Executive', 'Dayim Signature Apartments 6th floor 2 bed executive floor plan'),
    ],
  },
]

export const DEVELOPER = {
  name: 'Dayim Developers',
  tagline: 'Building Trust. Creating Lifestyles. Shaping the Future.',
  description:
    'At Dayim Developers, our vision is to redefine the future of real estate by setting new benchmarks in innovation, quality, and trust. We aspire to create iconic developments that inspire confidence, enrich communities, and deliver lasting value for generations to come.',
  story:
    'Led by our CEO, Waleed Ahmad, Dayim Developers is driven by the belief that real estate is more than constructing buildings—it is about creating communities, improving lifestyles, and delivering long-term value.',
}

export const projects = [
  {
    id: 'dsa',
    title: 'Dayim Signature Apartments',
    short: 'DSA',
    subtitle: 'Broadway Commercial · Opposite Lake City',
    image: dsaImage,
    mapsUrl: 'https://share.google/1Z56ADgZS5XvUwBgB',
    x: 58.5,
    y: 38.5,
    kind: 'photo',
    about: {
      description:
        'Dayim Signature Apartments brings together contemporary design, premium amenities, and a prime location opposite Lake City. A professionally planned high-rise residential development offering lifestyle and investment value on Broadway Commercial.',
      highlights: [
        'Prime location on Broadway Commercial, opposite Lake City',
        'Contemporary high-rise residential development',
        'Flexible payment options and installment plans',
        'Premium amenities including elevators, 24/7 security, and backup power',
        'Construction commenced April 2024',
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
        area: '350–391 sq ft',
        beds: 0,
        status: 'Available',
        images: dsaStudioImages,
      },
      {
        id: 'one-bed',
        label: 'One Bed',
        type: 'One Bedroom',
        area: '575–596 sq ft',
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
        area: 'Lower Ground & First Floor',
        beds: null,
        status: 'Available',
        images: dsaShopImages,
      },
      {
        id: 'office',
        label: 'Office',
        type: 'Office',
        area: 'Ground Floor',
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
    short: 'Living',
    subtitle: 'Plot 22, Block C · Al-Kabir Town Phase 2',
    image: livingImage,
    mapsUrl: 'https://share.google/uQuucywNcsJaxM1TJ',
    x: 54.2,
    y: 48.5,
    kind: 'photo',
    about: {
      description:
        'Dayim Living offers thoughtfully designed residential spaces in the heart of Al-Kabir Town Phase 2. Built with the same commitment to quality and trust that defines every Dayim development.',
      highlights: [
        'Plot 22, Block C, Al-Kabir Town Phase 2',
        'Community-focused residential development',
        'Trusted Dayim Developers quality standards',
        'Convenient access to Raiwind Road corridor',
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
    short: 'Zindagi',
    subtitle: 'Business Bay · Main Raiwind Road',
    image: zindagiImage,
    mapsUrl: 'https://share.google/ntyEvG8FmQl5EgXMT',
    x: 49.8,
    y: 55.2,
    kind: 'photo',
    about: {
      description:
        'Dayim Zindagi is positioned in Business Bay along Main Raiwind Road—a landmark address combining commercial potential with modern living. Designed for investors and residents seeking long-term value.',
      highlights: [
        'Business Bay location on Main Raiwind Road',
        'Mixed-use commercial and residential potential',
        'Strategic position in Lahore\'s growing corridor',
        'Dayim Developers commitment to on-time delivery',
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

export function getProjectById(id) {
  return projects.find((project) => project.id === id) ?? null
}
