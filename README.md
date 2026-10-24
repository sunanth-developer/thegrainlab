# The Grain Lab — product website

React + Vite + React Router site for The Grain Lab's millet-based flours, mixes, pasta and
breakfast products. The site is product-only: categories, collection and food photography.

## Scripts

```bash
npm install
npm run dev       # local development
npm run build     # production build in dist/
npm run preview   # serve the production build
npm run lint
npm run images    # rebuild WebP files + src/data/imageMeta.json from assets-src/photos
```

Client-side routing: configure the host to serve `index.html` for unknown paths.

## Routes

| Path | Page |
| --- | --- |
| `/` | Home |
| `/products` | Collection with category filters (`?category=` is kept in the URL) |
| `/products/:slug` | Category (e.g. `/products/dosa-mixes`) or collection (`/products/breakfast`) |
| `/products/:slug/:productId` | Product detail, once real product records exist |
| anything else | 404 |

## Design system

- `src/styles/tokens.css`: colour (plum, ivory, cocoa, pistachio, terracotta), type scale,
  spacing, layout, radii, motion and z-index tokens. `.tone-dark` flips the semantic tokens for
  dark sections.
- `src/styles/base.css` and `utilities.css`: reset, typography, buttons and links.
- Typefaces: Instrument Serif (display) and Manrope (interface), both self-hosted via Fontsource
  (OFL).
- Motion: `src/lib/motion.js` holds the shared easing and durations. `src/components/motion/` has
  `LineReveal`, `MaskReveal`, `FadeUp` and `Parallax`. All of them respect `prefers-reduced-motion`,
  and parallax is disabled below 900px.
- Each section declares `data-tone="light|dark"`. The fixed header reads the tone under it and
  adapts its colour, hides while scrolling down, and returns on scroll up.

## Content lives in `src/data`

| File | Purpose |
| --- | --- |
| `categories.js` | Categories, the photographs used for each, their colour theme and crop focus. A category shows only when `published` and its image exists. |
| `products.js` | Verified product records. Empty for now, so the site shows category-level cards. |
| `gallery.js` | Editorial food photographs and the categories they link to. |
| `images.js` | Image manifest: alt text and provenance, merged with generated sizes and colours. |
| `navigation.js` | Header navigation. Items pointing at unpublished categories are hidden. |

### Adding a product

Add an object to `products` in `src/data/products.js`. Only `id`, `name` and `category` are
required. `image`, `description`, `ingredients`, `packSize`, `nutrition`, `price`,
`availability` and `purchaseUrl` are optional and hidden when missing. Once any product exists,
the collection switches to product cards that link to the product page. Search appears once
there are 8 or more products. Only add information printed on the pack or otherwise verified.

### Replacing images

1. Put the source file in `assets-src/photos/<key>.jpg` (at least 1280px on the long edge).
2. Run `npm run images`.
3. Add or update the alt text for `<key>` in `src/data/images.js`.

Each image shows its dominant colour while loading and a designed fallback if it fails to load.

## Image sources

All current photography is **original AI-generated illustrative imagery** created for this site,
so no third-party licence applies. It shows food categories, not The Grain Lab packaging or exact
product formulations, and the footer says so. Replace the `format-*` collection shots with
official pack shots when available.

## QA

`.qa/qa.mjs` (Playwright + local Chrome) audits every route at desktop, tablet and mobile sizes
for broken images, overflow, console errors, links, header behaviour, filtering, URL sync, the
mobile menu, image fallbacks, CLS/LCP and reduced motion. `.qa/shots.mjs` captures screenshots.
Run both against `npm run preview -- --port 5281`.
