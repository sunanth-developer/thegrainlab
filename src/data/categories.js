/**
 * Product categories.
 *
 * Category-level references based on the brand's publicly described product
 * formats — not individual product listings. A category is shown only when
 * `published` is true and its `image` exists in the image manifest.
 *
 * image      campaign photograph (category pages, showcase)
 * focus      object-position used when that photograph is cropped
 * cardImage  overhead "format" shot used in the collection grid; replace with
 *            official pack shots when available
 * theme      colour field for the category page hero; `tone` sets text colour
 *
 * Descriptions describe the format only — never ingredients, benefits or
 * nutrition until verified.
 */

export const categories = [
  {
    slug: 'millet-flours',
    name: 'Millet flours',
    description: 'Flours milled from millet grains, for everyday cooking and baking.',
    keywords: ['flour', 'atta', 'baking', 'roti', 'millet'],
    image: 'cat-flours',
    focus: '50% 60%',
    cardImage: 'format-flours',
    theme: { background: '#b9bf9d', tone: 'light' },
    published: true,
  },
  {
    slug: 'dosa-mixes',
    name: 'Dosa mixes',
    description: 'Millet-based mixes for preparing dosa batter at home.',
    keywords: ['dosa', 'batter', 'south indian', 'breakfast', 'millet'],
    image: 'cat-dosa',
    focus: '38% 50%',
    cardImage: 'format-dosa',
    theme: { background: '#9c3f1d', tone: 'dark' },
    published: true,
  },
  {
    slug: 'millet-pasta',
    name: 'Millet pasta',
    description: 'Pasta shapes made with millet, for weeknight bowls and simple suppers.',
    keywords: ['pasta', 'fusilli', 'penne', 'dinner', 'lunch', 'millet'],
    image: 'cat-pasta',
    focus: '68% 50%',
    cardImage: 'format-pasta',
    theme: { background: '#ece1cf', tone: 'light' },
    published: true,
  },
  {
    slug: 'breakfast-porridges',
    name: 'Breakfast porridges',
    description: 'Grain porridges for a warm breakfast bowl.',
    keywords: ['porridge', 'breakfast', 'bowl', 'millet'],
    image: 'cat-porridge',
    focus: '50% 58%',
    cardImage: 'format-porridge',
    theme: { background: '#1e0f1b', tone: 'dark' },
    published: true,
    collection: 'breakfast',
  },
  {
    slug: 'pancake-blends',
    name: 'Pancake blends',
    description: 'Millet-based blends for making pancakes at home.',
    keywords: ['pancake', 'breakfast', 'batter', 'weekend', 'millet'],
    image: 'cat-pancakes',
    focus: '80% 50%',
    cardImage: 'format-pancakes',
    theme: { background: '#6b3418', tone: 'dark' },
    published: true,
    collection: 'breakfast',
  },
]

/** Collections group several categories under one route, e.g. "Breakfast". */
export const collections = [
  {
    slug: 'breakfast',
    name: 'Breakfast',
    description: 'Porridges and pancake blends, for slow weekends and quick weekday mornings.',
    image: 'gallery-table',
    theme: { background: '#251320', tone: 'dark' },
  },
]
