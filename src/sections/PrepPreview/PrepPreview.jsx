import { Link } from 'react-router-dom'
import Img from '../../components/Img/Img.jsx'
import MaskReveal from '../../components/motion/MaskReveal.jsx'
import LineReveal from '../../components/motion/LineReveal.jsx'
import FadeUp from '../../components/motion/FadeUp.jsx'
import Arrow from '../../components/Icon/Arrow.jsx'
import { getLaunchProducts, getProduct, productPath } from '../../lib/catalogue.js'
import './PrepPreview.css'

/** Both pancake mixes share one method, so they share one preview. */
function tracks() {
  const pancake = getLaunchProducts('pancake')[0]
  const idli = getProduct('millet-idli-mix')
  return [
    pancake && {
      id: 'pancake',
      title: 'Pancake mixes',
      note: 'Vanilla and chocolate',
      steps: pancake.preparation.quickSteps,
      image: pancake.images.texture,
      theme: pancake.theme,
      to: '/pancake-mixes#preparation',
    },
    idli && {
      id: 'idli',
      title: 'Idli mix',
      note: 'With the tomato chutney mix',
      steps: idli.preparation.quickSteps,
      image: idli.images.texture,
      theme: idli.theme,
      to: productPath(idli, 'preparation'),
    },
  ].filter(Boolean)
}

export default function PrepPreview() {
  return (
    <section className="prep-preview section tone-dark" data-tone="dark" aria-labelledby="prep-preview-title">
      <div className="container">
        <header className="prep-preview__header">
          <p className="label">How to prepare</p>
          <LineReveal
            id="prep-preview-title"
            className="title-md"
            lines={['One cup of mix,', <em key="accent">¾ cup of water.</em>]}
          />
        </header>

        <div className="prep-preview__grid">
          {tracks().map((t, i) => (
            <article
              key={t.id}
              className="prep-preview__track"
              style={{ '--p-bg': t.theme.background, '--p-strong': t.theme.strong }}
              aria-labelledby={`prep-${t.id}`}
            >
              <MaskReveal delay={i * 0.12} className="prep-preview__photo">
                <Img imageKey={t.image} ratio="4 / 3" sizes="(min-width: 900px) 40vw, 100vw" />
              </MaskReveal>
              <div className="prep-preview__body">
                <h3 id={`prep-${t.id}`} className="prep-preview__title">
                  {t.title} <span>{t.note}</span>
                </h3>
                <ol className="prep-preview__steps">
                  {t.steps.map((s, n) => (
                    <FadeUp as="li" key={s.text} delay={0.1 + n * 0.08}>
                      <span className="prep-preview__num">{n + 1}</span>
                      <span className="prep-preview__text">{s.text}</span>
                      {s.time && <span className="prep-preview__time">{s.time}</span>}
                    </FadeUp>
                  ))}
                </ol>
                <Link to={t.to} className="link-arrow">
                  Full instructions<span className="visually-hidden">: {t.title}</span>
                  <Arrow />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
