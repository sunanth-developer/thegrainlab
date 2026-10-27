import { Link } from 'react-router-dom'
import Pack from '../../components/Pack/Pack.jsx'
import LineReveal from '../../components/motion/LineReveal.jsx'
import FadeUp from '../../components/motion/FadeUp.jsx'
import Arrow from '../../components/Icon/Arrow.jsx'
import { getLaunchProducts, productPath } from '../../lib/catalogue.js'
import { PRODUCT_SECTIONS } from '../../components/product/sections.js'
import { STAGGER } from '../../lib/motion.js'
import './ProductIndex.css'

const LINKS = PRODUCT_SECTIONS.filter((s) => ['ingredients', 'nutrition', 'preparation', 'storage'].includes(s.id))

/** Deep links into each product page's label information. */
export default function ProductIndex() {
  return (
    <section className="pindex section" data-tone="light" aria-labelledby="pindex-title">
      <div className="container">
        <header className="pindex__header">
          <p className="label">Full product details</p>
          <LineReveal id="pindex-title" className="title-md" lines={['Everything on', <em key="accent">the label.</em>]} />
          <FadeUp delay={0.15}>
            <p className="lede">Ingredients, allergens, complete nutrition tables, preparation and storage for each mix.</p>
          </FadeUp>
        </header>

        <ul className="pindex__list">
          {getLaunchProducts().map((p, i) => (
            <FadeUp
              as="li"
              key={p.slug}
              delay={i * STAGGER}
              className="pindex__row"
              style={{ '--p-bg': p.theme.background, '--p-accent': p.theme.accent }}
            >
              <Link to={productPath(p)} className="pindex__main">
                <span className="pindex__pack" aria-hidden="true">
                  <Pack product={p} tilt={-4} sizes="96px" />
                </span>
                <span className="pindex__text">
                  <span className="pindex__name">{p.name}</span>
                  <span className="pindex__meta">
                    {p.pack.netWeight} · serving {p.nutrition.servingSize}
                  </span>
                </span>
                <Arrow />
              </Link>
              <nav className="pindex__links" aria-label={`${p.name} details`}>
                {LINKS.map((s) => (
                  <Link key={s.id} to={productPath(p, s.id)} className="pindex__chip">
                    {s.label}
                  </Link>
                ))}
              </nav>
            </FadeUp>
          ))}
        </ul>
      </div>
    </section>
  )
}
