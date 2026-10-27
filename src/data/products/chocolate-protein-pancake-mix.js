import { withCalculatedColumn } from '../../lib/nutrition.js'
import { BLQ_NOTE, PANCAKE_QUICK_STEPS, PANCAKE_SERVING, PANCAKE_STEPS, RDA_FOOTNOTE, STORAGE } from './shared.js'
import ingredientStory from '../ingredients/chocolate-protein-pancake-mix.js'

/**
 * Source: "PROTEIN PANCAKE MIX - CHOCOLATE.pdf" (front and back label artwork,
 * pouch photographs). Every value below is as printed on that label unless it
 * is marked as calculated.
 */
export default {
  slug: 'chocolate-protein-pancake-mix',
  name: 'Chocolate Protein Pancake Mix',
  packName: 'Protein Pancake Mix — Chocolate Flavoured',
  shortName: 'Chocolate',
  family: 'pancake',
  headline: 'Chocolate belongs at breakfast.',
  description:
    'Chocolate-flavoured protein pancake mix made with foxtail millet flour, with an 8 g honey stick included.',
  source: 'PROTEIN PANCAKE MIX - CHOCOLATE.pdf',
  purchase: null,

  pack: {
    contents: [
      { item: 'Pancake mix', amount: '150 g' },
      { item: 'Honey stick', amount: '8 g' },
    ],
    netWeight: '158 g',
    servingSize: '75 g pancake mix',
    servingsPerPack: '2',
  },
  accompaniment: { name: 'Honey stick', amount: '8 g', label: 'Honey stick included' },

  highlights: {
    stats: [
      { value: '14g+', label: 'Protein', basis: 'per 75 g serving' },
      { value: '5g+', label: 'Dietary fibre', basis: 'per 75 g serving' },
    ],
    features: ['Honey stick included', 'Made with foxtail millet flour', 'Made with cocoa powder and chocolate chips'],
    onPack: ['No maida', 'No preservatives'],
  },

  compare: {
    flavour: 'Cocoa powder (6%) and chocolate chips',
    grain: 'Foxtail millet flour (34%)',
    method: 'Non-stick pan or waffle maker',
  },

  ingredientStory,

  ingredients: [
    {
      title: 'Pancake mix',
      text: 'Foxtail millet flour (34%), Milk solids (22%), Sugar (10%), Fructooligosaccharides (8%), Soy protein isolate (8%), Arrowroot powder (6%), Cocoa powder (6%), Chocolate chips (cocoa solids, sugar, cocoa butter, milk solids*), Raising agents [INS 500(ii), INS 341(i)], Sweetener (Monk fruit extract), Stabilizer [(INS 415)]',
    },
  ],
  allergens: {
    declared: true,
    statement: 'Contains soy and milk.',
    notes: ['Contains added natural flavours.'],
  },

  nutrition: {
    servingSize: '75 g',
    summary: ['Energy', 'Protein', 'Dietary fibre', 'Total sugars'],
    groups: [
      {
        id: 'mix',
        title: 'Pancake mix',
        columns: [
          { key: 'per100', label: 'Per 100 g (mix)' },
          { key: 'perServing', label: 'Per 75 g serving', calculated: true },
          { key: 'rda', label: '%RDA per 75 g serving*' },
        ],
        rows: withCalculatedColumn(
          [
            { nutrient: 'Energy', per100: '406 kcal', rda: '15%' },
            { nutrient: 'Protein', per100: '19.5 g', rda: '–' },
            { nutrient: 'Carbohydrate', per100: '59.5 g', rda: '–' },
            { nutrient: 'Total sugars', per100: '18 g', rda: '–' },
            { nutrient: 'Added sugars', per100: '12.0 g', rda: '18%' },
            { nutrient: 'Dietary fibre', per100: '7.0 g', rda: '–' },
            { nutrient: 'Total fat', per100: '10.0 g', rda: '11%' },
            { nutrient: 'Saturated fat', per100: '2 g', rda: '7%' },
            { nutrient: 'Trans fat', per100: '0.00 g', rda: '0' },
            { nutrient: 'Sodium', per100: '166 mg', rda: '6%' },
          ],
          { from: 'per100', to: 'perServing', factor: 0.75 },
        ),
      },
      {
        id: 'honey',
        title: 'Honey stick',
        columns: [{ key: 'perUnit', label: 'Per 8 g honey stick' }],
        rows: [
          { nutrient: 'Energy', perUnit: '25.94 kcal' },
          { nutrient: 'Protein', perUnit: 'BLQ' },
          { nutrient: 'Carbohydrate', perUnit: '6.48 g' },
          { nutrient: 'Total sugars', perUnit: '6.46 g' },
          { nutrient: 'Added sugars', perUnit: '0 g' },
          { nutrient: 'Dietary fibre', perUnit: 'BLQ' },
          { nutrient: 'Total fat', perUnit: 'BLQ' },
          { nutrient: 'Saturated fat', perUnit: 'BLQ' },
          { nutrient: 'Trans fat', perUnit: 'BLQ' },
          { nutrient: 'Sodium', perUnit: '0.30 mg' },
        ],
        note: 'Honey stick values are shown separately and are not included in the pancake mix %RDA.',
      },
    ],
    notes: [RDA_FOOTNOTE, BLQ_NOTE],
  },

  preparation: { steps: PANCAKE_STEPS, quickSteps: PANCAKE_QUICK_STEPS, panel: 'prep-chocolate' },
  serving: { text: PANCAKE_SERVING, source: 'Serving suggestion printed on the pack' },
  storage: STORAGE,

  images: {
    pouch: 'pouch-chocolate',
    pouchBack: 'pouch-chocolate-back',
    labelFront: 'label-chocolate-front',
    labelBack: 'label-chocolate-back',
    prep: 'prep-chocolate',
    food: 'chocolate-hero',
    texture: 'chocolate-texture',
    accompaniment: 'honey-stick',
  },

  // Pink with yellow accents, taken from the pack.
  theme: {
    background: '#f7dde7',
    deep: '#efc3d4',
    strong: '#d98aa6',
    ink: 'var(--cocoa-900)',
    accent: '#93294f',
    highlight: '#f2b705',
  },

  // Points on the source label to confirm before launch. Not shown on the site.
  review: [
    '"Contains added Natural Flavours" is printed, but no flavouring appears in the ingredient list.',
    'Ingredients print "milk solids*" inside the chocolate chips with no matching footnote on the label.',
    'Trans fat %RDA is printed as "0" (other rows use "%").',
    'Calcium and iron are listed on the vanilla label but not on this one.',
  ],
}
