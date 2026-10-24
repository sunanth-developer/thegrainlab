import { Link } from 'react-router-dom'
import Img from '../Img/Img.jsx'
import LineReveal from '../motion/LineReveal.jsx'
import MaskReveal from '../motion/MaskReveal.jsx'
import FadeUp from '../motion/FadeUp.jsx'
import './PageHero.css'

/**
 * Inner-page hero. `theme` paints the section in a category's own colour so
 * the campaign photograph and the page read as one composition.
 */
export default function PageHero({
  theme = { tone: 'light' },
  breadcrumbs,
  label,
  lines,
  intro,
  imageKey,
  imageRatio = '4 / 5',
  imagePosition,
  layout = 'split',
  children,
}) {
  const dark = theme.tone === 'dark'
  return (
    <section
      className={`page-hero page-hero--${layout}${imageKey ? '' : ' page-hero--text'}${dark ? ' tone-dark' : ''}`}
      data-tone={theme.tone}
      style={{ '--media-ratio': imageRatio, ...(theme.background && { '--hero-bg': theme.background }) }}
    >
      <div className="container page-hero__inner">
        <div className="page-hero__text">
          {breadcrumbs?.length > 0 && (
            <FadeUp as="nav" trigger="mount" delay={0.1} aria-label="Breadcrumb" className="breadcrumbs">
              <ol>
                {breadcrumbs.map((crumb, i) =>
                  i < breadcrumbs.length - 1 ? (
                    <li key={crumb.label}>
                      <Link to={crumb.to} className="link-line">
                        {crumb.label}
                      </Link>
                    </li>
                  ) : (
                    <li key={crumb.label} aria-current="page">
                      {crumb.label}
                    </li>
                  ),
                )}
              </ol>
            </FadeUp>
          )}
          {label && (
            <FadeUp as="p" trigger="mount" delay={0.15} className="label">
              {label}
            </FadeUp>
          )}
          <LineReveal as="h1" trigger="mount" delay={0.2} lines={lines} className="page-hero__title" />
          {intro && (
            <FadeUp as="p" trigger="mount" delay={0.45} className="lede page-hero__intro">
              {intro}
            </FadeUp>
          )}
          {children && (
            <FadeUp trigger="mount" delay={0.55} className="page-hero__extra">
              {children}
            </FadeUp>
          )}
        </div>

        {imageKey && (
          <MaskReveal trigger="mount" from={layout === 'wide' ? 'bottom' : 'right'} delay={0.1} className="page-hero__media">
            <Img
              imageKey={imageKey}
              ratio="fill"
              className="page-hero__img"
              position={imagePosition}
              priority
              sizes={layout === 'wide' ? '100vw' : '(min-width: 900px) 50vw, 100vw'}
            />
          </MaskReveal>
        )}
      </div>
    </section>
  )
}
