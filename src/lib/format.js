export function formatPrice(price) {
  if (!price || typeof price.amount !== 'number' || !price.currency) return null
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: price.currency }).format(price.amount)
}
