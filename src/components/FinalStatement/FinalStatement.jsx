import { Link } from 'react-router-dom'
import Img from '../Img/Img.jsx'
import Arrow from '../Icon/Arrow.jsx'
import LineReveal from '../motion/LineReveal.jsx'
import MaskReveal from '../motion/MaskReveal.jsx'
import FadeUp from '../motion/FadeUp.jsx'
import Parallax from '../motion/Parallax.jsx'
import './FinalStatement.css'

export default function FinalStatement({
  lines = ['Make room for', <em key="accent" className="accent-italic">something different.</em>],
  ctaLabel = 'Explore all products',
  ctaTo = '/products',
  imageKey = 'closing',
}) {
  return (
    <section className="final tone-dark" data-tone="dark" aria-labelledby="final-title">
      <div className="final__media">
        <MaskReveal from="bottom" className="final__mask">
          <Parallax speed={0.06} zoom={0.08} className="final__parallax">
            <Img imageKey={imageKey} ratio="fill" sizes="100vw" position="78% 50%" alt="" />
          </Parallax>
        </MaskReveal>
      </div>
      <div className="final__content container">
        <LineReveal as="h2" id="final-title" lines={lines} className="final__title title-lg" />
        <FadeUp delay={0.25}>
          <Link to={ctaTo} className="btn">
            {ctaLabel}
            <span className="btn__icon">
              <Arrow />
            </span>
          </Link>
        </FadeUp>
      </div>
    </section>
  )
}
