/**
 * One label nutrition table. Calculated columns are marked † and styled apart
 * from values printed on the label. The table sits in a focusable scroll region
 * so it never breaks the layout on small screens; the title stays put.
 */
export default function NutritionTable({ group, id }) {
  const titleId = `${id}-title`
  return (
    <div className="ntable" style={{ '--cols': group.columns.length + 1 }}>
      <div className="ntable__box">
        <h3 className="ntable__title" id={titleId}>
          {group.title}
        </h3>
        <div className="ntable__scroll" role="region" aria-labelledby={titleId} tabIndex={0}>
          <table>
            <caption className="visually-hidden">{group.title}</caption>
            <thead>
              <tr>
                <th scope="col">Nutrient</th>
                {group.columns.map((c) => (
                  <th key={c.key} scope="col" className={c.calculated ? 'is-calculated' : undefined}>
                    {c.label}
                    {c.calculated && <span className="ntable__mark">†</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {group.rows.map((row) => (
                <tr key={row.nutrient}>
                  <th scope="row">{row.nutrient}</th>
                  {group.columns.map((c) => (
                    <td key={c.key} className={c.calculated ? 'is-calculated' : undefined}>
                      {row[c.key] ?? '–'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {group.note && <p className="ntable__note">{group.note}</p>}
    </div>
  )
}
