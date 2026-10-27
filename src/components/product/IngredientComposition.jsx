import Img from '../Img/Img.jsx'

/**
 * Photographic breakdown of the quantified ingredients: each disc's area
 * follows the listed amount, sitting on one shelf line. Only ingredients with
 * a sourced quantity are drawn; the note says what is left out. The
 * accompaniment sits apart, after a divider, because it is packed separately.
 */
export default function IngredientComposition({ story }) {
  const quantified = story.items.filter((it) => it.quantity)
  if (!quantified.length) return null
  const max = Math.max(...quantified.map((it) => it.quantity.amount))
  const { composition, accompaniment } = story

  return (
    <figure className="icomp" aria-labelledby="icomp-title">
      <div className="icomp__head">
        <p id="icomp-title" className="icomp__title">
          {composition.title}
        </p>
        <p className="icomp__basis">{composition.basis}</p>
      </div>

      <div className="icomp__body">
        <ol className="icomp__shelf">
          {quantified.map((it) => (
            <li key={it.id} className="icomp__item" style={{ '--f': Math.sqrt(it.quantity.amount / max) }}>
              <span className="icomp__disc">
                <Img imageKey={it.image} ratio="1 / 1" sizes="(min-width: 900px) 240px, 40vw" alt="" fallbackLabel={it.name} />
              </span>
              <span className="icomp__qty">{it.quantity.display}</span>
              <span className="icomp__name">{it.name}</span>
            </li>
          ))}
        </ol>

        {accompaniment && (
          <aside className="icomp__side" aria-label={`${accompaniment.name}, packed separately`}>
            <p className="icomp__side-label">Alongside the mix</p>
            <span className="icomp__disc icomp__disc--side">
              <Img imageKey={accompaniment.image} ratio="1 / 1" sizes="160px" alt="" fallbackLabel={accompaniment.name} />
            </span>
            <p className="icomp__side-name">
              {accompaniment.name} <span>{accompaniment.amount}</span>
            </p>
            <p className="icomp__side-role">{accompaniment.role}</p>
            <p className="icomp__side-note">{accompaniment.note}</p>
          </aside>
        )}
      </div>

      <figcaption className="icomp__note">{composition.note}</figcaption>
    </figure>
  )
}
