import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import PageMeta from '../components/PageMeta/PageMeta.jsx'
import PageIntro from '../components/PageIntro/PageIntro.jsx'
import ProductCard from '../components/ProductCard/ProductCard.jsx'
import Horizon from '../sections/Horizon/Horizon.jsx'
import { families } from '../data/products/index.js'
import { getLaunchProducts } from '../lib/catalogue.js'
import { EASE } from '../lib/motion.js'
import './pages.css'

const FILTERS = [{ slug: 'all', name: 'All' }, ...Object.values(families)]

export default function Products() {
  const [params, setParams] = useSearchParams()
  const requested = params.get('range')
  const active = FILTERS.some((f) => f.slug === requested) ? requested : 'all'
  const products = getLaunchProducts(active === 'all' ? undefined : active)

  const select = (slug) => {
    // Read the live URL so quick successive clicks never use stale params.
    const next = new URLSearchParams(window.location.search)
    if (slug === 'all') next.delete('range')
    else next.set('range', slug)
    setParams(next, { replace: true, preventScrollReset: true })
  }

  return (
    <>
      <PageMeta
        title="Explore products"
        description="The Grain Lab launch collection: Vanilla Protein Pancake Mix, Chocolate Protein Pancake Mix and Millet Idli Mix."
      />
      <PageIntro
        label="Explore products"
        lines={['The', <em key="accent">collection.</em>]}
        intro="Two protein pancake mixes, each with an 8 g honey stick, and a millet idli mix with its own tomato chutney mix."
      />

      <section className="collection" data-tone="light" aria-label="Launch products">
        <div className="container">
          <LayoutGroup>
            <div className="filters" role="group" aria-label="Filter by range">
              {FILTERS.map((f) => {
                const count = getLaunchProducts(f.slug === 'all' ? undefined : f.slug).length
                const on = active === f.slug
                return (
                  <button
                    key={f.slug}
                    type="button"
                    className="filters__chip"
                    aria-pressed={on}
                    onClick={() => select(f.slug)}
                  >
                    {on && (
                      <motion.span
                        layoutId="filter-pill"
                        className="filters__pill"
                        transition={{ duration: 0.5, ease: EASE }}
                      />
                    )}
                    <span className="filters__text">
                      {f.name} <span className="filters__count">{count}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </LayoutGroup>

          <p className="visually-hidden" aria-live="polite">
            Showing {products.length} {products.length === 1 ? 'product' : 'products'}
          </p>

          <motion.ul layout className="collection__grid">
            <AnimatePresence mode="popLayout" initial={false}>
              {products.map((p) => (
                <motion.li
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.6, ease: EASE }}
                >
                  <ProductCard product={p} headingLevel="h2" />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>

          <p className="collection__note">
            Shown for information. Online ordering isn’t available yet — always refer to the pack for full product
            information.
          </p>
        </div>
      </section>

      <Horizon id="on-the-horizon" />
    </>
  )
}
