/**
 * Ingredient image manifest.
 *
 * Sources live in assets-src/ingredients/<name>.jpg; `npm run images` writes
 * public/images/ingredients/<name>-{240,480,864}.webp and their sizes/colours to
 * imageMeta.json under the key "ingredients/<name>".
 *
 * Every image here is an AI-generated illustrative still life made for this
 * site in one shared art direction (warm limestone, side light, small ceramic
 * vessels). They show what each ingredient looks like in general — they are
 * not photographs of The Grain Lab's own raw materials or of the packaged
 * product. Shared ingredients (sugar) reuse one image across products.
 */
export const INGREDIENT_IMAGE_SOURCE = {
  source: 'AI-generated illustrative ingredient photograph made for The Grain Lab website',
  licence: 'Owned by the site; no third-party licence required',
}

export const ingredientImages = {
  // Millet Idli Mix
  'ingredients/foxtail-millet-rava': {
    ingredient: 'Foxtail millet rava',
    products: ['millet-idli-mix'],
    alt: 'Coarse, pale golden foxtail millet rava in a small off-white bowl, with whole foxtail millet grains on stone.',
  },
  'ingredients/black-gram-dal-flour': {
    ingredient: 'Black gram dal flour',
    products: ['millet-idli-mix'],
    alt: 'Fine, creamy black gram dal flour in a speckled bowl with a wooden scoop, beside split white urad dal and whole black gram.',
  },
  'ingredients/sorghum-millet-rava': {
    ingredient: 'Sorghum millet rava',
    products: ['millet-idli-mix'],
    alt: 'Creamy-beige sorghum millet rava in a speckled ceramic dish, beside a small heap of whole sorghum grains.',
  },
  'ingredients/modified-rice-flour': {
    ingredient: 'Modified rice flour',
    products: ['millet-idli-mix'],
    alt: 'Very fine white rice flour smoothed flat in a white porcelain bowl on folded linen, with a brass measuring spoon.',
  },
  'ingredients/rice-flour': {
    ingredient: 'Rice flour',
    products: ['millet-idli-mix'],
    alt: 'Fine white rice flour in a terracotta bowl, with raw white rice grains scattered beside it.',
  },
  'ingredients/salt': {
    ingredient: 'Salt',
    products: ['millet-idli-mix'],
    alt: 'Coarse white salt crystals in a small grey stone pinch bowl.',
  },
  'ingredients/sugar': {
    ingredient: 'Sugar',
    products: ['millet-idli-mix', 'vanilla-protein-pancake-mix', 'chocolate-protein-pancake-mix'],
    alt: 'White granulated sugar in a speckled cream bowl with a small wooden spoon.',
  },
  'ingredients/sodium-bicarbonate': {
    ingredient: 'Sodium bicarbonate',
    products: ['millet-idli-mix'],
    alt: 'Fine white sodium bicarbonate (baking soda) in a white enamel cup, with a level measuring spoon in front.',
  },
  'ingredients/tomato-chutney': {
    ingredient: 'Tomato chutney',
    products: ['millet-idli-mix'],
    alt: 'Red tomato chutney tempered with mustard seeds and curry leaves in a brass bowl, beside two tomatoes and a curry leaf sprig. A serving suggestion, not the packaged chutney mix.',
  },

  // Protein Pancake Mixes
  'ingredients/foxtail-millet': {
    ingredient: 'Foxtail millet',
    products: ['vanilla-protein-pancake-mix', 'chocolate-protein-pancake-mix'],
    alt: 'Tiny round golden foxtail millet grains spilling from a ceramic bowl, with a bowl of pale foxtail millet flour behind.',
  },
  'ingredients/milk-powder': {
    ingredient: 'Milk powder',
    products: ['vanilla-protein-pancake-mix', 'chocolate-protein-pancake-mix'],
    alt: 'Fine white milk powder in a matte white bowl, with a ceramic spoon and a light dusting of powder.',
  },
  'ingredients/fos': {
    ingredient: 'Fructooligosaccharides (FOS)',
    products: ['vanilla-protein-pancake-mix', 'chocolate-protein-pancake-mix'],
    alt: 'Fine white fructooligosaccharide powder in a clear glass bowl, with a small glass scoop.',
  },
  'ingredients/soy-protein-isolate': {
    ingredient: 'Soy protein isolate',
    products: ['vanilla-protein-pancake-mix', 'chocolate-protein-pancake-mix'],
    alt: 'Pale cream soy protein isolate powder in a stoneware bowl, beside a few dry yellow soybeans.',
  },
  'ingredients/arrowroot-powder': {
    ingredient: 'Arrowroot powder',
    products: ['vanilla-protein-pancake-mix', 'chocolate-protein-pancake-mix'],
    alt: 'Bright white arrowroot powder in a glossy white bowl, beside a fresh arrowroot rhizome.',
  },
  'ingredients/monk-fruit': {
    ingredient: 'Monk fruit',
    products: ['vanilla-protein-pancake-mix', 'chocolate-protein-pancake-mix'],
    alt: 'Two dried brown monk fruits, one cracked open, beside a small dish of pale monk fruit extract powder.',
  },
  'ingredients/baking-powder': {
    ingredient: 'Baking powder',
    products: ['vanilla-protein-pancake-mix', 'chocolate-protein-pancake-mix'],
    alt: 'A brass measuring spoon heaped with white baking powder on a small marble slab.',
  },
  'ingredients/vanilla': {
    ingredient: 'Vanilla',
    products: ['vanilla-protein-pancake-mix'],
    alt: 'Dark vanilla pods, one split to show its tiny black seeds, with scraped vanilla seeds on a white ceramic spoon.',
  },
  'ingredients/xanthan-gum': {
    ingredient: 'Xanthan gum',
    products: ['vanilla-protein-pancake-mix', 'chocolate-protein-pancake-mix'],
    alt: 'Fine off-white xanthan gum powder in a charcoal stoneware bowl, with a wooden spoon holding a pinch.',
  },
  'ingredients/cocoa-powder': {
    ingredient: 'Cocoa powder',
    products: ['chocolate-protein-pancake-mix'],
    alt: 'Deep reddish-brown cocoa powder in a speckled cream bowl, with a brass spoon and a dusting of cocoa.',
  },
  'ingredients/chocolate-chips': {
    ingredient: 'Chocolate chips',
    products: ['chocolate-protein-pancake-mix'],
    alt: 'Glossy dark chocolate chips in a blush-pink ceramic dish, a few scattered on stone.',
  },
}
