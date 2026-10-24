import { categories, collections } from '../data/categories.js'
import { products } from '../data/products.js'
import { gallery } from '../data/gallery.js'
import { navigation } from '../data/navigation.js'
import { getImage } from '../data/images.js'

/** Search is only offered once the catalogue is large enough to need it. */
export const SEARCH_THRESHOLD = 8

export const categoryPath = (slug) => `/products/${slug}`
export const productPath = (product) => `/products/${product.category}/${product.id}`

/** A value counts as verified content only if it is non-empty. */
export function hasValue(value) {
  if (value == null) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'object') return Object.keys(value).length > 0
  return true
}

export function getVisibleCategories() {
  return categories.filter((c) => c.published && getImage(c.image))
}

export function getCategory(slug) {
  return getVisibleCategories().find((c) => c.slug === slug) ?? null
}

export function getCategoryIndex(slug) {
  return getVisibleCategories().findIndex((c) => c.slug === slug)
}

export function getCollection(slug) {
  const collection = collections.find((c) => c.slug === slug)
  if (!collection) return null
  const members = getVisibleCategories().filter((c) => c.collection === slug)
  return members.length ? { ...collection, categories: members } : null
}

export function getPublishedProducts() {
  const visible = new Set(getVisibleCategories().map((c) => c.slug))
  return products.filter((p) => hasValue(p.id) && hasValue(p.name) && visible.has(p.category))
}

export function getProductsByCategory(slug) {
  return getPublishedProducts().filter((p) => p.category === slug)
}

export function getProduct(categorySlug, id) {
  return getPublishedProducts().find((p) => p.category === categorySlug && p.id === id) ?? null
}

export function getGallery({ categories: slugs, exclude = [] } = {}) {
  const wanted = slugs ? new Set(slugs) : null
  return gallery.filter(
    (g) =>
      getImage(g.image) &&
      !exclude.includes(g.image) &&
      (!wanted || g.categories.some((s) => wanted.has(s))),
  )
}

export function getNavigation() {
  return navigation
    .map((item) => {
      if (item.type === 'all') return item
      if (item.type === 'category') {
        return getCategory(item.slug) ? { ...item, to: categoryPath(item.slug) } : null
      }
      if (item.type === 'collection') {
        return getCollection(item.slug) ? { ...item, to: categoryPath(item.slug) } : null
      }
      return null
    })
    .filter(Boolean)
}

const normalise = (s) => s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').trim()

function matches(query, fields) {
  const q = normalise(query)
  if (!q) return true
  const haystack = normalise(fields.filter(Boolean).flat().join(' '))
  return q.split(/\s+/).every((term) => haystack.includes(term))
}

export function searchCategories(query, categorySlug) {
  return getVisibleCategories().filter(
    (c) =>
      (!categorySlug || c.slug === categorySlug) &&
      matches(query, [c.name, c.description, c.keywords]),
  )
}

export function searchProducts(query, categorySlug) {
  return getPublishedProducts().filter((p) => {
    const category = getCategory(p.category)
    return (
      (!categorySlug || p.category === categorySlug) &&
      matches(query, [p.name, p.description, category?.name, p.ingredients])
    )
  })
}

export const pad = (n) => String(n).padStart(2, '0')

export const isNavActive = (item, pathname) =>
  item.type === 'all' ? pathname === '/products' : pathname === item.to || pathname.startsWith(`${item.to}/`)
