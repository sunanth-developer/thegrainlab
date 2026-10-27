import ProductSection from './ProductSection.jsx'
import NutritionTable from './NutritionTable.jsx'
import { valueOf } from '../../lib/nutrition.js'

export default function NutritionPanel({ product }) {
  const { nutrition, pack } = product
  const [main, ...others] = nutrition.groups
  const servingColumn = main.columns.find((c) => c.key === 'perServing')
  const anyCalculated = nutrition.groups.some((g) => g.columns.some((c) => c.calculated))
  const accompanimentGroup = others[0]

  return (
    <ProductSection id="nutrition" label="Nutrition" title="Nutrition information" tone="raised">
      <div className="nutri">
        <div className="nutri__summary">
          <p className="nutri__serving">
            <span>Serving size</span>
            {pack.servingSize}
            <small>{pack.servingsPerPack} servings per pack</small>
          </p>
          <ul className="nutri__cards">
            {nutrition.summary.map((name) => (
              <li key={name} className="nutri__card">
                <span className="nutri__value">
                  {valueOf(main, name, 'perServing')}
                  {servingColumn?.calculated && <span className="ntable__mark">†</span>}
                </span>
                <span className="nutri__name">{name} per serving</span>
              </li>
            ))}
          </ul>
          {accompanimentGroup && (
            <p className="nutri__separate">
              {accompanimentGroup.title} values are listed in their own table below and are not included in these
              figures.
            </p>
          )}
        </div>

        <div className="nutri__tables">
          {nutrition.groups.map((g) => (
            <NutritionTable key={g.id} group={g} id={`ntable-${g.id}`} />
          ))}
        </div>

        <div className="nutri__notes">
          {anyCalculated && (
            <p>
              † Calculated from the per 100 g values printed on the label (× 0.75 for a 75 g serving). These per-serving
              amounts are not printed on the pack.
            </p>
          )}
          {nutrition.notes.map((n) => (
            <p key={n}>{n}</p>
          ))}
        </div>
      </div>
    </ProductSection>
  )
}
