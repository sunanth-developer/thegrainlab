/**
 * Central image manifest.
 *
 * Files live in /public/images as `${key}-${width}.webp`. Dimensions, available
 * widths and a dominant colour (used as the loading/fallback surface) come from
 * imageMeta.json, which `npm run images` regenerates from /assets-src.
 * Only alt text and provenance are written by hand here.
 *
 * - pouch-*, label-*, prep-*: extracted from the product label PDFs. Pouches are
 *   the PDFs' product photographs cut out of their studio background; labels
 *   and prep panels are rendered from the vector label artwork.
 *   (`.qa/labels/cutout.mjs` regenerates them.)
 * - logo*, fields: extracted from the brand deck.
 * - ingredients/*: AI-generated ingredient still lifes; alt text and product
 *   associations live in ./ingredients/manifest.js.
 * - Everything else is original AI-generated serving-suggestion photography.
 *   It shows food, never packaging.
 */
import meta from './imageMeta.json'
import { INGREDIENT_IMAGE_SOURCE, ingredientImages } from './ingredients/manifest.js'

const LABELS = {
  source: 'The Grain Lab product label PDFs (IDLI MIX, PROTEIN PANCAKE MIX – VANILLA / CHOCOLATE)',
  licence: 'The Grain Lab brand asset',
}

const DECK = {
  source: 'The Grain Lab brand deck (TheGrainLab_IVI_VirtualPitch.pdf)',
  licence: 'The Grain Lab brand asset',
}

const GENERATED = {
  source: 'Original illustrative photography generated for The Grain Lab website',
  licence: 'Owned by the site; no third-party licence required',
}

const ALT = {
  logo: 'The Grain Lab — From forgotten to future',
  'logo-light': 'The Grain Lab — From forgotten to future',
  'logo-mark': 'The Grain Lab',
  'logo-mark-light': 'The Grain Lab',

  'pouch-vanilla': 'Vanilla Protein Pancake Mix pouch: lavender-blue pack with yellow accents, 158 g.',
  'pouch-vanilla-back': 'Back of the Vanilla Protein Pancake Mix pouch with ingredients, nutrition table and preparation steps.',
  'pouch-chocolate': 'Chocolate Protein Pancake Mix pouch: pink pack with yellow accents, 158 g.',
  'pouch-chocolate-back': 'Back of the Chocolate Protein Pancake Mix pouch with ingredients, nutrition table and preparation steps.',
  'pouch-idli': 'Idli Mix pouch: yellow and orange pack with green accents, 165 g.',
  'pouch-idli-back': 'Back of the Idli Mix pouch with preparation steps, ingredients and nutrition tables.',
  'label-vanilla-front': 'Front label artwork of the Vanilla Protein Pancake Mix.',
  'label-vanilla-back': 'Back label artwork of the Vanilla Protein Pancake Mix: ingredients, allergens, nutrition information, preparation and storage.',
  'label-chocolate-front': 'Front label artwork of the Chocolate Protein Pancake Mix.',
  'label-chocolate-back': 'Back label artwork of the Chocolate Protein Pancake Mix: ingredients, allergens, nutrition information, preparation and storage.',
  'label-idli-front': 'Front label artwork of the Idli Mix.',
  'label-idli-back': 'Back label artwork of the Idli Mix: preparation, ingredients for the idli and chutney mixes, nutrition information and storage.',
  'prep-vanilla': 'Preparation panel from the vanilla pancake pack: six illustrated steps.',
  'prep-chocolate': 'Preparation panel from the chocolate pancake pack: six illustrated steps.',
  'prep-idli': 'Preparation panel from the idli pack: three illustrated steps.',

  hero: 'A breakfast table in morning sun: golden pancakes glazed with honey and a honey dipper, soft idlis with a bowl of chutney, and a cup of coffee.',
  'vanilla-hero': 'Honey pouring onto a tall stack of fluffy golden vanilla pancakes, with a vanilla pod and a jar of honey on a cream backdrop.',
  'vanilla-texture': 'Close-up of a fork cutting into a vanilla pancake, showing a soft, airy crumb flecked with vanilla and glazed with honey.',
  'chocolate-hero': 'A stack of chocolate pancakes with a honey drizzle, halved strawberries and shaved chocolate on a rose plate.',
  'chocolate-texture': 'Close-up of layered chocolate pancakes dusted with cocoa, honey between the layers and a halved strawberry behind.',
  'honey-stick': 'Golden honey sticks resting on parchment beside the edge of a pancake.',
  'idli-hero': 'Four millet idlis on a banana leaf beside a brass bowl of red tomato-onion chutney with curry leaves and a dried chilli.',
  'idli-texture': 'A steaming millet idli broken open to show its soft, porous centre, on a banana leaf.',
  chutney: 'A bowl of red tomato-onion chutney tempered with mustard seeds, curry leaves and a dried red chilli, beside shallots and coriander.',
  'concept-coffee': 'Coffee beans with toasted grain flakes and puffed millet on parchment — a mood study, not a product.',
  'concept-berry': 'Raspberries, blueberries and dried berries with toasted grain flakes on rose paper — a mood study, not a product.',
  final: 'Honey-glazed pancakes in late-morning light on a dark table, with idlis, chutney and coffee behind.',
}

for (const [key, entry] of Object.entries(ingredientImages)) ALT[key] = entry.alt

const provenance = (key) => {
  if (key.startsWith('ingredients/')) return INGREDIENT_IMAGE_SOURCE
  if (/^(pouch|label|prep)-/.test(key)) return LABELS
  if (/^logo/.test(key) || key === 'fields') return DECK
  return GENERATED
}

export const images = Object.fromEntries(
  Object.entries(meta).map(([key, value]) => [key, { ...value, alt: ALT[key] ?? '', ...provenance(key) }]),
)

export function getImage(key) {
  return key ? images[key] ?? null : null
}

export function imageSrc(key, width) {
  const image = getImage(key)
  if (!image) return undefined
  const w = width ?? image.widths[image.widths.length - 1]
  return `${import.meta.env.BASE_URL}images/${key}-${w}.webp`
}

export function imageSrcSet(key) {
  const image = getImage(key)
  return image ? image.widths.map((w) => `${imageSrc(key, w)} ${w}w`).join(', ') : undefined
}
