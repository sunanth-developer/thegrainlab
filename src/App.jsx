import { useEffect, useRef } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import Header from './components/Header/Header.jsx'
import Footer from './components/Footer/Footer.jsx'
import Home from './pages/Home.jsx'
import Products from './pages/Products.jsx'
import PancakeMixes from './pages/PancakeMixes.jsx'
import ProductPage from './pages/ProductPage.jsx'
import NotFound from './pages/NotFound.jsx'
import { EASE } from './lib/motion.js'

function scrollToHash() {
  const id = decodeURIComponent(window.location.hash.slice(1))
  const target = id && document.getElementById(id)
  if (!target) return false
  target.scrollIntoView({ behavior: 'instant', block: 'start' })
  return true
}

function AppShell() {
  const location = useLocation()
  const mainRef = useRef(null)

  const onPageEnter = () => {
    if (!scrollToHash()) window.scrollTo({ top: 0, behavior: 'instant' })
    mainRef.current?.focus({ preventScroll: true })
  }

  // Same-page hash links and deep links (e.g. /products#on-the-horizon).
  useEffect(() => {
    if (!location.hash) return undefined
    const timer = setTimeout(scrollToHash, 60)
    return () => clearTimeout(timer)
  }, [location.hash])

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main-content" ref={mainRef} tabIndex={-1}>
        <AnimatePresence mode="wait" initial={false} onExitComplete={onPageEnter}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.6, ease: EASE } }}
            exit={{ opacity: 0, transition: { duration: 0.3, ease: [0.65, 0, 0.35, 1] } }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:slug" element={<ProductPage />} />
              <Route path="/pancake-mixes" element={<PancakeMixes />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
        <AppShell />
      </BrowserRouter>
    </MotionConfig>
  )
}
