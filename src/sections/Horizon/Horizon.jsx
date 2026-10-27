import Img from '../../components/Img/Img.jsx'
import LineReveal from '../../components/motion/LineReveal.jsx'
import MaskReveal from '../../components/motion/MaskReveal.jsx'
import FadeUp from '../../components/motion/FadeUp.jsx'
import { getFutureConcepts, pad } from '../../lib/catalogue.js'
import './Horizon.css'

/**
 * Future concepts only. Deliberately not links: there are no product pages,
 * packaging, prices, dates or availability for these.
 */
export default function Horizon({ id = 'on-the-horizon' }) {
  const concepts = getFutureConcepts()
  if (!concepts.length) return null

  return (
    <section id={id} className="horizon section" data-tone="light" aria-labelledby={`${id}-title`}>
      <div className="container">
        <header className="horizon__header">
          <p className="label">On the horizon</p>
          <LineReveal id={`${id}-title`} className="title-lg" lines={['What’s', <em key="accent">next.</em>]} />
          <FadeUp delay={0.15} className="horizon__intro">
            <p className="lede">
              Cereal concepts currently in development. They are not part of the launch collection and are not yet
              available.
            </p>
          </FadeUp>
        </header>

        <ul className="horizon__list">
          {concepts.map((c, i) => (
            <li key={c.slug} className="horizon__item">
              <MaskReveal delay={i * 0.12} className="horizon__photo">
                <Img imageKey={c.image} ratio="4 / 5" sizes="(min-width: 900px) 34vw, 100vw" />
                <span className="horizon__stamp">Concept</span>
              </MaskReveal>
              <FadeUp delay={0.15 + i * 0.12} className="horizon__meta">
                <p className="horizon__index">
                  {pad(i + 1)} · {c.format}
                </p>
                <h3 className="horizon__name">{c.name}</h3>
                <p className="horizon__status">{c.status}</p>
              </FadeUp>
            </li>
          ))}
        </ul>

        <p className="horizon__note">Ingredient mood studies shown — not finished products or packaging.</p>
      </div>
    </section>
  )
}
