import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { EASE } from '../../lib/motion.js'
import { navigation } from '../../data/navigation.js'
import { getLaunchProducts, pad, productPath } from '../../lib/catalogue.js'

const products = getLaunchProducts()

export default function MobileMenu({ pathname, onNavigate }) {
  const ref = useRef(null)

  useEffect(() => {
    const main = document.getElementById('main-content')
    const footer = document.querySelector('.site-footer')
    document.body.classList.add('is-locked')
    main?.setAttribute('inert', '')
    footer?.setAttribute('inert', '')
    ref.current?.querySelector('a')?.focus({ preventScroll: true })
    return () => {
      document.body.classList.remove('is-locked')
      main?.removeAttribute('inert')
      footer?.removeAttribute('inert')
    }
  }, [])

  return (
    <motion.div
      ref={ref}
      id="mobile-menu"
      className="mobile-menu tone-dark"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
      animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      exit={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.45, ease: [0.65, 0, 0.35, 1] } }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <nav className="mobile-menu__nav container" aria-label="Mobile">
        <ul>
          {navigation.map((item, i) => (
            <li key={item.label} className="mobile-menu__item">
              <motion.span
                className="mobile-menu__mask"
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ delay: 0.18 + i * 0.06, duration: 0.9, ease: EASE }}
              >
                <Link
                  to={item.to}
                  className="mobile-menu__link"
                  aria-current={item.match(pathname) ? 'page' : undefined}
                  onClick={onNavigate}
                >
                  <span className="mobile-menu__index" aria-hidden="true">
                    {pad(i + 1)}
                  </span>
                  {item.label}
                </Link>
              </motion.span>
            </li>
          ))}
        </ul>
      </nav>

      <motion.div
        className="mobile-menu__foot container"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7, ease: EASE }}
      >
        <p className="label">The launch collection</p>
        <ul className="mobile-menu__products">
          {products.map((p) => (
            <li key={p.slug}>
              <Link to={productPath(p)} onClick={onNavigate} className="link-line">
                {p.name}
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  )
}
