import { families, futureConcepts, launchProducts } from '../data/products/index.js'
import { getImage } from '../data/images.js'

export const productPath = (product, section) => `/products/${product.slug}${section ? `#${section}` : ''}`

export const pad = (n) => String(n).padStart(2, '0')

export function getLaunchProducts(family) {
  return launchProducts.filter((p) => !family || p.family === family)
}

export function getProduct(slug) {
  return launchProducts.find((p) => p.slug === slug) ?? null
}

export function getFamily(slug) {
  return families[slug] ?? null
}

/** Same-family products first, then the rest of the range. */
export function getRelated(product) {
  const others = launchProducts.filter((p) => p !== product)
  return [...others.filter((p) => p.family === product.family), ...others.filter((p) => p.family !== product.family)]
}

/** Product page gallery: the real pack, front and back, then the flat label artwork. */
export function getProductGallery(product) {
  const { pouch, pouchBack, labelFront, labelBack } = product.images
  return [
    { key: pouch, kind: 'pack', view: 'front', caption: 'Front of pack' },
    { key: pouchBack, kind: 'pack', view: 'back', caption: 'Back of pack' },
    { key: labelFront, kind: 'label', caption: 'Front label artwork' },
    { key: labelBack, kind: 'label', caption: 'Back label artwork' },
  ].filter((item) => getImage(item.key))
}

export function getFutureConcepts() {
  return futureConcepts
}

/** Headline protein claim with its basis, e.g. "14g+ protein per 75 g serving". */
export const proteinText = (product) => {
  const stat = product.highlights.stats.find((s) => s.label === 'Protein')
  return stat ? `${stat.value} protein ${stat.basis}` : ''
}
