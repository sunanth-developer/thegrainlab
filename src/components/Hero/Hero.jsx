import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import Img from '../Img/Img.jsx'
import Arrow from '../Icon/Arrow.jsx'
import LineReveal from '../motion/LineReveal.jsx'
import MaskReveal from '../motion/MaskReveal.jsx'
import FadeUp from '../motion/FadeUp.jsx'
import Parallax from '../motion/Parallax.jsx'
import { categoryPath, getVisibleCategories, pad } from '../../lib/catalogue.js'
import { useMediaQuery } from '../../lib/hooks.js'
import { DUR, EASE } from '../../lib/motion.js'
import './Hero.css'

const categories = getVisibleCategories()

export default function Hero({ ctaHref = '#categories' }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const wide = useMediaQuery('(min-width: 900px)')
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const lift = useTransform(scrollYProgress, [0, 1], ['0%', reduce || !wide ? '0%' : '-22%'])

  return (
    <section ref={ref} className="hero surface tone-dark" data-tone="dark" aria-labelledby="hero-title">
      <div className="hero__media">
        <MaskReveal from="right" trigger="mount" delay={0.05} duration={1.5} className="hero__mask">
          <Parallax speed={0.05} className="hero__parallax">
            <Img imageKey="hero" ratio="fill" priority sizes="(min-width: 900px) 52vw, 100vw" position="55% 60%" />
          </Parallax>
        </MaskReveal>
        <motion.p
          className="hero__caption"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: DUR.base }}
        >
          Breakfast porridge, served with figs
        </motion.p>
      </div>

      <motion.div className="hero__top container" style={{ y: lift }}>
        <FadeUp trigger="mount" delay={0.15} className="label hero__label">
          Millet flours, mixes, pasta &amp; breakfast
        </FadeUp>
        <LineReveal
          as="h1"
          id="hero-title"
          trigger="mount"
          delay={0.2}
          className="hero__title"
          lines={['Rethink your', <span key="accent" className="hero__title-accent">morning.</span>]}
        />
      </motion.div>

      <div className="hero__bottom container">
        <FadeUp trigger="mount" delay={0.7} className="hero__intro">
          <p className="lede">A fresh perspective on grains and the everyday breakfast.</p>
          <a href={ctaHref} className="btn">
            Explore the collection
            <span className="btn__icon">
              <Arrow direction="down" />
            </span>
          </a>
        </FadeUp>

        <nav className="hero__index" aria-label="Product categories">
          <ul>
            {categories.map((c, i) => (
              <motion.li
                key={c.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.06, duration: DUR.base, ease: EASE }}
              >
                <Link to={categoryPath(c.slug)} className="hero__index-link">
                  <span className="hero__index-num" aria-hidden="true">
                    {pad(i + 1)}
                  </span>
                  <span className="link-line">{c.name}</span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  )
}
