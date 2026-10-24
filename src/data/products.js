/**
 * Product catalogue.
 *
 * Intentionally empty until authentic product information is supplied. While it
 * is empty the site shows category-level discovery instead of product cards.
 *
 * Add one object per verified product. Only `id`, `name` and `category` are
 * required; every other field is optional and is hidden when missing. Never
 * fill a field with an estimate.
 *
 * {
 *   id: 'unique-id',
 *   name: 'Product name',
 *   category: 'dosa-mixes',              // a slug from categories.js
 *   image: 'image-key',                  // a key from images.js (official pack shot)
 *   description: 'One or two sentences.',
 *   ingredients: ['Ingredient', '...'],  // as printed on pack
 *   packSize: '500 g',
 *   nutrition: {                         // as printed on pack
 *     basis: 'per 100 g',
 *     rows: [{ label: 'Energy', value: '...' }],
 *   },
 *   price: { amount: 0, currency: 'INR' },
 *   availability: 'In stock',
 *   purchaseUrl: 'https://...',
 * }
 */

export const products = []
