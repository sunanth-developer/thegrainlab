import { RDA_FOOTNOTE, STORAGE } from './shared.js'
import ingredientStory from '../ingredients/millet-idli-mix.js'

/**
 * Source: "IDLI MIX.pdf" (front and back label artwork, pouch photographs).
 * Every value below is as printed on that label; this label prints the
 * per-serving columns itself, so nothing here is calculated.
 */
export default {
  slug: 'millet-idli-mix',
  name: 'Millet Idli Mix',
  packName: 'Idli Mix — Ready to Cook',
  shortName: 'Idli',
  family: 'idli',
  headline: 'Idli mornings, made simpler.',
  description: 'A ready-to-cook millet idli mix, with a separate tomato chutney mix in the pack.',
  source: 'IDLI MIX.pdf',
  purchase: null,

  pack: {
    contents: [
      { item: 'Idli mix', amount: '150 g' },
      { item: 'Tomato chutney mix', amount: '15 g' },
    ],
    netWeight: '165 g',
    servingSize: '75 g idli mix',
    servingsPerPack: '2',
    extra: { label: 'Tomato chutney mix, used for preparation', value: '15 g' },
  },
  accompaniment: { name: 'Tomato chutney mix', amount: '15 g', label: 'Tomato chutney mix included' },

  highlights: {
    stats: [
      { value: '7g+', label: 'Protein', basis: 'per 75 g idli-mix serving' },
      { value: '4.5 g', label: 'Dietary fibre', basis: 'per 75 g idli-mix serving' },
    ],
    features: ['Tomato chutney mix included', 'Made with foxtail millet rava and sorghum millet rava'],
    onPack: ['No preservatives', 'No artificial colours or flavours'],
  },

  compare: {
    flavour: 'Savoury, served with the tomato chutney mix',
    grain: 'Foxtail millet rava (45%) and sorghum millet rava (13%)',
    method: 'Steamed in greased idli moulds',
  },

  ingredientStory,

  ingredients: [
    {
      title: 'Idli mix',
      text: 'Foxtail millet rava (45%), Black gram dal flour (22%), Sorghum millet rava (13%), Rice flour, Salt, Sugar, Raising agent [Sodium bicarbonate (INS 500(ii))]',
    },
    {
      title: 'Tomato chutney mix',
      text: 'Tomato, Small Onion, Garlic, Refined Sesame Oil, Coriander Leaves, Mixed Masala Powder, Green Chilli, Rock Salt, Urad Dal, Curry Leaves, Dry Red Chilli, Dry Kashmiri Red Chilli, Mustard Seeds, Cumin Powder, Asafoetida',
    },
  ],
  // BUSINESS TO VERIFY: the supplied label artwork carries no allergen
  // declaration. Confirm the declaration (the ingredients include black gram /
  // urad dal and refined sesame oil) before publishing one here.
  allergens: { declared: false, statement: null, notes: [] },

  nutrition: {
    servingSize: '75 g',
    summary: ['Energy', 'Protein', 'Dietary fibre', 'Total sugars'],
    groups: [
      {
        id: 'mix',
        title: 'Idli mix',
        columns: [
          { key: 'per100', label: 'Per 100 g' },
          { key: 'perServing', label: 'Per 75 g serving' },
          { key: 'rda', label: '%RDA per serving*' },
        ],
        rows: [
          { nutrient: 'Energy', per100: '342 kcal', perServing: '257 kcal', rda: '13%' },
          { nutrient: 'Protein', per100: '9.6 g', perServing: '7.2 g', rda: '–' },
          { nutrient: 'Carbohydrates', per100: '68.4 g', perServing: '51.3 g', rda: '–' },
          { nutrient: 'Total sugars', per100: '1.9 g', perServing: '1.4 g', rda: '–' },
          { nutrient: 'Added sugars', per100: '<1.0 g', perServing: '<0.75 g', rda: '<1.5%' },
          { nutrient: 'Dietary fibre', per100: '6.0 g', perServing: '4.5 g', rda: '–' },
          { nutrient: 'Total fat', per100: '1.9 g', perServing: '1.4 g', rda: '2%' },
          { nutrient: 'Saturated fat', per100: '0.4 g', perServing: '0.3 g', rda: '1%' },
          { nutrient: 'Trans fat', per100: '0.00 g', perServing: '0.00 g', rda: '0%' },
          { nutrient: 'Sodium', per100: '130 mg', perServing: '97.5 mg', rda: '5%' },
          { nutrient: 'Calcium', per100: '45 mg', perServing: '33.8 mg', rda: '–' },
          { nutrient: 'Iron', per100: '4.8 mg', perServing: '3.6 mg', rda: '–' },
        ],
        note: 'Approximate values, as printed on the label.',
      },
      {
        id: 'chutney',
        title: 'Tomato chutney mix',
        columns: [
          { key: 'per100', label: 'Per 100 g' },
          { key: 'perServing', label: 'Per 15 g serving' },
          { key: 'rda', label: '%RDA per serving*' },
        ],
        rows: [
          { nutrient: 'Energy', per100: '391 kcal', perServing: '58.7 kcal', rda: '3%' },
          { nutrient: 'Protein', per100: '14.16 g', perServing: '2.12 g', rda: '–' },
          { nutrient: 'Carbohydrate', per100: '58.42 g', perServing: '8.76 g', rda: '–' },
          { nutrient: 'Total sugars', per100: '36.68 g', perServing: '5.50 g', rda: '–' },
          { nutrient: 'Added sugars', per100: '14.9 g', perServing: '2.24 g', rda: '4%' },
          { nutrient: 'Dietary fibre', per100: '36.25 g', perServing: '5.44 g', rda: '–' },
          { nutrient: 'Total fat', per100: '11.24 g', perServing: '1.69 g', rda: '3%' },
          { nutrient: 'Saturated fat', per100: '1.99 g', perServing: '0.30 g', rda: '1%' },
          { nutrient: 'Trans fat', per100: '0.00 g', perServing: '0.00 g', rda: '0%' },
          { nutrient: 'Sodium', per100: '2,132 mg', perServing: '320 mg', rda: '16%' },
          { nutrient: 'Calcium', per100: '214.6 mg', perServing: '32.2 mg', rda: '–' },
          { nutrient: 'Iron', per100: '3.582 mg', perServing: '0.54 mg', rda: '–' },
        ],
        note: 'Serving size used for preparation: 15 g tomato chutney mix. These values are separate from the idli mix and are not part of its protein figure.',
      },
    ],
    notes: [RDA_FOOTNOTE],
  },

  preparation: {
    steps: [
      { text: 'Whisk 1 cup of instant idli mix with ¾ cup of water and let the batter rest for 10 minutes.', time: '10 min' },
      { text: 'Pour the batter into greased idli moulds and steam for 12–15 minutes.', time: '12–15 min' },
      { text: 'Mix 15 g chutney powder with 45 ml water and serve with hot idlis.' },
    ],
    quickSteps: [
      { text: 'Whisk 1 cup of mix with ¾ cup of water and rest', time: '10 min' },
      { text: 'Steam in greased idli moulds', time: '12–15 min' },
      { text: 'Mix 15 g chutney powder with 45 ml water' },
    ],
    panel: 'prep-idli',
  },
  serving: {
    text: 'Serve the prepared tomato chutney with hot idlis.',
    source: 'From the preparation instructions on the pack; the label has no separate serving suggestion',
  },
  storage: STORAGE,

  images: {
    pouch: 'pouch-idli',
    pouchBack: 'pouch-idli-back',
    labelFront: 'label-idli-front',
    labelBack: 'label-idli-back',
    prep: 'prep-idli',
    food: 'idli-hero',
    texture: 'idli-texture',
    accompaniment: 'chutney',
  },

  // Yellow and orange with green accents, taken from the pack.
  theme: {
    background: '#f8d566',
    deep: '#f3bf37',
    strong: '#e8892a',
    ink: 'var(--cocoa-900)',
    accent: '#17683c',
    highlight: '#e8892a',
  },

  // Points on the source label to confirm before launch. Not shown on the site.
  review: [
    'Chutney: the brand deck described "peanut chutney"; the product information document says tomato chutney (switched after consumer feedback), and the label ingredient list contains no peanuts. The site says "tomato chutney mix". Confirm the final name and formulation (see ingredientStory.review).',
    'Pack contents: the label says 150 g mix + 15 g chutney mix (165 g); the brand deck says 150 g + 30 g (180 g). The site follows the label.',
    'No allergen declaration on the label (ingredients include black gram / urad dal and refined sesame oil).',
    'Front says "Includes Chutney Powder", back says "Chutney mix"; ingredient icons say "Foxtail millet flour" while the list says "Foxtail millet rava".',
    'The label alternates "idli" and "idly"; the site uses "idli".',
    'The pack contains one 15 g chutney mix while the idli mix makes 2 servings of 75 g.',
    'Sodium: the product information document gives 765 mg per 100 g; the label prints 130 mg. The site shows the label value.',
    'Preparation: the product information document says water at roughly 1:1 and a 10–15 minute rest; the label says ¾ cup water to 1 cup of mix and a 10 minute rest. The site follows the label.',
  ],
}
