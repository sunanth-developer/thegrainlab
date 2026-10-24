import { motion, useReducedMotion } from 'motion/react'
import { DUR, EASE, viewportOnce } from '../../lib/motion.js'
import './motion.css'

const CLIP = {
  bottom: 'inset(100% 0% 0% 0%)',
  top: 'inset(0% 0% 100% 0%)',
  right: 'inset(0% 0% 0% 100%)',
  left: 'inset(0% 100% 0% 0%)',
}

/**
 * Image mask reveal: the frame wipes open while the contents settle from a
 * slight zoom. `trigger="mount"` plays immediately (above the fold).
 */
export default function MaskReveal({
  from = 'bottom',
  delay = 0,
  duration = DUR.slow,
  trigger = 'view',
  className = '',
  children,
}) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={`mask-reveal ${className}`}>{children}</div>

  const target = { clipPath: 'inset(0% 0% 0% 0%)' }
  const play = trigger === 'mount' ? { animate: target } : { whileInView: target, viewport: viewportOnce }
  const inner = trigger === 'mount' ? { animate: { scale: 1 } } : { whileInView: { scale: 1 }, viewport: viewportOnce }

  return (
    <motion.div
      className={`mask-reveal ${className}`}
      initial={{ clipPath: CLIP[from] }}
      transition={{ duration, delay, ease: EASE }}
      {...play}
    >
      <motion.div
        className="mask-reveal__inner"
        initial={{ scale: 1.16 }}
        transition={{ duration: duration * 1.25, delay, ease: EASE }}
        {...inner}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
