# The Grain Lab — product website

React + Vite + React Router site for The Grain Lab's launch range: **Vanilla Protein Pancake
Mix**, **Chocolate Protein Pancake Mix** and **Millet Idli Mix**, plus two cereal concepts shown
separately as "On the horizon".

Every product fact comes from that product's own label PDF:

| Product | Source |
| --- | --- |
| Vanilla Protein Pancake Mix | `PROTEIN PANCAKE MIX - VANILLA .pdf` |
| Chocolate Protein Pancake Mix | `PROTEIN PANCAKE MIX - CHOCOLATE.pdf` |
| Millet Idli Mix | `IDLI MIX.pdf` |

Ingredient roles and quantities for the ingredient explorer come from
`grainlab_website_product_information.docx` (cross-checked against the labels; see
`src/data/ingredients/`). The brand deck (`TheGrainLab_IVI_VirtualPitch.pdf`) supplies brand
identity, the logo and the cereal concepts only. All source documents are git-ignored and must
never be published.

The site is a non-transactional catalogue: no prices, cart or checkout. Purchase UI appears only
when a product's `purchase` field holds real data.

## Scripts

```bash
npm install
npm run dev       # local development
npm run build     # production build in dist/ (BASE_PATH=/repo/ for GitHub Pages)
npm run preview   # serve the production build
npm run lint
npm run images    # rebuild WebP files + src/data/imageMeta.json from assets-src/
```

Client-side routing: the host must serve `index.html` for unknown paths. The Pages workflow
copies it to `404.html`.

## Routes

| Path | Page |
| --- | --- |
| `/` | Hero, product collection, what sets each product apart, how to prepare, product index (deep links into each label section), closing CTA |
| `/products` | Explore products: range filter (`?range=pancake|idli`) and the "On the horizon" concepts |
| `/pancake-mixes` | Both pancake mixes, a side-by-side label comparison and the shared method |
| `/products/:slug` | Product page: overview, then `#highlights`, `#ingredients`, `#nutrition`, `#preparation`, `#serving`, `#storage` |
| anything else | 404 |

## Product data: `src/data/products/`

One file per product, each transcribed from its own label. Values are stored **as printed**.

| File | Purpose |
| --- | --- |
| `vanilla-protein-pancake-mix.js`, `chocolate-protein-pancake-mix.js`, `millet-idli-mix.js` | Name, pack contents, net weight, serving size, highlights, ingredients, allergens, nutrition tables, preparation, serving, storage, images, theme and `review` flags |
| `shared.js` | Text identical on several labels: storage lines, the pancake method, the %RDA footnote |
| `index.js` | `launchProducts`, `families`, `futureConcepts` |

Rules:

- Add only facts printed on the product's label. Never fill a missing value: show "–".
- Nutrition is split into separate groups: pancake mix and honey stick; idli mix and chutney
  mix. Accompaniment values are never added to the mix figures (the idli's 7g+ protein is the
  idli mix alone).
- The pancake labels print per 100 g and %RDA only. The per 75 g column is calculated
  (`src/lib/nutrition.js`, × 0.75, half-up rounding), flagged `calculated` and shown with † and a
  note. The idli label prints its own per-serving columns, so nothing there is calculated.
- Each product's `review` array lists label inconsistencies to confirm with the business. These
  are not rendered on the site.

## Ingredient stories: `src/data/ingredients/`

| File | Purpose |
| --- | --- |
| `millet-idli-mix.js`, `vanilla-protein-pancake-mix.js`, `chocolate-protein-pancake-mix.js` | Per ingredient: name, quantity (only where a source gives one), "why it's here" role, the label's own declaration (`onPack`), image key. Plus composition notes, the accompaniment and `review` flags. Attached to each product as `ingredientStory`. |
| `manifest.js` | Every ingredient image: ingredient, products that use it, alt text, provenance. |

- Idli and vanilla quantities and roles follow the product information document. Chocolate
  quantities come only from the chocolate label; its roles reuse the document's wording for
  shared ingredients. Cocoa powder and chocolate chips have no documented role, so none is shown.
- Ingredients listed "as per formulation" have no quantity, and nothing is estimated.
- The cereal range has no ingredient data until final formulations exist.

`IngredientExplorer` (`src/components/IngredientExplorer/`) is reusable: pass `items`,
`quantityLabel`, `sourceNote` and `label`. It is an ARIA tablist (arrow keys, Home and End)
with a crossfading photograph, and all text works without motion. `IngredientComposition` draws
the quantified ingredients as photographs whose areas follow the amounts, with the accompaniment
set apart. Both sit in `IngredientStory`, the product page's single ingredients section, above
the full ingredient statement and allergens as printed on the pack.

## Components

- Product page sections (`src/components/product/`): `ProductHero`, `SectionNav` (sticky,
  follows the scroll), `ProductHighlights`, `IngredientList`, `NutritionPanel` +
  `NutritionTable`, `PreparationSteps`, `ServingSuggestion`, `StorageInfo`, `RelatedProducts`,
  all inside a shared `ProductSection` frame.
- Nutrition tables scroll horizontally inside their own focusable region on small screens; the
  nutrient column stays fixed.
- `Pack` renders the pouch cut-out (front or back); `ProductGallery` shows front and back of pack
  plus the flat label artwork, with a link to the full-size label.

## Design system

- `src/styles/tokens.css`: palette, type scale, spacing, motion and z-index. `.tone-dark`
  flips the semantic tokens for dark sections.
