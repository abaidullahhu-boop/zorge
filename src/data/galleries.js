const PREVIEW_LAYOUT = [
  { id: 1, moveFactor: 0.75, width: 480, height: 640, desktopOnly: false },
  { id: 2, moveFactor: 0.7, width: 480, height: 640, desktopOnly: false },
  { id: 3, moveFactor: 1, width: 720, height: 900, desktopOnly: false },
  { id: 4, moveFactor: 0.75, width: 480, height: 640, desktopOnly: false },
  { id: 5, moveFactor: 0.7, width: 480, height: 640, desktopOnly: false },
]

function previewImagesFromSources(sources) {
  const picks = PREVIEW_LAYOUT.map((layout, index) => {
    const src =
      sources[index] ??
      sources[index % Math.max(sources.length, 1)] ??
      sources[0]
    return {
      ...layout,
      src,
    }
  })
  return picks
}

function collageImagesFromSources(sources) {
  const factors = [0.75, 0.7, 0.8, 1, 1, 0.8, 0.7, 0.75]
  return sources.map((src, index) => {
    const isCenter = index === 3 || index === 4
    return {
      id: index + 1,
      moveFactor: factors[index] ?? 0.7,
      width: isCenter ? 560 : 360,
      height: isCenter ? 560 : 360,
      desktopOnly: false,
      src,
    }
  })
}

function modalItemsFromSources(
  sources,
  { width = 2456, height = 1426, lastHeight = height } = {},
) {
  return sources.map((src, index) => ({
    id: index + 1,
    width,
    height: index === sources.length - 1 && lastHeight !== height ? lastHeight : height,
    xs: src,
    md: src,
    xxl: src,
  }))
}

function dayimGalleryIndex(path) {
  const match = path.match(/\/dayim(\d+)\./i)
  return match ? Number(match[1]) : null
}

function sortedGlobSources(globResult, { prioritizeDayim = false } = {}) {
  return Object.entries(globResult)
    .sort(([a], [b]) => {
      if (prioritizeDayim) {
        const aIndex = dayimGalleryIndex(a)
        const bIndex = dayimGalleryIndex(b)
        if (aIndex != null && bIndex != null) return aIndex - bIndex
        if (aIndex != null) return -1
        if (bIndex != null) return 1
      }

      return a.localeCompare(b, undefined, {
        numeric: true,
        sensitivity: 'base',
      })
    })
    .map(([, src]) => src)
}

const homeGalleryFiles = import.meta.glob(
  '../assets/images/dayimgallery/*.{jpg,JPG,jpeg,png,PNG,webp}',
  { eager: true, import: 'default' },
)

const dsaGalleryFiles = import.meta.glob(
  '../assets/images/dsa/*.{jpg,JPG,jpeg,png,PNG,webp}',
  { eager: true, import: 'default' },
)

const livingGalleryFiles = import.meta.glob(
  '../assets/images/livinggallery/*.{jpg,JPG,jpeg,png,PNG,webp}',
  { eager: true, import: 'default' },
)

const zindagiGalleryFiles = import.meta.glob(
  '../assets/images/zindagi/*.{jpg,JPG,jpeg,png,PNG,webp}',
  { eager: true, import: 'default' },
)

const zindagiAmenitiesFiles = import.meta.glob(
  '../assets/images/zindagiameni/*.{jpg,JPG,jpeg,png,PNG,webp}',
  { eager: true, import: 'default' },
)

const homeGallerySources = sortedGlobSources(homeGalleryFiles, {
  prioritizeDayim: true,
})
const dsaGallerySources = sortedGlobSources(dsaGalleryFiles)
const livingGallerySources = sortedGlobSources(livingGalleryFiles)
const zindagiGallerySources = sortedGlobSources(zindagiGalleryFiles)
const zindagiAmenitiesSources = sortedGlobSources(zindagiAmenitiesFiles)

export const HOME_GALLERY = {
  photoCount: homeGallerySources.length,
  previewImages: previewImagesFromSources(homeGallerySources),
  modalItems: modalItemsFromSources(homeGallerySources),
}

const PROJECT_GALLERIES = {
  'dayim-signature-apartments': {
    photoCount: dsaGallerySources.length,
    previewImages: previewImagesFromSources(dsaGallerySources),
    modalItems: modalItemsFromSources(dsaGallerySources),
  },
  'dayim-living': {
    photoCount: livingGallerySources.length,
    previewImages: previewImagesFromSources(livingGallerySources),
    modalItems: modalItemsFromSources(livingGallerySources),
  },
  'dayim-zindagi': {
    photoCount: zindagiGallerySources.length,
    previewImages: previewImagesFromSources(zindagiGallerySources),
    modalItems: modalItemsFromSources(zindagiGallerySources),
  },
}

export function getProjectGallery(projectId) {
  return PROJECT_GALLERIES[projectId] ?? null
}

const PROJECT_AMENITIES = {
  'dayim-zindagi': {
    photoCount: zindagiAmenitiesSources.length,
    previewImages: collageImagesFromSources(zindagiAmenitiesSources),
  },
}

export function getProjectAmenities(projectId) {
  return PROJECT_AMENITIES[projectId] ?? null
}
