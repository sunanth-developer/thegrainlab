/**
 * Chocolate Protein Pancake Mix — ingredient story.
 *
 * Sources:
 *   LABEL PROTEIN PANCAKE MIX - CHOCOLATE.pdf, ingredient list (quantities).
 *   INFO  grainlab_website_product_information.docx, §2 (roles only).
 *
 * The product information's ingredient table matches the VANILLA formulation,
 * so none of its amounts are used here. Quantities come from the chocolate
 * label only; where the label prints none, none is shown. Roles for shared
 * ingredients reuse the product information's "why it is used" text; cocoa
 * powder and chocolate chips are not covered by it, so they have no role.
 */
export default {
  product: 'Chocolate Protein Pancake Mix',
  quantityLabel: 'Share of the mix',
  sourceNote: 'Quantities from the chocolate pack label; roles from The Grain Lab product information.',

  items: [
    {
      id: 'foxtail-millet',
      name: 'Foxtail millet',
      quantity: { amount: 34, display: '34%' },
      role: 'The main grain base for the pancake mix.',
      onPack: 'Foxtail millet flour (34%)',
      image: 'ingredients/foxtail-millet',
    },
    {
      id: 'milk-powder',
      name: 'Milk powder',
      quantity: { amount: 22, display: '22%' },
      role: 'Adds dairy flavour, body and creaminess, and contributes protein.',
      onPack: 'Milk solids (22%)',
      image: 'ingredients/milk-powder',
    },
    {
      id: 'sugar',
      name: 'Sugar',
      quantity: { amount: 10, display: '10%' },
      role: 'Provides sweetness and supports browning and flavour.',
      onPack: 'Sugar (10%)',
      image: 'ingredients/sugar',
    },
    {
      id: 'fos',
      name: 'FOS',
      fullName: 'Fructooligosaccharides',
      quantity: { amount: 8, display: '8%' },
      role: 'Adds dietary fibre and contributes body to the mix.',
      onPack: 'Fructooligosaccharides (8%)',
      image: 'ingredients/fos',
    },
    {
      id: 'soy-protein-isolate',
      name: 'Soy protein isolate',
      quantity: { amount: 8, display: '8%' },
      role: 'Raises the protein content of the mix.',
      onPack: 'Soy protein isolate (8%)',
      image: 'ingredients/soy-protein-isolate',
    },
    {
      id: 'arrowroot-powder',
      name: 'Arrowroot powder',
      quantity: { amount: 6, display: '6%' },
      role: 'Supports batter structure and texture.',
      onPack: 'Arrowroot powder (6%)',
      image: 'ingredients/arrowroot-powder',
    },
    {
      id: 'cocoa-powder',
      name: 'Cocoa powder',
      quantity: { amount: 6, display: '6%' },
      role: null,
      onPack: 'Cocoa powder (6%)',
      image: 'ingredients/cocoa-powder',
    },
    {
      id: 'chocolate-chips',
      name: 'Chocolate chips',
      quantity: null,
      role: null,
      onPack: 'Chocolate chips (cocoa solids, sugar, cocoa butter, milk solids*)',
      image: 'ingredients/chocolate-chips',
    },
    {
      id: 'baking-powder',
      name: 'Baking powder',
      quantity: null,
      role: 'Provides leavening and helps the pancakes rise.',
      onPack: 'Raising agents [INS 500(ii), INS 341(i)]',
      image: 'ingredients/baking-powder',
    },
    {
      id: 'monk-fruit',
      name: 'Monk fruit',
      quantity: null,
      role: 'Adds sweetness alongside the sugar.',
      onPack: 'Sweetener (Monk fruit extract)',
      image: 'ingredients/monk-fruit',
    },
    {
      id: 'xanthan-gum',
      name: 'Xanthan gum',
      quantity: null,
      role: 'Helps with batter consistency, binding and texture.',
      onPack: 'Stabilizer [(INS 415)]',
      image: 'ingredients/xanthan-gum',
    },
  ],

  composition: {
    title: 'The quantified ingredients',
    basis: 'Share of the mix, as printed on the chocolate pack',
    note: 'Chocolate chips, raising agents, monk fruit extract and the stabiliser are also in the mix but carry no percentage on the pack, so they are not drawn here. This recipe has no vanilla.',
  },

  accompaniment: {
    name: 'Honey stick',
    amount: '8 g',
    role: 'Included as an optional topping, so you decide how much extra sweetness to add.',
    note: 'Packed separately and not part of the mix amounts above.',
    image: 'honey-stick',
  },

  review: [
    'No source gives quantities for chocolate chips, raising agents, monk fruit extract or stabilizer in the chocolate mix.',
    'The product information does not describe the role of cocoa powder or chocolate chips.',
  ],
}
