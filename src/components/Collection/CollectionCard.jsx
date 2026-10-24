import { Link } from 'react-router-dom'
import Img from '../Img/Img.jsx'
import Arrow from '../Icon/Arrow.jsx'
import { categoryPath, pad } from '../../lib/catalogue.js'

const SIZES = '(min-width: 1200px) 19vw, (min-width: 900px) 30vw, 50vw'

/** Category-level card, shown while no individual products are published. */
export default function CollectionCard({ category, index, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`
  return (
    <Link to={categoryPath(category.slug)} className="collection-card">
      <div className="collection-card__media">
        <Img imageKey={category.cardImage ?? category.image} ratio="4 / 5" sizes={SIZES} fallbackLabel={category.name} />
        {category.cardImage && (
          <div className="collection-card__hover" aria-hidden="true">
            <Img imageKey={category.image} ratio="4 / 5" sizes={SIZES} alt="" />
          </div>
        )}
        <span className="collection-card__index" aria-hidden="true">
          {pad(index + 1)}
        </span>
      </div>
      <div className="collection-card__body">
        <Heading className="collection-card__name">{category.name}</Heading>
        <p className="collection-card__description">{category.description}</p>
        <span className="link-arrow collection-card__cta">
          View range
          <Arrow />
        </span>
      </div>
    </Link>
  )
}
