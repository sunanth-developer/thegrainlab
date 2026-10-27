/**
 * Millet Idli Mix — ingredient story.
 *
 * Sources:
 *   INFO  grainlab_website_product_information.docx, §1 "Millet Idly Mix"
 *         (ingredient table: quantity/share and "why it is used"; accompaniment).
 *   LABEL IDLI MIX.pdf, "INGREDIENTS FOR IDLY MIX" / "INGREDIENTS FOR CHUTNEY MIX".
 *
 * Names, shares and roles follow INFO (the latest document). `onPack` repeats
 * the label's own declaration so the two can be compared. Nothing here is
 * estimated: ingredients INFO lists "as per formulation" have no quantity.
 */
export default {
  product: 'Millet Idli Mix',
  quantityLabel: 'Share of the mix',
  sourceNote: 'Quantities and roles from The Grain Lab product information.',

  items: [
    {
      id: 'foxtail-millet-rava',
      name: 'Foxtail millet rava',
      quantity: { amount: 45, display: '45%' },
      role: 'The main millet base, giving the mix its grain character and body.',
      onPack: 'Foxtail millet rava (45%)',
      image: 'ingredients/foxtail-millet-rava',
    },
    {
      id: 'black-gram-dal-flour',
      name: 'Black gram dal flour',
      quantity: { amount: 22, display: '22%' },
      role: 'Supports the familiar idli structure, softness and body, and also contributes protein.',
      onPack: 'Black gram dal flour (22%)',
      image: 'ingredients/black-gram-dal-flour',
    },
    {
      id: 'sorghum-millet-rava',
      name: 'Sorghum millet rava',
      quantity: { amount: 13, display: '13%' },
      role: 'Adds a second millet base, contributing texture and grain character.',
      onPack: 'Sorghum millet rava (13%)',
      image: 'ingredients/sorghum-millet-rava',
    },
    {
      // REVIEW: listed in INFO at 12% but absent from the label ingredient list.
      id: 'modified-rice-flour',
      name: 'Modified rice flour',
      quantity: { amount: 12, display: '12%' },
      role: 'Helps manage structure, texture and water absorption in the instant mix.',
      onPack: null,
      image: 'ingredients/modified-rice-flour',
    },
    {
      // REVIEW: INFO gives 5%; the label lists "Rice flour" without a percentage.
      id: 'rice-flour',
      name: 'Rice flour',
      quantity: { amount: 5, display: '5%' },
      role: 'Supports softness, structure and the familiar idli texture.',
      onPack: 'Rice flour',
      image: 'ingredients/rice-flour',
    },
    {
      id: 'salt',
      name: 'Salt',
      quantity: null,
      role: 'Balances flavour.',
      onPack: 'Salt',
      image: 'ingredients/salt',
    },
    {
      id: 'sugar',
      name: 'Sugar',
      quantity: null,
      role: 'Balances flavour in the mix.',
      onPack: 'Sugar',
      image: 'ingredients/sugar',
    },
    {
      id: 'sodium-bicarbonate',
      name: 'Raising agent: sodium bicarbonate',
      quantity: null,
      role: 'Provides leavening and helps create a lighter texture.',
      onPack: 'Raising agent [Sodium bicarbonate (INS 500(ii))]',
      image: 'ingredients/sodium-bicarbonate',
    },
  ],

  composition: {
    title: 'The five quantified ingredients',
    basis: 'Share of the mix, from the product information',
    note: 'Salt, sugar and the raising agent are also in the mix. The product information lists them "as per formulation" without a quantity, so they are not drawn here, and these five do not account for the whole mix.',
  },

  // REVIEW: INFO calls this "Tomato chutney"; the label calls it "Chutney mix"
  // (front: "Chutney Powder"), and the brand deck called it "peanut chutney".
  // INFO §5 records the switch from peanut to tomato after consumer feedback.
  // INFO says the final chutney ingredient list is "not available in the
  // working records", while the label artwork prints one (tomato first, no
  // peanuts). No chutney breakdown is drawn here; the label list is shown only
  // in the full "as printed on the pack" list.
  accompaniment: {
    name: 'Tomato chutney mix',
    amount: '15 g',
    role: 'Included to make the breakfast feel more complete, so there is no separate accompaniment to prepare.',
    note: 'Packed separately from the idli mix. Its nutrition is listed in its own table and is not part of the idli mix figures.',
    image: 'ingredients/tomato-chutney',
  },

  review: [
    'Modified rice flour (12%) is in the product information but not on the label ingredient list. Confirm whether it is in the current formulation and update the label or the document.',
    'Rice flour is 5% in the product information; the label gives no percentage.',
    'Accompaniment name: "Tomato chutney" (product information) vs "Chutney mix" / "Chutney Powder" (label) vs "peanut chutney" (brand deck). The site uses "Tomato chutney mix". Confirm the final name and ingredient list before launch.',
    'The product information says the final chutney ingredient list is not available; the label artwork prints one. Confirm which is current.',
  ],
}
