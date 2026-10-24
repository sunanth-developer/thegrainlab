import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useMediaQuery } from '../../lib/hooks.js'
import './motion.css'

/**
 * Scroll-linked drift for layered depth. The content is scaled just enough to
 * cover the travel, and the effect is switched off on small screens and for
 * reduced-motion users.
 */
export default function Parallax({ speed = 0.08, zoom = 0, className = '', children }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const wide = useMediaQuery('(min-width: 900px)')
  const amount = reduce || !wide ? 0 : speed
  const zoomAmount = reduce ? 0 : zoom

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`${-amount * 100}%`, `${amount * 100}%`])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1 + amount * 2 + zoomAmount, 1 + amount * 2])

  return (
    <div ref={ref} className={`parallax ${className}`}>
      <motion.div className="parallax__inner" style={{ y, scale }}>
        {children}
      </motion.div>
    </div>
  )
}
