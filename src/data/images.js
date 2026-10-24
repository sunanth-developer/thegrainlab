/**
 * Central image manifest.
 *
 * Files live in /public/images as `${key}-${width}.webp`. Dimensions, available
 * widths and a dominant colour (used as the loading/fallback surface) come from
 * imageMeta.json, which `npm run images` regenerates from /assets-src/photos.
 * Only alt text and provenance are written by hand here.
 *
 * All current photography is original, AI-generated illustrative imagery made
 * for this site. It depicts food categories, not The Grain Lab packaging or
 * exact product formulations. Replace with official photography when
 * available and update `source` / `licence`.
 */
import meta from './imageMeta.json'

const GENERATED = {
  source: 'Original illustrative photography generated for The Grain Lab website',
  licence: 'Owned by the site; no third-party licence required',
}

const ALT = {
  hero: 'A bowl of golden millet porridge topped with fresh figs, honey and seeds, with a stack of pancakes behind it, dramatically lit against a deep plum backdrop.',
  interlude: 'Extreme close-up of golden and reddish millet grains caught in a beam of warm light, falling away into deep shadow.',
  closing: 'Golden millet grains pouring from an ivory ceramic scoop into a small terracotta bowl against a plum backdrop.',

  'cat-flours': 'Three ceramic bowls of pale, sand and reddish-brown millet flours with a brass scoop, on a pistachio-green backdrop in hard sunlight.',
  'cat-dosa': 'A paper-thin golden dosa rolled into a cone on an ivory plate, with coconut and tomato chutneys, on a terracotta backdrop.',
  'cat-pasta': 'A charcoal bowl of millet fusilli with blistered cherry tomatoes, basil and shaved cheese, beside a small pile of uncooked fusilli.',
  'cat-porridge': 'A terracotta bowl of creamy millet porridge topped with blackberries, pear, crushed pistachio and nut butter, on a deep plum backdrop.',
  'cat-pancakes': 'A tall stack of golden millet pancakes with syrup, raspberries and crushed pistachio on an ivory plate against a warm cocoa backdrop.',

  'format-flours': 'Overhead view of an ivory bowl of fine pale millet flour with a brass scoop.',
  'format-dosa': 'Overhead view of a terracotta bowl of smooth pale dosa batter with a wooden ladle.',
  'format-pasta': 'Overhead view of a charcoal dish of uncooked millet fusilli.',
  'format-porridge': 'Overhead view of a pistachio-green bowl of dry millet flakes and grains with a brass spoon.',
  'format-pancakes': 'Overhead view of a bowl of golden pancake batter with a brass whisk.',

  'gallery-table': 'Overhead view of two bowls of millet porridge, one with persimmon and pomegranate, one with blackberries and pistachio, beside figs and honey on plum linen.',
  'gallery-pour': 'Amber syrup pouring onto a stack of golden millet pancakes against a plum backdrop.',
  'gallery-stalks': 'A bundle of dried golden millet stalks and a small dish of whole millet on a deep plum surface in raking light.',
  'gallery-dosa': 'Extreme close-up of the lacy, crisp, golden surface of a freshly made dosa.',
}

export const images = Object.fromEntries(
  Object.entries(meta).map(([key, value]) => [key, { ...value, alt: ALT[key] ?? '', ...GENERATED }]),
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
