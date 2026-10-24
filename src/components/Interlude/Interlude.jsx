import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import Img from '../Img/Img.jsx'
import LineReveal from '../motion/LineReveal.jsx'
import FadeUp from '../motion/FadeUp.jsx'
import './Interlude.css'

/** Full-bleed photographic pause between the range and the food stories. */
export default function Interlude({
  imageKey = 'interlude',
  lines = ['Good mornings begin', <em key="accent" className="accent-italic">with better choices.</em>],
  note = 'The Grain Lab',
}) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.22, 1])
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-6%', '6%'])

  return (
    <section ref={ref} className="interlude tone-dark" data-tone="dark" aria-label="Good mornings begin with better choices">
      <motion.div className="interlude__media" style={{ scale, y }}>
        <Img imageKey={imageKey} ratio="fill" sizes="100vw" position="70% 50%" alt="" />
      </motion.div>
      <div className="interlude__shade" aria-hidden="true" />
      <div className="container interlude__content">
        <FadeUp as="p" className="label">
          {note}
        </FadeUp>
        <LineReveal as="p" lines={lines} className="interlude__line" />
      </div>
    </section>
  )
}
