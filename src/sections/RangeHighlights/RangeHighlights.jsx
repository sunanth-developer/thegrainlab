import { Link } from 'react-router-dom'
import Pack from '../../components/Pack/Pack.jsx'
import LineReveal from '../../components/motion/LineReveal.jsx'
import FadeUp from '../../components/motion/FadeUp.jsx'
import Arrow from '../../components/Icon/Arrow.jsx'
import { getLaunchProducts, productPath } from '../../lib/catalogue.js'
import { STAGGER } from '../../lib/motion.js'
import './RangeHighlights.css'

/** The facts that actually differ between the three products, side by side. */
function rows(product) {
  const [protein, fibre] = product.highlights.stats
  return [
    ['Flavour', product.compare.flavour],
    ['Made with', product.compare.grain],
    protein && ['Protein', `${protein.value} ${protein.basis}`],
    fibre && ['Dietary fibre', `${fibre.value} ${fibre.basis}`],
    ['In the pack', product.pack.contents.map((c) => `${c.amount} ${c.item.toLowerCase()}`).join(' + ')],
    ['Cooked', product.compare.method],
  ].filter(Boolean)
}

export default function RangeHighlights() {
  const products = getLaunchProducts()
  return (
    <section className="range section" data-tone="light" aria-labelledby="range-title">
      <div className="container">
        <header className="range__header">
          <p className="label">Side by side</p>
          <LineReveal id="range-title" className="title-md" lines={['What sets each', <em key="accent">one apart.</em>]} />
        </header>

        <ul className="range__list">
          {products.map((p, i) => (
            <FadeUp
              as="li"
              key={p.slug}
              delay={i * STAGGER}
              className="range__card"
              style={{ '--p-bg': p.theme.background, '--p-deep': p.theme.deep, '--p-accent': p.theme.accent }}
            >
              <Link to={productPath(p)} className="range__top">
                <div className="range__pack" aria-hidden="true">
                  <Pack product={p} tilt={-4} sizes="120px" />
                </div>
                <h3 className="range__name">{p.name}</h3>
              </Link>
              <dl className="range__dl">
                {rows(p).map(([term, value]) => (
                  <div key={term}>
                    <dt>{term}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </FadeUp>
          ))}
        </ul>

        <p className="range__note">
          Protein and fibre figures are from the front of each pack.{' '}
          <Link to="/pancake-mixes" className="link-arrow">
            Compare the two pancake mixes in detail
            <Arrow />
          </Link>
        </p>
      </div>
    </section>
  )
}
