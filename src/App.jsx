import { useRef } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import Header from './components/Header/Header.jsx'
import Footer from './components/Footer/Footer.jsx'
import Home from './pages/Home.jsx'
import Products from './pages/Products.jsx'
import CategoryPage from './pages/CategoryPage.jsx'
import ProductPage from './pages/ProductPage.jsx'
import NotFound from './pages/NotFound.jsx'
import { EASE } from './lib/motion.js'

function AppShell() {
  const location = useLocation()
  const mainRef = useRef(null)

  const onPageEnter = () => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    mainRef.current?.focus({ preventScroll: true })
  }

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
              <Route path="/products/:slug" element={<CategoryPage />} />
              <Route path="/products/:slug/:productId" element={<ProductPage />} />
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
