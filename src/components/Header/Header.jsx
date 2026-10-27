import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { LogoImage } from '../Logo/Logo.jsx'
import MobileMenu from './MobileMenu.jsx'
import { navigation } from '../../data/navigation.js'
import { useHeaderState } from '../../lib/hooks.js'
import { EASE } from '../../lib/motion.js'
import './Header.css'

export default function Header() {
  const { pathname } = useLocation()
  const { scrolled, hidden, tone } = useHeaderState(pathname)
  // The menu belongs to the path it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState(null)
  const open = openOn === pathname
  const toggleRef = useRef(null)

  // Lets sticky in-page navigation sit below the header only while it is shown.
  useEffect(() => {
    document.documentElement.dataset.header = hidden && !open ? 'hidden' : 'shown'
  }, [hidden, open])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpenOn(null)
        toggleRef.current?.focus()
      }
    }
    const onResize = () => window.innerWidth >= 900 && setOpenOn(null)
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  const classes = [
    'site-header',
    `site-header--${open ? 'dark' : tone}`,
    scrolled && !open && 'is-scrolled',
    hidden && !open && 'is-hidden',
    open && 'is-open',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      <header className={classes}>
        <motion.div
          className="site-header__inner container"
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
        >
          <Link to="/" className="site-header__logo" aria-label="The Grain Lab — home" onClick={() => setOpenOn(null)}>
            <LogoImage variant="mark" className="site-header__logo-img site-header__logo-img--ink" alt="" />
            <LogoImage variant="mark-light" className="site-header__logo-img site-header__logo-img--light" alt="" />
          </Link>

          <nav className="site-nav" aria-label="Primary">
            <ul>
              {navigation.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="site-nav__link"
                    aria-current={item.match(pathname) ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <button
            ref={toggleRef}
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpenOn(open ? null : pathname)}
          >
            <span className="menu-toggle__label">{open ? 'Close' : 'Menu'}</span>
            <span className="menu-toggle__lines" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </motion.div>
      </header>

      <AnimatePresence>
        {open && <MobileMenu pathname={pathname} onNavigate={() => setOpenOn(null)} />}
      </AnimatePresence>
    </>
  )
}
