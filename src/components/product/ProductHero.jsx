import { Link } from 'react-router-dom'
import ProductGallery from '../ProductGallery/ProductGallery.jsx'
import LineReveal from '../motion/LineReveal.jsx'
import FadeUp from '../motion/FadeUp.jsx'
import { getFamily } from '../../lib/catalogue.js'

/** Product overview: packaging gallery, name, description and what is in the pack. */
export default function ProductHero({ product }) {
  const family = getFamily(product.family)
  const showFamilyCrumb = family && family.path !== `/products/${product.slug}`
  const { pack } = product

  return (
    <section className="phero" data-tone="light" aria-labelledby="pdp-title">
      <div className="container phero__grid">
        <nav className="crumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link to="/products" className="link-line">
                Explore products
              </Link>
            </li>
            {showFamilyCrumb && (
              <li>
                <Link to={family.path} className="link-line">
                  {family.name}
                </Link>
              </li>
            )}
            <li aria-current="page">{product.name}</li>
          </ol>
        </nav>

        <div className="phero__gallery">
          <ProductGallery product={product} />
        </div>

        <div className="phero__info">
          <FadeUp trigger="mount" delay={0.15}>
            <p className="phero__family">{family?.single}</p>
          </FadeUp>
          <LineReveal as="h1" id="pdp-title" trigger="mount" delay={0.2} className="phero__name" lines={[product.name]} />
          <FadeUp trigger="mount" delay={0.35}>
            <p className="phero__packname">On pack: {product.packName}</p>
          </FadeUp>
          <FadeUp trigger="mount" delay={0.45}>
            <p className="phero__headline">{product.headline}</p>
          </FadeUp>
          <FadeUp trigger="mount" delay={0.5}>
            <p className="phero__desc">{product.description}</p>
          </FadeUp>

          <FadeUp trigger="mount" delay={0.6} className="phero__pack">
            <h2 className="phero__pack-title">What’s in the pack</h2>
            <ul className="phero__contents">
              {pack.contents.map((c) => (
                <li key={c.item}>
                  <span className="phero__amount">{c.amount}</span>
                  {c.item}
                </li>
              ))}
            </ul>
            <dl className="facts">
              <div>
                <dt>Net weight</dt>
                <dd>{pack.netWeight}</dd>
              </div>
              <div>
                <dt>Serving size</dt>
                <dd>{pack.servingSize}</dd>
              </div>
              <div>
                <dt>Servings per pack</dt>
                <dd>{pack.servingsPerPack}</dd>
              </div>
              {pack.extra && (
                <div>
                  <dt>{pack.extra.label}</dt>
                  <dd>{pack.extra.value}</dd>
                </div>
              )}
            </dl>
          </FadeUp>

          <FadeUp trigger="mount" delay={0.7} className="phero__actions">
            {/* `purchase` is null until real prices and checkout exist. */}
            {!product.purchase && <p className="phero__note">Online ordering isn’t available yet.</p>}
            <a href="#nutrition" className="link-arrow">
              Nutrition information
            </a>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
