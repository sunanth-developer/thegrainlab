/**
 * Shared frame for product page sections: anchor id, label, heading, content.
 * `layout="wide"` puts the heading above a full-width body instead of beside it.
 */
export default function ProductSection({ id, label, title, intro, tone = 'plain', layout = 'split', className = '', children }) {
  return (
    <section id={id} className={`psec psec--${tone} psec--${layout} ${className}`} data-tone="light" aria-labelledby={`${id}-title`}>
      <div className="container psec__inner">
        <header className="psec__header">
          <p className="label">{label}</p>
          <h2 id={`${id}-title`} className="psec__title">
            {title}
          </h2>
          {intro && <p className="psec__intro">{intro}</p>}
        </header>
        <div className="psec__body">{children}</div>
      </div>
    </section>
  )
}
