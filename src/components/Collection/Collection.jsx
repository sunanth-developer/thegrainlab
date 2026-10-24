import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import CollectionFilters from './CollectionFilters.jsx'
import CollectionCard from './CollectionCard.jsx'
import ProductCard from './ProductCard.jsx'
import {
  SEARCH_THRESHOLD,
  getCategory,
  getPublishedProducts,
  getVisibleCategories,
  searchCategories,
  searchProducts,
} from '../../lib/catalogue.js'
import { EASE } from '../../lib/motion.js'
import './Collection.css'

const itemMotion = {
  layout: true,
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.25 } },
  transition: { duration: 0.6, ease: EASE },
}

/** Filter + search state, optionally mirrored to the URL (?category=&q=). */
function useCollectionState(syncWithUrl) {
  const [params, setParams] = useSearchParams()
  const [local, setLocal] = useState({ q: '', category: '' })

  if (!syncWithUrl) {
    return {
      query: local.q,
      category: local.category,
      setQuery: (q) => setLocal((s) => ({ ...s, q })),
      setCategory: (category) => setLocal((s) => ({ ...s, category })),
      reset: () => setLocal({ q: '', category: '' }),
    }
  }

  // Read the live URL: router search params lag one render behind rapid updates.
  const update = (changes) => {
    const next = new URLSearchParams(window.location.search)
    Object.entries(changes).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)))
    setParams(next, { replace: true, preventScrollReset: true })
  }
  const raw = params.get('category') ?? ''

  return {
    query: params.get('q') ?? '',
    category: getCategory(raw) ? raw : '',
    setQuery: (q) => update({ q }),
    setCategory: (category) => update({ category }),
    reset: () => update({ q: '', category: '' }),
  }
}

export default function Collection({ syncWithUrl = false, headingLevel = 3 }) {
  const { query, category, setQuery, setCategory, reset } = useCollectionState(syncWithUrl)
  const categories = getVisibleCategories()
  const products = getPublishedProducts()
  const hasProducts = products.length > 0
  const showSearch = products.length >= SEARCH_THRESHOLD
  const activeQuery = showSearch ? query : ''

  const results = useMemo(
    () => (hasProducts ? searchProducts(activeQuery, category) : searchCategories('', category)),
    [hasProducts, activeQuery, category],
  )

  const noun = hasProducts ? ['product', 'products'] : ['category', 'categories']

  return (
    <div className="collection">
      <div className="collection__bar">
        <CollectionFilters
          categories={categories}
          category={category}
          onCategoryChange={setCategory}
          query={query}
          onQueryChange={setQuery}
          showSearch={showSearch}
        />
        <p className="collection__count" aria-live="polite" aria-atomic="true">
          Showing {results.length} {results.length === 1 ? noun[0] : noun[1]}
        </p>
      </div>

      {results.length === 0 ? (
        <div className="collection__empty">
          <p>Nothing matches that search.</p>
          <button type="button" className="btn" onClick={reset}>
            Show everything
          </button>
        </div>
      ) : (
        <ul className="collection__grid">
          <AnimatePresence mode="popLayout" initial={false}>
            {results.map((item) => (
              <motion.li key={item.id ?? item.slug} {...itemMotion}>
                {hasProducts ? (
                  <ProductCard product={item} headingLevel={headingLevel} />
                ) : (
                  <CollectionCard
                    category={item}
                    index={categories.findIndex((c) => c.slug === item.slug)}
                    headingLevel={headingLevel}
                  />
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      {!hasProducts && (
        <p className="collection__note">
          Individual products, with their details, will be listed here once published.
        </p>
      )}
    </div>
  )
}
