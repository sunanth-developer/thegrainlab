import LineReveal from '../../components/motion/LineReveal.jsx'
import ProductStage from '../../components/ProductStage/ProductStage.jsx'
import { getLaunchProducts } from '../../lib/catalogue.js'
import './LaunchCollection.css'

const LAYOUTS = ['portrait', 'reverse', 'wide']

export default function LaunchCollection() {
  const products = getLaunchProducts()
  return (
    <section id="collection" className="launch section" data-tone="light" aria-labelledby="launch-title">
      <div className="container">
        <header className="launch__header">
          <p className="label">The collection</p>
          <LineReveal
            id="launch-title"
            className="title-lg launch__title"
            lines={['Two pancake mixes.', <em key="accent">One idli mix.</em>]}
          />
        </header>

        <div className="launch__stages">
          {products.map((product, i) => (
            <ProductStage key={product.slug} product={product} index={i} layout={LAYOUTS[i % LAYOUTS.length]} />
          ))}
        </div>
      </div>
    </section>
  )
}
