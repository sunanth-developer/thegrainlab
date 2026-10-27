/**
 * Product data — the single source of truth for every product fact on the site.
 *
 * One file per product, each transcribed from its own label PDF. Values are as
 * printed on the label; anything derived (per-serving values calculated from
 * per-100 g figures) is computed in `src/lib/nutrition.js` and flagged
 * `calculated` so the UI can label it.
 *
 * Do not add prices, ratings or availability. `purchase` stays null until real
 * prices and a working checkout exist; the UI renders no buy action while it is
 * null. Each record's `review` array lists label points to confirm before launch.
 */
import vanilla from './vanilla-protein-pancake-mix.js'
import chocolate from './chocolate-protein-pancake-mix.js'
import idli from './millet-idli-mix.js'

export const families = {
  pancake: { slug: 'pancake', name: 'Pancake mixes', single: 'Pancake mix', path: '/pancake-mixes' },
  idli: { slug: 'idli', name: 'Idli mix', single: 'Idli mix', path: '/products/millet-idli-mix' },
}

export const launchProducts = [vanilla, chocolate, idli]

/**
 * Future concepts from the brand deck's "Next — in pipeline" panel. Kept separate
 * from launch products: no product pages, packaging, prices, dates or availability.
 */
export const futureConcepts = [
  {
    slug: 'high-protein-coffee-cereal',
    name: 'High-protein coffee-flavoured cereal',
    format: 'Cereal',
    status: 'Concept in development',
    image: 'concept-coffee',
  },
  {
    slug: 'high-fibre-berry-cereal',
    name: 'High-fibre berry-flavoured cereal',
    format: 'Cereal',
    status: 'Concept in development',
    image: 'concept-berry',
  },
]
