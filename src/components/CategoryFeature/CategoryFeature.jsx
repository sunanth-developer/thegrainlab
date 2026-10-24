import { Link } from 'react-router-dom'
import Img from '../Img/Img.jsx'
import Arrow from '../Icon/Arrow.jsx'
import MaskReveal from '../motion/MaskReveal.jsx'
import FadeUp from '../motion/FadeUp.jsx'
import { categoryPath, pad } from '../../lib/catalogue.js'
import './CategoryFeature.css'

export function CategoryText({ category, index, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`
  return (
    <FadeUp className="feature-text">
      {index != null && <span className="feature-text__index">{pad(index + 1)}</span>}
      <Heading className="feature-text__name">{category.name}</Heading>
      <p className="feature-text__description">{category.description}</p>
      <span className="link-arrow">
        Explore {category.name.toLowerCase()}
        <Arrow />
      </span>
    </FadeUp>
  )
}

/** A category photograph with its title, description and link. */
export default function CategoryFeature({
  category,
  index,
  ratio = '3 / 4',
  sizes = '(min-width: 900px) 45vw, 100vw',
  imageKey,
  headingLevel,
  className = '',
}) {
  return (
    <Link to={categoryPath(category.slug)} className={`feature ${className}`}>
      <MaskReveal className="feature__media">
        <Img
          imageKey={imageKey ?? category.image}
          ratio={ratio}
          sizes={sizes}
          position={imageKey && imageKey !== category.image ? undefined : category.focus}
          fallbackLabel={category.name}
        />
      </MaskReveal>
      <CategoryText category={category} index={index} headingLevel={headingLevel} />
    </Link>
  )
}
