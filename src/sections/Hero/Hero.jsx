import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import Img from '../../components/Img/Img.jsx'
import Pack from '../../components/Pack/Pack.jsx'
import LineReveal from '../../components/motion/LineReveal.jsx'
import MaskReveal from '../../components/motion/MaskReveal.jsx'
import FadeUp from '../../components/motion/FadeUp.jsx'
import Arrow from '../../components/Icon/Arrow.jsx'
import { getProduct, productPath } from '../../lib/catalogue.js'
import { EASE } from '../../lib/motion.js'
import './Hero.css'

// Back-to-front order of the fanned pouches.
const FAN = [
  { slug: 'chocolate-protein-pancake-mix', tilt: -9, className: 'hero__pouch--left' },
  { slug: 'millet-idli-mix', tilt: 8, className: 'hero__pouch--right' },
  { slug: 'vanilla-protein-pancake-mix', tilt: -2, className: 'hero__pouch--front' },
]
  .map((f) => ({ ...f, product: getProduct(f.slug) }))
  .filter((f) => f.product)

export default function Hero() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const packY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-30%'])
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '8%'])

  return (
    <section ref={ref} className="hero" data-tone="light" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__copy">
          <FadeUp trigger="mount" delay={0.2}>
            <p className="label hero__label">From forgotten to future</p>
          </FadeUp>
          <LineReveal
            as="h1"
            id="hero-title"
            trigger="mount"
            delay={0.3}
            className="hero__title"
            lines={['Better mornings.', <em key="accent">Made more possible.</em>]}
          />
          <FadeUp trigger="mount" delay={0.75} className="hero__lede">
            <p>Complete breakfasts designed around real mornings.</p>
          </FadeUp>
          <FadeUp trigger="mount" delay={0.9} className="hero__actions">
            <Link to="/products" className="btn">
              Explore the collection
              <span className="btn__icon">
                <Arrow />
              </span>
            </Link>
            <a href="#collection" className="btn btn--ghost">
              Meet your new breakfast
              <span className="btn__icon">
                <Arrow direction="down" />
              </span>
            </a>
          </FadeUp>
        </div>

        <div className="hero__visual">
          <motion.div className="hero__photo-wrap" style={{ y: photoY }}>
            <MaskReveal trigger="mount" from="bottom" delay={0.1} duration={1.5} className="hero__photo">
              <Img imageKey="hero" ratio="fill" priority sizes="(min-width: 900px) 42vw, 100vw" position="50% 70%" />
            </MaskReveal>
          </motion.div>

          <motion.ul className="hero__packs" style={{ y: packY }} aria-label="The three launch products">
            {FAN.map(({ product, tilt, className }, i) => (
              <motion.li
                key={product.slug}
                className={`hero__pouch ${className}`}
                initial={reduce ? false : { opacity: 0, y: 70 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.3, delay: 0.8 + i * 0.12, ease: EASE }}
              >
                <Link to={productPath(product)} aria-label={product.name}>
                  <Pack product={product} tilt={tilt} priority sizes="(min-width: 900px) 190px, 30vw" />
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  )
}
