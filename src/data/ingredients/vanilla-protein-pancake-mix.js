/**
 * Vanilla Protein Pancake Mix — ingredient story.
 *
 * Sources:
 *   INFO  grainlab_website_product_information.docx, §2 "Protein Pancake Mix"
 *         (ingredient table: amount per 100 g and "why it is used").
 *   LABEL PROTEIN PANCAKE MIX - VANILLA .pdf, ingredient list.
 *
 * INFO describes a single "Protein Pancake Mix". Its ingredient amounts match
 * the VANILLA label (39/22/12/10/8/6) and it lists vanilla, so its quantities
 * are used for this product only. `onPack` repeats the label's declaration;
 * INFO's common names are mapped to it as follows:
 *   Milk powder ↔ Milk solids · FOS ↔ Fructooligosaccharides ·
 *   Monk fruit ↔ Sweetener (Monk fruit extract) ·
 *   Baking powder ↔ Raising agents [INS 500(ii), INS 341(i)] ·
 *   Vanilla ↔ Natural flavouring substances (Vanilla) ·
 *   Xanthan gum ↔ Stabilizer [(INS 415)] (INS 415 is xanthan gum).
 */
export default {
  product: 'Vanilla Protein Pancake Mix',
  quantityLabel: 'Per 100 g of mix',
  sourceNote: 'Quantities and roles from The Grain Lab product information.',

  items: [
    {
      id: 'foxtail-millet',
      name: 'Foxtail millet',
      quantity: { amount: 39, display: '39 g' },
      role: 'The main grain base for the pancake mix.',
      onPack: 'Foxtail millet flour (39%)',
      image: 'ingredients/foxtail-millet',
    },
    {
      id: 'milk-powder',
      name: 'Milk powder',
      quantity: { amount: 22, display: '22 g' },
      role: 'Adds dairy flavour, body and creaminess, and contributes protein.',
      onPack: 'Milk solids (22%)',
      image: 'ingredients/milk-powder',
    },
    {
      id: 'sugar',
      name: 'Sugar',
      quantity: { amount: 12, display: '12 g' },
      role: 'Provides sweetness and supports browning and flavour.',
      onPack: 'Sugar (12%)',
      image: 'ingredients/sugar',
    },
    {
      id: 'fos',
      name: 'FOS',
      fullName: 'Fructooligosaccharides',
      quantity: { amount: 10, display: '10 g' },
      role: 'Adds dietary fibre and contributes body to the mix.',
      onPack: 'Fructooligosaccharides (10%)',
      image: 'ingredients/fos',
    },
    {
      id: 'soy-protein-isolate',
      name: 'Soy protein isolate',
      quantity: { amount: 8, display: '8 g' },
      role: 'Raises the protein content of the mix.',
      onPack: 'Soy protein isolate (8%)',
      image: 'ingredients/soy-protein-isolate',
    },
    {
      id: 'arrowroot-powder',
      name: 'Arrowroot powder',
      quantity: { amount: 6, display: '6 g' },
      role: 'Supports batter structure and texture.',
      onPack: 'Arrowroot powder (6%)',
      image: 'ingredients/arrowroot-powder',
    },
    {
      id: 'monk-fruit',
      name: 'Monk fruit',
      quantity: { amount: 1, display: '1 g' },
      role: 'Adds sweetness alongside the sugar.',
      onPack: 'Sweetener (Monk fruit extract)',
      image: 'ingredients/monk-fruit',
    },
    {
      id: 'baking-powder',
      name: 'Baking powder',
      quantity: { amount: 1, display: '1 g' },
      role: 'Provides leavening and helps the pancakes rise.',
      onPack: 'Raising agents [INS 500(ii), INS 341(i)]',
      image: 'ingredients/baking-powder',
    },
    {
      id: 'vanilla',
      name: 'Vanilla',
      quantity: { amount: 1, display: '1 g' },
      role: 'Adds flavour and rounds out the taste profile.',
      onPack: 'Natural flavouring substances (Vanilla)',
      image: 'ingredients/vanilla',
    },
    {
      id: 'xanthan-gum',
      name: 'Xanthan gum',
      quantity: { amount: 0.1, display: '0.1 g' },
      role: 'Helps with batter consistency, binding and texture.',
      onPack: 'Stabilizer [(INS 415)]',
      image: 'ingredients/xanthan-gum',
    },
  ],

  composition: {
    title: 'What goes into 100 g',
    basis: 'Grams per 100 g of mix, from the product information',
    note: 'Circle areas follow the listed amounts; the smallest are drawn larger than scale so they stay visible.',
  },

  accompaniment: {
    name: 'Honey stick',
    amount: '8 g',
    role: 'Included as an optional topping, so you decide how much extra sweetness to add.',
    note: 'Packed separately and not part of the mix amounts above.',
    image: 'honey-stick',
  },

  review: [
    'The product information describes one "Protein Pancake Mix": its ingredient amounts match the vanilla label, but its nutrition table (406 kcal, 19.5 g protein, 166 mg sodium per 100 g) matches the chocolate label. Confirm which product the document describes.',
    'The product information uses common names (milk powder, monk fruit, baking powder, xanthan gum) where the label declares milk solids, sweetener (monk fruit extract), raising agents [INS 500(ii), INS 341(i)] and stabilizer [(INS 415)]. Both are shown.',
    'The listed amounts add up to 100.1 g per 100 g.',
  ],
}
