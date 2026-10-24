import LineReveal from '../motion/LineReveal.jsx'
import FadeUp from '../motion/FadeUp.jsx'
import './SectionHeader.css'

export default function SectionHeader({ id, index, label, lines, intro, children, as = 'h2', className = '' }) {
  return (
    <header className={`section-header ${className}`}>
      <div className="section-header__main">
        {label && (
          <FadeUp as="p" className="label">
            {index && <span className="label__index">{index}</span>}
            {label}
          </FadeUp>
        )}
        <LineReveal as={as} id={id} lines={lines} className="section-header__title title-md" />
      </div>
      {(intro || children) && (
        <FadeUp className="section-header__aside" delay={0.15}>
          {intro && <p className="section-header__intro">{intro}</p>}
          {children}
        </FadeUp>
      )}
    </header>
  )
}
