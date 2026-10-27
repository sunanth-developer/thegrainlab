import { Link } from 'react-router-dom'
import Img from '../../components/Img/Img.jsx'
import Parallax from '../../components/motion/Parallax.jsx'
import LineReveal from '../../components/motion/LineReveal.jsx'
import FadeUp from '../../components/motion/FadeUp.jsx'
import Arrow from '../../components/Icon/Arrow.jsx'
import './FinalCta.css'

export default function FinalCta({ image = 'final' }) {
  return (
    <section className="final tone-dark" data-tone="dark" aria-labelledby="final-title">
      <div className="final__media" aria-hidden="true">
        <Parallax speed={0.08} zoom={0.06}>
          <Img imageKey={image} ratio="fill" sizes="100vw" position="70% 60%" alt="" />
        </Parallax>
      </div>
      <div className="container final__inner">
        <LineReveal
          id="final-title"
          className="title-lg final__title"
          lines={['Make breakfast', <em key="accent">the easy choice.</em>]}
        />
        <FadeUp delay={0.2}>
          <Link to="/products" className="btn final__btn">
            Explore the collection
            <span className="btn__icon">
              <Arrow />
            </span>
          </Link>
        </FadeUp>
      </div>
    </section>
  )
}
