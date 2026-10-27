import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import Img from '../Img/Img.jsx'
import Pack from '../Pack/Pack.jsx'
import Parallax from '../motion/Parallax.jsx'
import MaskReveal from '../motion/MaskReveal.jsx'
import LineReveal from '../motion/LineReveal.jsx'
import FadeUp from '../motion/FadeUp.jsx'
import Arrow from '../Icon/Arrow.jsx'
import { getFamily, pad, productPath } from '../../lib/catalogue.js'
import { EASE, viewportOnce } from '../../lib/motion.js'
import './ProductStage.css'

/**
 * Art-directed product introduction: serving-suggestion photograph with the
 * real pouch in front. Each layout gives the product its own scale:
 * - 'portrait': tall photograph left, details right
 * - 'reverse':  details left, squarer photograph right
 * - 'wide':     panoramic photograph, details beneath
 */
const LAYOUT = {
  portrait: { ratio: '4 / 5', tilt: 6, sizes: '(min-width: 900px) 50vw, 100vw' },
  reverse: { ratio: '1 / 1', tilt: -5, sizes: '(min-width: 900px) 42vw, 100vw' },
  wide: { ratio: '16 / 9', tilt: -4, sizes: '(min-width: 900px) 84vw, 100vw' },
}

export default function ProductStage({ product, index, layout = 'portrait', headingLevel = 'h3' }) {
  const reduce = useReducedMotion()
  const config = LAYOUT[layout]
  const family = getFamily(product.family)
  const { theme } = product
  const contents = product.pack.contents.map((c) => `${c.amount} ${c.item.toLowerCase()}`).join(' + ')

  return (
    <article
      className={`stage stage--${layout}`}
      style={{
        '--p-bg': theme.background,
        '--p-deep': theme.deep,
        '--p-ink': theme.ink,
        '--p-accent': theme.accent,
        '--p-highlight': theme.highlight,
      }}
      aria-labelledby={`stage-${product.slug}`}
    >
      <div className="stage__media">
        <motion.div
          className="stage__plinth"
          aria-hidden="true"
          initial={reduce ? false : { scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 1.2, ease: EASE }}
        />
        <MaskReveal from={layout === 'reverse' ? 'left' : 'bottom'} className="stage__photo">
          <Parallax speed={0.05}>
            <Img imageKey={product.images.food} ratio={config.ratio} sizes={config.sizes} />
          </Parallax>
        </MaskReveal>
        <FadeUp className="stage__pack" delay={0.35} y={40}>
          <Link to={productPath(product)} tabIndex={-1} aria-hidden="true">
            <Pack product={product} tilt={config.tilt} />
          </Link>
        </FadeUp>
      </div>

      <div className="stage__info">
        <div className="stage__head">
          <FadeUp>
            <p className="stage__eyebrow">
              <span>{pad(index + 1)}</span>
              {family?.single}
            </p>
          </FadeUp>
          <LineReveal as={headingLevel} id={`stage-${product.slug}`} className="stage__name" lines={[product.name]} />
          <FadeUp delay={0.1}>
            <p className="stage__tagline">{product.headline}</p>
          </FadeUp>
        </div>
        <div className="stage__detail">
          <FadeUp delay={0.18}>
            <p className="stage__desc">{product.description}</p>
          </FadeUp>
          <FadeUp delay={0.24}>
            <p className="stage__contents">
              <span>In the pack</span>
              {contents} · {product.pack.netWeight}
            </p>
          </FadeUp>
          <FadeUp delay={0.3}>
            <Link to={productPath(product)} className="link-arrow stage__link">
              View product<span className="visually-hidden">: {product.name}</span>
              <Arrow />
            </Link>
          </FadeUp>
        </div>
      </div>
    </article>
  )
}
