import { Fragment } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { DUR, EASE, STAGGER, viewportOnce } from '../../lib/motion.js'
import './motion.css'

/**
 * Editorial headline reveal: each line rises out of its own mask.
 * Pass explicit `lines` so line breaks are art-directed, not left to wrapping.
 */
export default function LineReveal({
  as = 'h2',
  lines,
  className = '',
  delay = 0,
  trigger = 'view',
  id,
}) {
  const reduce = useReducedMotion()
  const Tag = as

  return (
    <Tag className={`line-reveal ${className}`} id={id}>
      {lines.map((line, i) => (
        <Fragment key={i}>
          <span className="line-reveal__line">
            {reduce ? (
              <span className="line-reveal__inner">{line}</span>
            ) : (
              <motion.span
                className="line-reveal__inner"
                initial={{ y: '115%' }}
                {...(trigger === 'mount'
                  ? { animate: { y: '0%' } }
                  : { whileInView: { y: '0%' }, viewport: viewportOnce })}
                transition={{ duration: DUR.slow, delay: delay + i * STAGGER, ease: EASE }}
              >
                {line}
              </motion.span>
            )}
          </span>
          {i < lines.length - 1 && ' '}
        </Fragment>
      ))}
    </Tag>
  )
}
