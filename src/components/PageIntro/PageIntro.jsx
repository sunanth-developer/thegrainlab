import LineReveal from '../motion/LineReveal.jsx'
import FadeUp from '../motion/FadeUp.jsx'
import './PageIntro.css'

/** Typographic page opener for inner pages. */
export default function PageIntro({ label, lines, intro, children, tone = 'light', className = '' }) {
  return (
    <header className={`page-intro ${tone === 'dark' ? 'tone-dark' : ''} ${className}`} data-tone={tone}>
      <div className="container page-intro__inner">
        {label && (
          <FadeUp trigger="mount" delay={0.15}>
            <p className="label">{label}</p>
          </FadeUp>
        )}
        <LineReveal as="h1" trigger="mount" delay={0.2} className="title-lg page-intro__title" lines={lines} />
        {intro && (
          <FadeUp trigger="mount" delay={0.5} className="page-intro__intro">
            <p className="lede">{intro}</p>
          </FadeUp>
        )}
        {children}
      </div>
    </header>
  )
}
