import { Link } from 'react-router-dom'
import Img from '../Img/Img.jsx'
import Arrow from '../Icon/Arrow.jsx'
import { getCategory, hasValue, productPath } from '../../lib/catalogue.js'
import { formatPrice } from '../../lib/format.js'

/** Product card. Renders only the fields the product record actually contains. */
export default function ProductCard({ product, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`
  const category = getCategory(product.category)
  const price = formatPrice(product.price)
  const meta = [hasValue(product.packSize) && product.packSize, price].filter(Boolean)

  return (
    <Link to={productPath(product)} className="collection-card">
      <div className="collection-card__media">
        <Img
          imageKey={product.image}
          ratio="4 / 5"
          sizes="(min-width: 1200px) 19vw, (min-width: 900px) 30vw, 50vw"
          fallbackLabel={product.name}
        />
      </div>
      <div className="collection-card__body">
        {category && <p className="collection-card__category">{category.name}</p>}
        <Heading className="collection-card__name">{product.name}</Heading>
        {hasValue(product.description) && <p className="collection-card__description">{product.description}</p>}
        {meta.length > 0 && <p className="collection-card__meta">{meta.join(' · ')}</p>}
        <span className="link-arrow collection-card__cta">
          View product
          <Arrow />
        </span>
      </div>
    </Link>
  )
}
