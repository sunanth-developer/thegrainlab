import { Link } from 'react-router-dom'
import Img from '../Img/Img.jsx'
import Pack from '../Pack/Pack.jsx'
import Stat from '../Stat/Stat.jsx'
import Arrow from '../Icon/Arrow.jsx'
import { getFamily, productPath } from '../../lib/catalogue.js'
import './ProductCard.css'

/**
 * Collection card: the real pouch on the product's own colour. On hover the
 * serving suggestion opens behind it.
 */
export default function ProductCard({ product, headingLevel = 'h3' }) {
  const Heading = headingLevel
  const family = getFamily(product.family)
  const { theme } = product
  const protein = product.highlights.stats[0]

  return (
    <Link
      to={productPath(product)}
      className="pcard"
      style={{ '--p-bg': theme.background, '--p-deep': theme.deep, '--p-ink': theme.ink, '--p-accent': theme.accent }}
    >
      <div className="pcard__stage">
        <div className="pcard__photo" aria-hidden="true">
          <Img imageKey={product.images.food} ratio="fill" sizes="(min-width: 900px) 30vw, 100vw" alt="" />
        </div>
        <div className="pcard__pack">
          <Pack product={product} tilt={-3} sizes="(min-width: 900px) 220px, 45vw" />
        </div>
      </div>
      <div className="pcard__body">
        <p className="pcard__family">{family?.single}</p>
        <Heading className="pcard__name">{product.name}</Heading>
        <p className="pcard__tagline">{product.headline}</p>
        <div className="pcard__facts">
          {protein && <Stat stat={protein} size="sm" />}
          <span className="pcard__included">{product.accompaniment.label}</span>
        </div>
        <span className="link-arrow pcard__link">
          View product
          <Arrow />
        </span>
      </div>
    </Link>
  )
}
