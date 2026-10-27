import { withCalculatedColumn } from '../../lib/nutrition.js'
import { BLQ_NOTE, PANCAKE_QUICK_STEPS, PANCAKE_SERVING, PANCAKE_STEPS, RDA_FOOTNOTE, STORAGE } from './shared.js'
import ingredientStory from '../ingredients/vanilla-protein-pancake-mix.js'

/**
 * Source: "PROTEIN PANCAKE MIX - VANILLA .pdf" (front and back label artwork,
 * pouch photographs). Every value below is as printed on that label unless it
 * is marked as calculated.
 */
export default {
  slug: 'vanilla-protein-pancake-mix',
  name: 'Vanilla Protein Pancake Mix',
  packName: 'Protein Pancake Mix — Vanilla Flavoured',
  shortName: 'Vanilla',
  family: 'pancake',
  headline: 'Your vanilla pancake morning.',
  description:
    'Vanilla-flavoured protein pancake mix made with foxtail millet flour, with an 8 g honey stick included.',
  source: 'PROTEIN PANCAKE MIX - VANILLA .pdf',
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
      { value: '8g+', label: 'Dietary fibre', basis: 'per 75 g serving' },
    ],
    features: ['Honey stick included', 'Made with foxtail millet flour'],
    onPack: ['No maida', 'No preservatives'],
  },

  compare: {
    flavour: 'Vanilla (natural flavouring substances)',
    grain: 'Foxtail millet flour (39%)',
    method: 'Non-stick pan or waffle maker',
  },

  ingredientStory,

  ingredients: [
    {
      title: 'Pancake mix',
      text: 'Foxtail millet flour (39%), Milk solids (22%), Sugar (12%), Fructooligosaccharides (10%), Soy protein isolate (8%), Arrowroot powder (6%), Raising agents [INS 500(ii), INS 341(i)], Natural flavouring substances (Vanilla), Sweetener (Monk fruit extract), Stabilizer [(INS 415)]',
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
            { nutrient: 'Energy', per100: '405 kcal', rda: '15%' },
            { nutrient: 'Protein', per100: '18.9 g', rda: '–' },
            { nutrient: 'Carbohydrate', per100: '55.0 g', rda: '–' },
            { nutrient: 'Total sugars', per100: '13 g', rda: '–' },
            { nutrient: 'Added sugars', per100: '12 g', rda: '–' },
            { nutrient: 'Dietary fibre', per100: '10.8 g', rda: '–' },
            { nutrient: 'Total fat', per100: '6.0 g', rda: '7%' },
            { nutrient: 'Saturated fat', per100: '2.1 g', rda: '7%' },
            { nutrient: 'Trans fat', per100: '0.00 g', rda: '0%' },
            { nutrient: 'Sodium', per100: '190 mg', rda: '7%' },
            { nutrient: 'Calcium', per100: '285 mg', rda: '–' },
            { nutrient: 'Iron', per100: '5.8 mg', rda: '–' },
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
          { nutrient: 'Calcium', perUnit: '–' },
          { nutrient: 'Iron', perUnit: '–' },
        ],
        note: 'Honey stick values are shown separately and are not included in the pancake mix %RDA.',
      },
    ],
    notes: [RDA_FOOTNOTE, BLQ_NOTE],
  },

  preparation: { steps: PANCAKE_STEPS, quickSteps: PANCAKE_QUICK_STEPS, panel: 'prep-vanilla' },
  serving: { text: PANCAKE_SERVING, source: 'Serving suggestion printed on the pack' },
  storage: STORAGE,

  images: {
    pouch: 'pouch-vanilla',
    pouchBack: 'pouch-vanilla-back',
    labelFront: 'label-vanilla-front',
    labelBack: 'label-vanilla-back',
    prep: 'prep-vanilla',
    food: 'vanilla-hero',
    texture: 'vanilla-texture',
    accompaniment: 'honey-stick',
  },

  // Lavender-blue with yellow accents, taken from the pack.
  theme: {
    background: '#e4e1f4',
    deep: '#cfcaec',
    strong: '#8f89c9',
    ink: 'var(--cocoa-900)',
    accent: '#4b4499',
    highlight: '#f2b705',
  },

  // Points on the source label to confirm before launch. Not shown on the site.
  review: [
    'Added sugars %RDA is printed as "–"; 12 g per 100 g at 75 g is 9 g, which would be 18% of 50 g (the chocolate label prints 18%).',
    'Printed energy (405 kcal / 100 g) does not reconcile with the printed macronutrients (about 350 kcal, or about 372 kcal counting fibre at 2 kcal/g).',
    'Label front says "Fiber"; nutrition table says "Dietary Fibre".',
  ],
}
