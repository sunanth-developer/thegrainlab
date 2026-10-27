/** Splits a label ingredient statement on top-level commas (not inside brackets). */
function splitIngredients(text) {
  const items = []
  let depth = 0
  let current = ''
  for (const ch of text) {
    if ('([{'.includes(ch)) depth++
    if (')]}'.includes(ch)) depth--
    if (ch === ',' && depth === 0) {
      items.push(current.trim())
      current = ''
    } else current += ch
  }
  if (current.trim()) items.push(current.trim())
  return items
}

/** Pulls a leading percentage such as "(39%)" out for emphasis. */
function parts(item) {
  const match = /^(.*?)\s*\((\d+(?:\.\d+)?%)\)$/.exec(item)
  return match ? { name: match[1], percent: match[2] } : { name: item, percent: null }
}

/** The complete ingredient statement and allergen information, exactly as printed on the pack. */
export default function IngredientList({ product }) {
  const { ingredients, allergens } = product
  return (
    <div className="ingr">
      <h3 className="ingr__heading">
        Full ingredient list <span>as printed on the pack</span>
      </h3>
      <div className="ingr__lists">
        {ingredients.map((group) => (
          <div key={group.title} className="ingr__group">
            <h4 className="ingr__title">{ingredients.length > 1 ? group.title : 'Ingredients'}</h4>
            <ol className="ingr__list">
              {splitIngredients(group.text).map((item) => {
                const { name, percent } = parts(item)
                return (
                  <li key={item}>
                    <span className="ingr__name">
                      {name}
                      {percent && <span className="ingr__pct">{percent}</span>}
                    </span>
                  </li>
                )
              })}
            </ol>
          </div>
        ))}
      </div>

      <aside className="ingr__allergens" aria-labelledby="allergen-title">
        <h4 id="allergen-title" className="ingr__title">
          Allergen information
        </h4>
        {allergens.declared ? (
          <>
            <p className="ingr__statement">{allergens.statement}</p>
            {allergens.notes.map((n) => (
              <p key={n}>{n}</p>
            ))}
          </>
        ) : (
          <p>
            The label artwork supplied for this product does not include an allergen statement. Please check the pack
            before use.
          </p>
        )}
      </aside>
    </div>
  )
}
