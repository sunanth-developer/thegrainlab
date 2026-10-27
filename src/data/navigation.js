/**
 * Primary navigation. `match` decides which routes mark an item as current,
 * so product pages highlight their family.
 */
export const navigation = [
  { label: 'Home', to: '/', match: (p) => p === '/' },
  { label: 'Explore Products', to: '/products', match: (p) => p === '/products' },
  {
    label: 'Pancake Mixes',
    to: '/pancake-mixes',
    match: (p) => p === '/pancake-mixes' || /^\/products\/(vanilla|chocolate)-protein-pancake-mix$/.test(p),
  },
  { label: 'Millet Idli Mix', to: '/products/millet-idli-mix', match: (p) => p === '/products/millet-idli-mix' },
]
