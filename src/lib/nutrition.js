/**
 * Helpers for label nutrition data.
 *
 * Values are stored exactly as printed on the label (e.g. '18.9 g', '405 kcal').
 * A calculated column (e.g. per 75 g from per 100 g) is derived here, never
 * typed by hand, so it cannot drift from the printed figures.
 */

const VALUE = /^([\d,]*\.?\d+)\s*(kcal|mg|g)$/

/** Scale a printed value such as '18.9 g' by `factor`. Returns null for '–', 'BLQ', '<1.0 g' etc. */
export function scaleValue(printed, factor) {
  const match = VALUE.exec(printed ?? '')
  if (!match) return null
  const [, number, unit] = match
  const n = parseFloat(number.replace(/,/g, ''))
  const sourceDecimals = (number.split('.')[1] ?? '').length
  const decimals = unit === 'kcal' ? 0 : Math.max(1, sourceDecimals)
  return `${roundHalfUp(n * factor, decimals).toFixed(decimals)} ${unit}`
}

/** Half-up rounding that is not thrown off by binary floating point (5.8 × 0.75 = 4.35 → 4.4). */
function roundHalfUp(value, decimals) {
  const scale = 10 ** decimals
  return Math.round(value * scale + 1e-9) / scale
}

/** Adds a calculated column to label rows: `to` = `from` × `factor`. */
export function withCalculatedColumn(rows, { from, to, factor }) {
  return rows.map((row) => ({ ...row, [to]: scaleValue(row[from], factor) ?? '–' }))
}

/** Looks up one nutrient's value in a nutrition group. */
export function valueOf(group, nutrient, column) {
  return group?.rows.find((r) => r.nutrient === nutrient)?.[column] ?? null
}
