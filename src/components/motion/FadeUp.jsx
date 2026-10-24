import { motion } from 'motion/react'
import { DUR, EASE, viewportOnce } from '../../lib/motion.js'

/** Short, once-only entrance for supporting copy and controls. */
export default function FadeUp({ as = 'div', delay = 0, y = 16, trigger = 'view', className, children, ...rest }) {
  const Component = motion[as] ?? motion.div
  const target = { opacity: 1, y: 0 }
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      {...(trigger === 'mount' ? { animate: target } : { whileInView: target, viewport: viewportOnce })}
      transition={{ duration: DUR.base, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Component>
  )
}