- Each product carries its own theme, taken from its pack:
  - Vanilla: lavender-blue with yellow.
  - Chocolate: pink with yellow.
  - Idli: yellow and orange with green.
- Typefaces: Instrument Serif (display) and Manrope (interface), self-hosted via Fontsource (OFL).
- Motion: `src/lib/motion.js` and `src/components/motion/`. Everything respects
  `prefers-reduced-motion`; ingredients and allergens are never hidden behind animation.
- Each section declares `data-tone`. The fixed header takes the tone of the section beneath
  it, hides on scroll down and returns on scroll up.

## Images

`npm run images` converts:

- `assets-src/photos/*.jpg`: photography, into WebP at 480, 800 and 1280px.
- `assets-src/brand/*.png`: label and brand artwork, into WebP with alpha at 240, 480, 960
  and 1440px.

### Provenance

- **Pouches (`pouch-*`, `pouch-*-back`):** the pouch mock-up photographs on pages 2–3 of each
  label PDF, cut out with one shared silhouette.
- **Label artwork (`label-*-front`, `label-*-back`):** page 1 of each label PDF at 300 dpi,
  split into front and back panels.
- **Preparation panels (`prep-*`):** cropped from the back label artwork.
- **Logo, field sketch:** the brand deck.
- **Photography:** AI-generated serving-suggestion images. They show food, never packaging,
  and are captioned as illustrative.
- **Ingredient photography (`ingredients/*`):** AI-generated still lifes, one per ingredient, in
  one shared art direction: warm limestone, natural side light, small ceramic vessels. They show
  what each ingredient looks like, not The Grain Lab's own raw materials. Sources are in
  `assets-src/ingredients/` and the output in `public/images/ingredients/` (240, 480 and 864px).
  Run `npm run images -- --only ingredients` to rebuild just these.

The extraction workspace (`.qa/labels/`, including `cutout.mjs`) is git-ignored because it
holds the PDFs.

## QA

Run against `npx vite --port 5280` (or a preview server, setting `BASE`).

- `.qa/qa.mjs` (Playwright + local Chrome) checks:
  - Every product fact against the label text exported from its PDF
    (`.qa/labels/{vanilla,chocolate,idli}/text.txt`): pack contents, net weight, serving size,
    claims, ingredients item by item, allergens, every printed nutrition value row by row,
    preparation quantities and times, storage. Calculated columns are recomputed independently.
  - Every route at desktop, tablet and mobile: broken images, overflow, tables wider than the
    screen, duplicate ids, console errors, forbidden commerce copy, "peanut", and links
    including section anchors.
  - Product pages render every table cell from the data, separate accompaniment tables, the
    section order and nav, the gallery and deep links.
  - Header behaviour, navigation, filters, mobile menu, table scrolling, image fallbacks,
    CLS/LCP and reduced motion.
- `.qa/hero-check.mjs`: hero geometry at ten viewport sizes.
- `.qa/scenes.mjs`: viewport screenshots at real scroll positions; `.qa/sheet.mjs` builds
  contact sheets.

## Open label questions

These are recorded in each product's `review` array and need confirmation before launch.

**Millet Idli Mix**

- Accompaniment: the brand deck says "peanut chutney". The product information document says
  "tomato chutney" (changed after consumer feedback) and that the final chutney ingredient list
  is not available. The label says "Chutney mix" / "Chutney Powder" and prints an ingredient
  list with no peanuts. The site says "Tomato chutney mix" and draws no chutney breakdown.
- Modified rice flour (12%) is in the product information but not on the label. Rice flour is 5%
  in the document; the label gives no percentage. The explorer shows the document's figures,
  with "Not listed on the current pack artwork" for modified rice flour.
- Sodium: the document gives 765 mg per 100 g; the label gives 130 mg. The site shows the label.
- Preparation: the document says roughly 1:1 water and a 10–15 minute rest; the label says ¾ cup
  water per cup and 10 minutes. The site follows the label.
- The deck says 150 g + 30 g (180 g); the label says 150 g mix + 15 g chutney mix (165 g). The
  site follows the label.
- The label has no allergen declaration, although the ingredients include black gram (urad dal)
  and refined sesame oil. The site says the label has none and asks readers to check the pack.
- The front says "Chutney Powder", the back "Chutney mix". The ingredient icons say "foxtail
  millet flour"; the list says "foxtail millet rava". The label mixes "idli" and "idly".
- One 15 g chutney mix sachet for a pack that makes two 75 g servings.

**Vanilla Protein Pancake Mix**

- Added sugars %RDA is printed as "–" (the chocolate label prints 18%).
- 405 kcal per 100 g does not reconcile with the printed macronutrients (about 350 kcal).

**Chocolate Protein Pancake Mix**

- "Contains added Natural Flavours", but no flavouring appears in the ingredients.
- "milk solids*" has no matching footnote.
- Trans fat %RDA is printed as "0" without "%".
- No calcium or iron rows, unlike the vanilla label.

**Both pancake labels:** "Fiber" on the front, "Fibre" in the table.

**Product information document, pancake section:** it describes one "Protein Pancake Mix".
Its ingredient amounts match the vanilla label (and include vanilla), but its nutrition table
matches the chocolate label. The amounts add up to 100.1 g per 100 g. Its common names (milk
powder, monk fruit, baking powder, xanthan gum) differ from the label declarations; the explorer
shows both.
