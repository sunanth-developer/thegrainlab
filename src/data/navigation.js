/**
 * Primary navigation. Each item points at a category slug, a collection slug or
 * the full catalogue. Items whose target is not published are hidden.
 */

export const navigation = [
  { label: 'All products', to: '/products', type: 'all' },
  { label: 'Flours', type: 'category', slug: 'millet-flours' },
  { label: 'Dosa mixes', type: 'category', slug: 'dosa-mixes' },
  { label: 'Pasta', type: 'category', slug: 'millet-pasta' },
  { label: 'Breakfast', type: 'collection', slug: 'breakfast' },
]
