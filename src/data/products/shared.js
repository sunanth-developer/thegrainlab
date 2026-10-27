/** Label text shared by more than one product. */

/** %RDA footnote printed on all three labels. */
export const RDA_FOOTNOTE =
  '*%RDA per serving is calculated on the basis of 2,000 kcal energy, 67 g total fat, 22 g saturated fat, 2 g trans fat, 50 g added sugar and 2,000 mg sodium requirement for an average adult per day.'

export const BLQ_NOTE = 'BLQ = Below Limit of Quantification.'

/** Storage instructions, identical on all three labels. */
export const STORAGE = [
  'Store in a cool, dry place away from moisture and direct sunlight.',
  'Once opened, keep the zipper tightly sealed to maintain freshness and prevent lump formation.',
]

/** Pancake preparation, identical on the vanilla and chocolate labels (steps 1–6). */
export const PANCAKE_STEPS = [
  { text: 'To 1 cup of pancake mix, add ¾ cup of water and whisk until smooth.' },
  { text: 'Let the batter rest for 10–15 minutes.', time: '10–15 min' },
  { text: 'Preheat a lightly greased non-stick pan or waffle maker.' },
  { text: 'Pour the batter onto the hot pan or waffle maker over medium heat.' },
  { text: 'Cook until bubbles appear on the surface.' },
  { text: 'Flip and cook until both sides are golden brown.' },
]

/** Condensed form of PANCAKE_STEPS for the homepage preview. */
export const PANCAKE_QUICK_STEPS = [
  { text: 'Whisk 1 cup of mix with ¾ cup of water' },
  { text: 'Rest the batter', time: '10–15 min' },
  { text: 'Cook on a greased pan or waffle maker; flip when bubbles appear' },
]

export const PANCAKE_SERVING =
  'Enjoy warm with the included honey stick, fresh fruits, maple syrup, nut butter, or your favourite toppings.'
