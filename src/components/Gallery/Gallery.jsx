import { Link } from 'react-router-dom'
import Img from '../Img/Img.jsx'
import MaskReveal from '../motion/MaskReveal.jsx'
import FadeUp from '../motion/FadeUp.jsx'
import Parallax from '../motion/Parallax.jsx'
import { categoryPath, getCategory } from '../../lib/catalogue.js'
import './Gallery.css'

const RATIO = { square: '1 / 1', portrait: '3 / 4', landscape: '4 / 3' }
// Different drift speeds per position give the editorial layout some depth.
const SPEED = [0.04, 0.09, 0.05, 0.1]

/**
 * Editorial photo gallery. `layout="editorial"` is the staggered home-page
 * composition; `layout="pair"` suits two or three images on inner pages.
 */
export default function Gallery({ items, layout = 'editorial', excludeCategory }) {
  if (!items?.length) return null

  return (
    <ul className={`gallery gallery--${layout} gallery--n${Math.min(items.length, 4)}`}>
      {items.map((item, i) => {
        const links = item.categories
          .filter((slug) => slug !== excludeCategory)
          .map(getCategory)
          .filter(Boolean)
        return (
          <li key={item.id} className={`gallery__item gallery__item--${item.shape}`}>
            <figure>
              <MaskReveal from={i % 2 ? 'top' : 'bottom'} className="gallery__frame">
                <Parallax speed={SPEED[i % SPEED.length]}>
                  <Img
                    imageKey={item.image}
                    ratio={RATIO[item.shape]}
                    sizes="(min-width: 900px) 45vw, 100vw"
                  />
                </Parallax>
              </MaskReveal>
              <FadeUp as="figcaption" className="gallery__caption" y={10}>
                <span className="gallery__title">{item.caption}</span>
                {links.map((c) => (
                  <Link key={c.slug} to={categoryPath(c.slug)} className="gallery__link link-line">
                    {c.name}
                  </Link>
                ))}
              </FadeUp>
            </figure>
          </li>
        )
      })}
    </ul>
  )
}
