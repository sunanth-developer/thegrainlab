import { chromium } from 'playwright-core'
import { access, readFile } from 'node:fs/promises'
import { launchProducts, futureConcepts } from '../src/data/products/index.js'
import { PRODUCT_SECTIONS } from '../src/components/product/sections.js'
import { ingredientImages } from '../src/data/ingredients/manifest.js'

const imageMeta = JSON.parse(await readFile(new URL('../src/data/imageMeta.json', import.meta.url), 'utf8'))

const BASE = process.env.BASE ?? 'http://localhost:5280'

const ROUTES = [
  '/',
  '/products',
  '/pancake-mixes',
  ...launchProducts.map((p) => `/products/${p.slug}`),
  '/products/not-a-product',
  '/nope',
]

// Label text exported from each product's PDF (gitignored, see .qa/labels).
const LABEL_TEXT = {
  'vanilla-protein-pancake-mix': 'vanilla',
  'chocolate-protein-pancake-mix': 'chocolate',
  'millet-idli-mix': 'idli',
}

// Text that must never appear while the site is a non-transactional catalogue,
// plus "peanut": the idli label's chutney mix contains none.
const FORBIDDEN = [/₹/, /\bMRP\b/i, /add to (cart|bag)/i, /\bbuy now\b/i, /\bcheckout\b/i, /\bin stock\b/i, /\breviews?\b/i, /\brating/i, /\baward/i, /\bdiscount/i, /\bfounder/i, /\bCOGS\b/, /peanut/i]

// Repeated marketing lines the content brief asked to remove.
const CLICHES = [/designed for busy mornings/i, /nutrition meets convenience/i, /a better breakfast/i, /made for modern lifestyles/i, /breakfast made easy/i]

const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
})

const problems = []
const fail = (msg) => {
  problems.push(msg)
  console.log('  FAIL', msg)
}
const ok = (msg) => console.log('  ok  ', msg)
const check = (cond, msg) => (cond ? ok(msg) : fail(msg))
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

async function scrollThrough(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo({ top: y, behavior: 'instant' })
      await new Promise((r) => setTimeout(r, 70))
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
    const deadline = Date.now() + 8000
    while (Date.now() < deadline && [...document.images].some((i) => !i.complete)) {
      await new Promise((r) => setTimeout(r, 100))
    }
  })
  await wait(900)
}

// ---------------------------------------------------------------------------
// Product data vs the label text
// ---------------------------------------------------------------------------
const norm = (s) =>
  s
    .replace(/ﬂ/g, 'fl')
    .replace(/ﬁ/g, 'fi')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()

/** Splits an ingredient list on commas that are not inside brackets. */
function splitTopLevel(text) {
  const out = []
  let depth = 0
  let current = ''
  for (const ch of text) {
    if ('([{'.includes(ch)) depth++
    if (')]}'.includes(ch)) depth--
    if (ch === ',' && depth === 0) {
      out.push(current.trim())
      current = ''
    } else current += ch
  }
  if (current.trim()) out.push(current.trim())
  return out
}

/** Ways a value can be printed: "2 g" may appear as "2g", "<1.0 g" as "<1.0", "0%" as "0". */
const variants = (v) => {
  const n = norm(v)
  return [...new Set([n, n.replace(/\s+/g, ''), n.replace(/\s*(kcal|mg|g)$/, ''), n.replace(/%$/, '')])]
}

const number = (v) => Number.parseFloat(String(v).replace(/[<,]/g, ''))

async function labelFacts() {
  console.log('\n== Product data vs label PDFs ==')
  const dataText = JSON.stringify(launchProducts)
  check(!/peanut/i.test(dataText.replace(/"review":\[[^\]]*\]/g, '')), 'no "peanut" in displayed product data')

  for (const p of launchProducts) {
    console.log(`  -- ${p.name}`)
    let raw
    try {
      raw = await readFile(new URL(`./labels/${LABEL_TEXT[p.slug]}/text.txt`, import.meta.url), 'utf8')
    } catch {
      fail(`label text missing for ${p.slug}`)
      continue
    }
    const label = norm(raw)
    const has = (s) => label.includes(norm(s))

    check(p.purchase === null, 'no purchase data')

    // Pack: net weight, contents, serving size, servings per pack
    const net = p.pack.netWeight.match(/\d+/)[0]
    const netAt = label.indexOf(`net wt. ${net}`)
    const netWindow = label.slice(netAt, netAt + 60)
    check(netAt >= 0, `net weight ${p.pack.netWeight}`)
    for (const c of p.pack.contents) {
      const amount = c.amount.match(/\d+/)[0]
      check(new RegExp(`\\b${amount}\\b`).test(netWindow), `pack contents ${c.item} ${c.amount} (front: "${netWindow.slice(13, 50)}")`)
    }
    const serving = p.nutrition.servingSize.match(/\d+/)[0]
    check(new RegExp(`serving size:? ${serving} ?g`).test(label), `serving size ${p.nutrition.servingSize}`)
    check(new RegExp(`servings per pack:? ${p.pack.servingsPerPack}\\b`).test(label), `servings per pack ${p.pack.servingsPerPack}`)

    // Front-of-pack claims and badges
    for (const s of p.highlights.stats) {
      const printedInTable = p.nutrition.groups[0].rows.some((r) => r.nutrient === s.label && r.perServing === s.value)
      const calculated = p.nutrition.groups[0].columns.find((c) => c.key === 'perServing')?.calculated
      check((has(s.value) || (printedInTable && !calculated)), `stat ${s.value} ${s.label}`)
    }
    for (const b of p.highlights.onPack) check(has(b), `badge "${b}"`)

    // Ingredients, item by item
    for (const group of p.ingredients) {
      const items = splitTopLevel(group.text)
      const missing = items.filter((i) => !has(i))
      check(missing.length === 0, `${group.title} ingredients (${items.length} items)${missing.length ? ` missing ${missing.join(' | ')}` : ''}`)
    }

    // Allergens: as printed, and never invented
    if (p.allergens.declared) {
      check(has(p.allergens.statement.replace(/\.$/, '')), `allergen statement "${p.allergens.statement}"`)
      for (const n of p.allergens.notes) check(has(n.replace(/\.$/, '')), `allergen note "${n}"`)
    } else {
      check(!label.includes('allergen'), 'no allergen statement on the label, none shown')
    }

    // Nutrition: every printed value, row by row
    for (const group of p.nutrition.groups) {
      let cursor = group.id === 'chutney' ? label.indexOf('serving size used for preparation') : label.indexOf('energy')
      const printed = group.columns.filter((c) => !c.calculated)
      const misses = []
      group.rows.forEach((row, i) => {
        const at = label.indexOf(row.nutrient.toLowerCase(), cursor)
        if (at < 0) return misses.push(`${row.nutrient} row not found`)
        const next = group.rows[i + 1] ? label.indexOf(group.rows[i + 1].nutrient.toLowerCase(), at + row.nutrient.length) : -1
        const window = label.slice(at, next > at ? next : at + 60)
        for (const c of printed) {
          const v = row[c.key]
          if (v === '–') {
            // A dash may be printed, or the label may not have the row at all.
            continue
          }
          if (!variants(v).some((x) => window.includes(x))) misses.push(`${row.nutrient} ${c.key} "${v}" not in "${window}"`)
        }
        cursor = at + row.nutrient.length
      })
      check(misses.length === 0, `${group.title} table: ${group.rows.length} rows × ${printed.length} printed columns${misses.length ? ` — ${misses.join('; ')}` : ''}`)

      // Calculated columns: independently recomputed from the printed per-100 g values
      for (const c of group.columns.filter((col) => col.calculated)) {
        const bad = group.rows.filter((r) => {
          if (r.per100 === '–') return r[c.key] !== '–'
          const expected = number(r.per100) * 0.75
          const tolerance = /kcal/.test(r.per100) ? 0.5 : 10 ** -((r[c.key].split(' ')[0].split('.')[1] ?? '').length) / 2 + 1e-9
          return Math.abs(number(r[c.key]) - expected) > tolerance
        })
        check(bad.length === 0, `${group.title} "${c.label}" = per 100 g × 0.75${bad.length ? ` — wrong: ${bad.map((r) => r.nutrient).join(', ')}` : ''}`)
      }
    }
    check(p.nutrition.notes.every((n) => has(n.replace(/^\*/, '').replace(/\.$/, ''))), 'footnotes printed on the label')

    // Preparation: step count and every quantity/time on the pack panel
    const prepNumbers = p.preparation.steps.flatMap((s) => (s.text + ' ' + (s.time ?? '')).match(/\d+(?:–\d+)?|¾/g) ?? [])
    const missingNumbers = [...new Set(prepNumbers)].filter((n) => !label.includes(n))
    const stepCount = p.family === 'pancake' ? 6 : 3
    check(p.preparation.steps.length === stepCount && missingNumbers.length === 0, `${p.preparation.steps.length} preparation steps; quantities ${[...new Set(prepNumbers)].join(', ')}${missingNumbers.length ? ` missing ${missingNumbers}` : ''}`)

    // Storage and serving
    check(p.storage.every((s) => has(s)), 'storage instructions')
    if (p.family === 'pancake') check(has(p.serving.text), 'serving suggestion')
  }

  for (const c of futureConcepts) check(!c.price && !c.purchase && c.status === 'Concept in development', `concept "${c.name}" has no commerce`)
}

// ---------------------------------------------------------------------------
// Ingredient stories vs the product information document and the labels
// ---------------------------------------------------------------------------
/** Rows of the docx ingredient tables: [name, quantity, why] triples, by section. */
function infoIngredientRows(info) {
  const lines = info.split('\n').map((l) => l.trim()).filter(Boolean)
  const tables = {}
  let section = null
  for (let i = 0; i < lines.length; i++) {
    if (/^1\. Millet Idly Mix/.test(lines[i])) section = 'idli'
    if (/^2\. Protein Pancake Mix/.test(lines[i])) section = 'pancake'
    if (/^3\. /.test(lines[i])) section = null
    if (section && lines[i] === 'Why it is used') {
      const rows = []
      let j = i + 1
      while (lines[j] !== 'Accompaniment') {
        rows.push({ name: lines[j], quantity: lines[j + 1], why: lines[j + 2] })
        j += 3
      }
      tables[section] = rows
    }
  }
  return tables
}

const words = (s) => norm(s).replace(/[^a-z0-9 ]/g, ' ').split(' ').filter((w) => w.length > 3)
/** Share of the source sentence's content words that the site's wording keeps. */
const overlap = (source, ours) => {
  const mine = new Set(words(ours).map((w) => w.replace(/s$/, '')))
  const theirs = words(source).map((w) => w.replace(/s$/, ''))
  return theirs.filter((w) => mine.has(w) || mine.has(w.replace(/ly$/, 'li'))).length / theirs.length
}

async function ingredientFacts() {
  console.log('\n== Ingredient stories vs product information and labels ==')
  let info
  try {
    info = await readFile(new URL('./info/docx.txt', import.meta.url), 'utf8')
  } catch {
    fail('product information text missing (.qa/info/docx.txt)')
    return
  }
  const tables = infoIngredientRows(info)
  check(tables.idli?.length === 8 && tables.pancake?.length === 10, `product information tables: idli ${tables.idli?.length}, pancake ${tables.pancake?.length}`)

  for (const p of launchProducts) {
    const story = p.ingredientStory
    console.log(`  -- ${p.name}`)
    if (!story) {
      fail('no ingredient story')
      continue
    }
    const label = norm(await readFile(new URL(`./labels/${LABEL_TEXT[p.slug]}/text.txt`, import.meta.url), 'utf8'))

    // Every "on the pack" declaration is printed on this product's label
    const notOnLabel = story.items.filter((it) => it.onPack && !label.includes(norm(it.onPack)))
    check(notOnLabel.length === 0, `"On the pack" text found on the label${notOnLabel.length ? ` — missing ${notOnLabel.map((i) => i.onPack).join(' | ')}` : ''}`)

    // Images: one per ingredient, in the manifest, built, associated with this product
    const imgProblems = []
    for (const it of story.items) {
      const m = ingredientImages[it.image]
      if (!m) imgProblems.push(`${it.id}: not in manifest`)
      else if (!m.products.includes(p.slug)) imgProblems.push(`${it.id}: manifest does not list ${p.slug}`)
      if (!imageMeta[it.image]) imgProblems.push(`${it.id}: not built`)
      else {
        for (const w of imageMeta[it.image].widths) {
          await access(new URL(`../public/images/${it.image}-${w}.webp`, import.meta.url)).catch(() => imgProblems.push(`${it.image}-${w}.webp missing`))
        }
      }
      if (!it.image.endsWith(it.id)) imgProblems.push(`${it.id} uses ${it.image}`)
    }
    const used = story.items.map((i) => i.image)
    if (new Set(used).size !== used.length) imgProblems.push('an image is used for two ingredients')
    check(imgProblems.length === 0, `${used.length} ingredient images, one each, named after the ingredient${imgProblems.length ? ` — ${imgProblems.join('; ')}` : ''}`)

    // Quantities and roles
    if (p.family === 'idli' || p.slug === 'vanilla-protein-pancake-mix') {
      const rows = tables[p.family === 'idli' ? 'idli' : 'pancake']
      check(rows.length === story.items.length, `${story.items.length} ingredients, as in the product information table (${rows.length})`)
      rows.forEach((row, i) => {
        const it = story.items[i]
        if (!it) return
        const docQty = /as per formulation/i.test(row.quantity) ? null : row.quantity
        const nameOk = norm(row.name).includes(norm(it.name).replace('raising agent: ', '')) || norm(it.name).includes(norm(row.name))
        check(
          nameOk && (it.quantity?.display ?? null) === docQty && overlap(row.why, it.role) >= 0.75,
          `${it.name}: ${it.quantity?.display ?? 'no quantity'} (document: "${row.name}", ${row.quantity}) — role keeps ${Math.round(overlap(row.why, it.role) * 100)}% of "${row.why}"`,
        )
      })
    } else {
      // Chocolate: quantities only where the chocolate label prints a percentage
      const bad = story.items.filter((it) => {
        const pct = /\((\d+)%\)$/.exec(it.onPack ?? '')?.[1]
        return pct ? it.quantity?.display !== `${pct}%` : it.quantity !== null
      })
      check(bad.length === 0, `quantities match the chocolate label percentages, none invented${bad.length ? ` — ${bad.map((b) => b.id).join(', ')}` : ''}`)
      check(!story.items.some((i) => i.id === 'vanilla') && ['cocoa-powder', 'chocolate-chips'].every((id) => story.items.some((i) => i.id === id)), 'chocolate recipe: cocoa powder and chips, no vanilla')
      const vanilla = launchProducts.find((x) => x.slug === 'vanilla-protein-pancake-mix').ingredientStory
      const sharedRoles = story.items.filter((it) => it.role).every((it) => vanilla.items.find((v) => v.id === it.id)?.role === it.role)
      check(sharedRoles && story.items.filter((i) => !i.role).map((i) => i.id).join() === 'cocoa-powder,chocolate-chips', 'roles reused from the product information; cocoa powder and chips left undescribed')
      const differs = story.items.filter((it) => it.quantity).some((it) => vanilla.items.find((v) => v.id === it.id)?.quantity?.display.replace(' g', '%') !== it.quantity.display)
      check(differs, 'chocolate quantities are not the vanilla formulation')
    }

    // No health claims in the roles
    const claims = story.items.filter((it) => /detox|immun|blood sugar|burn|metaboli|weight|gut health|boost/i.test(`${it.role} ${story.accompaniment?.role}`))
    check(claims.length === 0, 'roles stay on identity, texture and flavour (no health claims)')

    // Accompaniment is separate and never broken down
    check(!!story.accompaniment && !('items' in story.accompaniment) && !story.items.some((i) => /honey|chutney/i.test(i.name)), `${story.accompaniment?.name} kept separate from the ingredient breakdown`)
    check(!!story.composition?.note, `composition note: "${story.composition?.note?.slice(0, 70)}…"`)
  }

  const idli = launchProducts.find((p) => p.family === 'idli')
  check(
    idli.ingredientStory.review.some((r) => /peanut/i.test(r) && /tomato/i.test(r)) && idli.ingredientStory.review.some((r) => /modified rice flour/i.test(r)),
    'idli review flags: chutney name (peanut vs tomato) and modified rice flour',
  )
}

// ---------------------------------------------------------------------------
// Every route: rendering, images, a11y basics, forbidden content
// ---------------------------------------------------------------------------
async function auditRoutes(context, label) {
  console.log(`\n== Routes (${label}) ==`)
  const page = await context.newPage()
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('response', (r) => r.status() >= 400 && errors.push(`${r.status()} ${r.url()}`))
  const links = new Set()

  for (const route of ROUTES) {
    errors.length = 0
    await page.goto(BASE + route, { waitUntil: 'networkidle' })
    await scrollThrough(page)
    const info = await page.evaluate(() => ({
      title: document.title,
      h1: document.querySelector('h1')?.textContent,
      h1Count: document.querySelectorAll('h1').length,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      broken: [...document.images].filter((i) => !i.complete || !i.naturalWidth).map((i) => i.currentSrc || i.src),
      noAlt: [...document.images].filter((i) => !i.hasAttribute('alt')).length,
      fallbacks: document.querySelectorAll('.img__fallback').length,
      desc: !!document.querySelector('meta[name="description"]'),
      links: [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')),
      meta: [document.title, document.querySelector('meta[name="description"]')?.content ?? ''].join(' '),
      tonesMissing: [...document.querySelectorAll('main section')].filter((s) => !s.closest('[data-tone]')).length,
      // Tables may scroll inside their own region, never the page.
      tableEscapes: [...document.querySelectorAll('.ntable__scroll')].filter((el) => el.getBoundingClientRect().right > document.documentElement.clientWidth + 0.5).length,
      dupIds: (() => {
        const ids = [...document.querySelectorAll('[id]')].map((e) => e.id)
        return ids.filter((id, i) => ids.indexOf(id) !== i)
      })(),
      text: document.body.innerText,
    }))
    info.links.forEach((l) => links.add(l))
    const tag = `${route} -> "${info.h1}"`
    const issues = []
    if (info.overflow > 0) issues.push(`overflow ${info.overflow}px`)
    if (info.tableEscapes) issues.push(`${info.tableEscapes} tables wider than the viewport`)
    if (info.broken.length) issues.push(`broken images ${info.broken.join(', ')}`)
    if (info.noAlt) issues.push(`${info.noAlt} images without alt attribute`)
    if (info.fallbacks) issues.push(`${info.fallbacks} image fallbacks shown`)
    if (info.h1Count !== 1) issues.push(`${info.h1Count} h1`)
    if (info.tonesMissing) issues.push(`${info.tonesMissing} sections without data-tone`)
    if (info.dupIds.length) issues.push(`duplicate ids ${info.dupIds.join(', ')}`)
    const bad = [...FORBIDDEN, ...CLICHES].filter((re) => re.test(`${info.text} ${info.meta}`)).map(String)
    if (bad.length) issues.push(`forbidden text ${bad.join(', ')}`)
    if (errors.length) issues.push(`errors ${errors.join(' | ')}`)
    issues.length ? fail(`${tag}: ${issues.join('; ')}`) : ok(`${tag} | ${info.title}`)
  }

  console.log(`\n== Internal links (${label}) ==`)
  for (const href of links) {
    if (/^https?:/.test(href)) {
      fail(`external link ${href}`)
      continue
    }
    if (href.startsWith('#')) {
      ok(`anchor ${href}`)
      continue
    }
    await page.goto(BASE + href, { waitUntil: 'networkidle' })
    await wait(300)
    const res = await page.evaluate((h) => {
      const hash = h.split('#')[1]
      return { h1: document.querySelector('h1')?.textContent, target: hash ? !!document.getElementById(hash) : true }
    }, href)
    check(!/the menu\.$/.test(res.h1 ?? '') && res.target, `${href} -> ${res.h1}${res.target ? '' : ' (anchor target missing)'}`)
  }
  await page.close()
}

// ---------------------------------------------------------------------------
// Product pages render exactly the data-module facts
// ---------------------------------------------------------------------------
async function productPages(context) {
  console.log('\n== Product pages ==')
  const page = await context.newPage()
  for (const p of launchProducts) {
    console.log(`  -- ${p.name}`)
    await page.goto(`${BASE}/products/${p.slug}`, { waitUntil: 'networkidle' })
    await scrollThrough(page)
    const info = await page.evaluate(() => ({
      h1: document.querySelector('h1')?.textContent,
      sections: [...document.querySelectorAll('.pdp section[id]')].map((s) => s.id),
      navLinks: [...document.querySelectorAll('.snav a')].map((a) => a.getAttribute('href')),
      facts: Object.fromEntries([...document.querySelectorAll('.facts div')].map((d) => [d.querySelector('dt').textContent, d.querySelector('dd').textContent])),
      ingredients: [...document.querySelectorAll('.ingr__group')].map((g) => ({
        title: g.querySelector('.ingr__title')?.textContent,
        items: [...g.querySelectorAll('li')].map((li) => li.textContent),
      })),
      allergen: document.querySelector('.ingr__allergens')?.innerText,
      tables: [...document.querySelectorAll('.nutri .ntable')].map((t) => ({
        title: t.querySelector('.ntable__title')?.textContent,
        head: [...t.querySelectorAll('thead th')].map((th) => th.textContent),
        rows: [...t.querySelectorAll('tbody tr')].map((tr) => [...tr.children].map((c) => c.textContent)),
      })),
      notes: document.querySelector('.nutri__notes')?.innerText ?? '',
      separate: document.querySelector('.nutri__separate')?.textContent ?? '',
      steps: document.querySelectorAll('#preparation ol > li').length,
      storage: [...document.querySelectorAll('.store li')].map((li) => li.textContent),
      buttons: [...document.querySelectorAll('button, a')].map((b) => b.textContent).filter((t) => /buy|cart|order now|price/i.test(t)),
      note: document.querySelector('.phero__note')?.textContent,
      thumbs: document.querySelectorAll('.gallery__thumb').length,
    }))

    check(info.h1 === p.name, `h1 "${info.h1}"`)
    const expected = PRODUCT_SECTIONS.map((s) => s.id)
    check(expected.every((id, i) => info.sections.indexOf(id) >= 0 && (i === 0 || info.sections.indexOf(id) > info.sections.indexOf(expected[i - 1]))), `sections in order: ${info.sections.join(', ')}`)
    check(info.navLinks.join() === expected.map((id) => `#${id}`).join(), `section nav ${info.navLinks.join(' ')}`)
    check(info.facts['Net weight'] === p.pack.netWeight && info.facts['Serving size'] === p.pack.servingSize, `facts ${JSON.stringify(info.facts)}`)

    const expectedIngr = p.ingredients.map((g) => ({ title: g.title, count: splitTopLevel(g.text).length }))
    check(
      info.ingredients.length === expectedIngr.length && info.ingredients.every((g, i) => g.items.length === expectedIngr[i].count),
      `ingredient lists ${info.ingredients.map((g) => `${g.title}: ${g.items.length}`).join(', ')}`,
    )
    check(
      p.allergens.declared ? info.allergen?.includes(p.allergens.statement) : /does not include an allergen statement/.test(info.allergen ?? ''),
      `allergens: ${info.allergen?.replace(/\s+/g, ' ')}`,
    )

    // Tables: one per group, in order, every cell as in the data
    check(info.tables.map((t) => t.title).join('|') === p.nutrition.groups.map((g) => g.title).join('|'), `separate tables: ${info.tables.map((t) => t.title).join(' + ')}`)
    const cellMisses = []
    p.nutrition.groups.forEach((g, gi) => {
      const t = info.tables[gi]
      if (!t) return
      g.rows.forEach((row, ri) => {
        const rendered = t.rows[ri] ?? []
        const want = [row.nutrient, ...g.columns.map((c) => row[c.key] ?? '–')]
        if (rendered.join('|') !== want.join('|')) cellMisses.push(`${g.title}/${row.nutrient}: ${rendered.join('|')} ≠ ${want.join('|')}`)
      })
      g.columns.forEach((c, ci) => {
        if (!!c.calculated !== t.head[ci + 1].includes('†')) cellMisses.push(`${g.title} "${c.label}" calculated mark`)
      })
    })
    check(cellMisses.length === 0, `every table cell matches the data${cellMisses.length ? ` — ${cellMisses.join('; ')}` : ''}`)
    const hasCalc = p.nutrition.groups.some((g) => g.columns.some((c) => c.calculated))
    check(hasCalc === /Calculated from the per 100 g values/.test(info.notes), `calculated-values note ${hasCalc ? 'shown' : 'not needed'}`)
    check(info.separate.length > 0 && info.separate.includes(p.accompaniment.name), `accompaniment kept separate: "${info.separate}"`)

    check(info.steps === p.preparation.steps.length, `${info.steps} preparation steps`)
    check(info.storage.join('|') === p.storage.join('|'), 'storage lines')
    check(!!info.note && info.buttons.length === 0, `no purchase actions; note "${info.note}"`)

    // Gallery: four packaging views, click and keyboard
    const caption = () => page.textContent('.gallery__caption')
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    const before = await caption()
    await page.click('.gallery__thumb:nth-child(2)')
    await wait(900)
    const second = await caption()
    await page.focus('.gallery__thumb[aria-pressed="true"]')
    await page.keyboard.press('ArrowRight')
    await wait(900)
    const third = await caption()
    check(info.thumbs === 4 && new Set([before, second, third]).size === 3, `gallery ${[before, second, third].join(' > ')}`)

    // Anchor deep link lands below the sticky header and section nav
    await page.goto(`${BASE}/products/${p.slug}#nutrition`, { waitUntil: 'networkidle' })
    await wait(1400)
    const pos = await page.evaluate(() => {
      const top = document.getElementById('nutrition').getBoundingClientRect().top
      const nav = document.querySelector('.snav').getBoundingClientRect().bottom
      return { top: Math.round(top), nav: Math.round(nav) }
    })
    check(pos.top >= pos.nav - 2 && pos.top < 260, `#nutrition deep link clears the sticky nav ${JSON.stringify(pos)}`)
  }
  await page.close()
}

// ---------------------------------------------------------------------------
// Ingredient explorer: right photo beside the right name, mouse and keyboard
// ---------------------------------------------------------------------------
async function ingredientExplorer(context, label) {
  console.log(`\n== Ingredient explorer (${label}) ==`)
  const page = await context.newPage()
  for (const p of launchProducts) {
    const story = p.ingredientStory
    await page.goto(`${BASE}/products/${p.slug}#ingredients`, { waitUntil: 'networkidle' })
    await wait(900)

    const intro = await page.evaluate(() => ({
      headings: [...document.querySelectorAll('h2')].filter((h) => h.textContent === 'Good things, ingredient by ingredient.').length,
      intros: (document.body.innerText.match(/Explore what’s in the mix and the role each ingredient plays\./g) ?? []).length,
      sectionTitles: [...document.querySelectorAll('.pdp section[id] > .container > header h2')].map((h) => h.textContent),
    }))
    check(intro.headings === 1 && intro.intros === 1 && !intro.sectionTitles.includes('Ingredients and allergens'), `${p.shortName}: one ingredients section, heading and intro once`)

    const state = () =>
      page.evaluate(() => {
        const sel = document.querySelector('.ix__pick[aria-selected="true"]')
        const photo = [...document.querySelectorAll('.ix__photo img')].pop()
        const panel = document.querySelector('.ix__panel')
        return {
          tabs: document.querySelectorAll('.ix__pick').length,
          selected: sel?.querySelector('.ix__pick-name')?.textContent,
          tabImg: sel?.querySelector('img')?.getAttribute('src'),
          focused: document.activeElement === sel,
          name: document.querySelector('.ix__name')?.textContent,
          photo: photo?.getAttribute('src'),
          photoAlt: photo?.getAttribute('alt'),
          dd: [...document.querySelectorAll('.ix__facts dd')].map((d) => d.textContent),
          role: document.querySelector('.ix__why-text')?.textContent,
          labelledBy: panel?.getAttribute('aria-labelledby') === sel?.id,
        }
      })

    // Click every ingredient: name, photo, quantity and role all belong together
    const mismatches = []
    for (let i = 0; i < story.items.length; i++) {
      const it = story.items[i]
      await page.locator('.ix__pick').nth(i).click()
      await wait(250)
      const s = await state()
      const ok =
        s.tabs === story.items.length &&
        s.selected === it.name &&
        s.name === it.name &&
        s.photo?.includes(`/images/${it.image}-`) &&
        s.tabImg?.includes(`/images/${it.image}-`) &&
        !!s.photoAlt &&
        s.dd[0] === (it.quantity?.display ?? 'Not specified') &&
        s.dd[1] === (it.onPack ?? 'Not listed on the current pack artwork') &&
        s.role === (it.role ?? 'Its role is not described in the product information.') &&
        s.labelledBy
      if (!ok) mismatches.push(`${it.name}: ${JSON.stringify(s)}`)
    }
    check(mismatches.length === 0, `${p.shortName}: ${story.items.length} ingredients each show their own photo, quantity, pack text and role${mismatches.length ? ` — ${mismatches.join(' || ')}` : ''}`)

    // Keyboard: Home, arrows, End, wrap-around; focus follows selection
    await page.locator('.ix__pick').nth(0).click()
    await page.keyboard.press('ArrowRight')
    const right = await state()
    await page.keyboard.press('End')
    const end = await state()
    await page.keyboard.press('ArrowRight')
    const wrap = await state()
    await page.keyboard.press('ArrowLeft')
    const back = await state()
    const last = story.items.at(-1).name
    check(
      right.selected === story.items[1].name && right.focused && end.selected === last && wrap.selected === story.items[0].name && back.selected === last && back.focused,
      `${p.shortName}: keyboard → ${[right.selected, end.selected, wrap.selected, back.selected].join(' → ')}`,
    )

    // "Next" button
    await page.locator('.ix__pick').nth(0).click()
    await page.locator('.ix__next').click()
    await wait(250)
    check((await state()).name === story.items[1].name, `${p.shortName}: "Next" moves to ${story.items[1].name}`)

    // Composition draws only quantified ingredients, with their source values
    const comp = await page.evaluate(() => [...document.querySelectorAll('.icomp__item')].map((li) => `${li.querySelector('.icomp__qty').textContent} ${li.querySelector('.icomp__name').textContent}`))
    const want = story.items.filter((i) => i.quantity).map((i) => `${i.quantity.display} ${i.name}`)
    check(comp.join('|') === want.join('|'), `${p.shortName}: composition ${comp.join(', ')}`)
    const side = await page.evaluate(() => document.querySelector('.icomp__side-name')?.textContent)
    check(side === `${story.accompaniment.name} ${story.accompaniment.amount}`, `${p.shortName}: accompaniment shown apart — ${side}`)
  }

  // A failed ingredient image shows the designed fallback with the ingredient's name
  const failing = await context.newPage()
  await failing.route('**/images/ingredients/*.webp', (r) => r.abort())
  await failing.goto(`${BASE}/products/millet-idli-mix#ingredients`, { waitUntil: 'networkidle' })
  await wait(900)
  const fb = await failing.evaluate(() => ({
    stage: document.querySelector('.ix__photo .img__fallback-label')?.textContent,
    name: document.querySelector('.ix__name')?.textContent,
  }))
  check(!!fb.stage && fb.stage === fb.name, `failed ingredient photo falls back to a labelled placeholder ("${fb.stage}")`)
  await failing.close()
  await page.close()
}

async function vitals(context, label) {
  const page = await context.newPage()
  await page.addInitScript(() => {
    window.__cls = 0
    window.__lcp = 0
    new PerformanceObserver((l) => l.getEntries().forEach((e) => !e.hadRecentInput && (window.__cls += e.value))).observe({ type: 'layout-shift', buffered: true })
    new PerformanceObserver((l) => l.getEntries().forEach((e) => (window.__lcp = e.startTime))).observe({ type: 'largest-contentful-paint', buffered: true })
  })
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await wait(3000)
  const v = await page.evaluate(() => ({ cls: window.__cls, lcp: window.__lcp }))
  check(v.cls < 0.1, `${label} CLS ${v.cls.toFixed(3)}`)
  check(v.lcp < 2500, `${label} LCP ${Math.round(v.lcp)}ms (local)`)
  await page.close()
}

async function homepageStructure(context) {
  console.log('\n== Homepage structure ==')
  const page = await context.newPage()
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  const sections = await page.evaluate(() => [...document.querySelectorAll('main > div > section, main section')].map((s) => s.classList[0]))
  const order = ['hero', 'launch', 'range', 'prep-preview', 'pindex', 'final']
  const unique = [...new Set(sections)]
  check(unique.join(',') === order.join(','), `sections ${unique.join(' > ')}`)
  const deep = await page.evaluate(() => [...document.querySelectorAll('.pindex a[href*="#"]')].map((a) => a.getAttribute('href')))
  check(deep.length === launchProducts.length * 4, `product index deep links (${deep.length})`)
  await page.close()
}

async function desktopInteractions(context) {
  console.log('\n== Desktop interactions ==')
  const page = await context.newPage()
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await wait(1500)

  await page.keyboard.press('Tab')
  const first = await page.evaluate(() => document.activeElement?.textContent?.trim())
  check(first === 'Skip to content', `first tab stop: ${first}`)

  const header = () => page.evaluate(() => document.querySelector('.site-header').className)
  const logo = () => page.evaluate(() => getComputedStyle(document.querySelector('.site-header__logo-img--light')).opacity)
  check((await header()).includes('site-header--light') && !(await header()).includes('is-scrolled'), 'header transparent, dark-on-light over the hero')

  await page.click('.hero a[href="#collection"]')
  await wait(1800)
  const top = await page.evaluate(() => document.getElementById('collection').getBoundingClientRect().top)
  check(Math.abs(top) < 160, `hero secondary action scrolls to the collection (top=${Math.round(top)})`)

  await page.evaluate(() => {
    const el = document.querySelector('.prep-preview')
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + 200, behavior: 'instant' })
  })
  await wait(1200)
  await page.evaluate(() => window.scrollBy({ top: -60, behavior: 'instant' }))
  await wait(800)
  check((await header()).includes('site-header--dark') && (await logo()) === '1', 'header + light logo over the dark preparation section')

  await page.evaluate(() => window.scrollTo({ top: window.scrollY + 1200, behavior: 'instant' }))
  await wait(400)
  check((await header()).includes('is-hidden'), 'header hides while scrolling down')
  await page.evaluate(() => window.scrollTo({ top: window.scrollY - 300, behavior: 'instant' }))
  await wait(400)
  check(!(await header()).includes('is-hidden'), 'header returns on scroll up')

  // Navigation + current state + page transition
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await wait(500)
  const nav = page.getByRole('navigation', { name: 'Primary' })
  const navLabels = await nav.getByRole('link').allTextContents()
  check(navLabels.join('|') === 'Home|Explore Products|Pancake Mixes|Millet Idli Mix', `nav items ${navLabels.join(', ')}`)
  for (const [label, url] of [
    ['Pancake Mixes', '/pancake-mixes'],
    ['Millet Idli Mix', '/products/millet-idli-mix'],
    ['Explore Products', '/products'],
    ['Home', '/'],
  ]) {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await wait(300)
    await nav.getByRole('link', { name: label, exact: true }).click()
    await page.waitForURL((u) => u.pathname === url)
    await wait(1400)
    const after = await page.evaluate(() => ({
      h1: document.querySelector('h1')?.textContent,
      y: window.scrollY,
      current: document.querySelector('.site-nav [aria-current="page"]')?.textContent,
    }))
    check(!!after.h1 && after.y < 5 && after.current === label, `nav ${label} -> ${JSON.stringify(after)}`)
  }

  // Pancake product page highlights the Pancake Mixes family
  await page.goto(BASE + '/products/chocolate-protein-pancake-mix', { waitUntil: 'networkidle' })
  await wait(800)
  const current = await page.evaluate(() => document.querySelector('.site-nav [aria-current="page"]')?.textContent)
  check(current === 'Pancake Mixes', `chocolate page marks "${current}" current`)

  // Section nav follows the scroll position
  await page.evaluate(() => document.getElementById('preparation').scrollIntoView({ behavior: 'instant' }))
  await wait(900)
  const activeSection = await page.evaluate(() => document.querySelector('.snav [aria-current="true"]')?.textContent)
  check(activeSection === 'Preparation', `section nav marks "${activeSection}" while reading preparation`)

  // Pancake mixes comparison is built from both labels
  await page.goto(BASE + '/pancake-mixes', { waitUntil: 'networkidle' })
  await wait(800)
  const compare = await page.evaluate(() => [...document.querySelectorAll('.compare tbody tr')].map((tr) => [...tr.children].map((c) => c.textContent)))
  const pancakes = launchProducts.filter((p) => p.family === 'pancake')
  const energy = compare.find((r) => r[0] === 'Energy per 100 g')
  check(energy?.slice(1).join('|') === pancakes.map((p) => p.nutrition.groups[0].rows[0].per100).join('|'), `compare energy ${energy?.join(' | ')}`)

  // Filters + URL sync on /products
  await page.goto(BASE + '/products', { waitUntil: 'networkidle' })
  await wait(800)
  const cards = () => page.$$eval('.collection__grid > li h2', (els) => els.map((e) => e.textContent))
  check((await cards()).length === 3, `collection shows the 3 launch products`)
  await page.getByRole('button', { name: /^Pancake mixes/ }).click()
  await wait(900)
  let c = await cards()
  check(c.length === 2 && c.every((n) => /Pancake Mix$/.test(n)), `filter pancake -> ${c.join(', ')}`)
  await page.getByRole('button', { name: /^Idli mix/ }).click()
  await wait(900)
  c = await cards()
  check(c.length === 1 && c[0] === 'Millet Idli Mix', `filter idli -> ${c.join(', ')}`)
  const url = page.url()
  await page.reload({ waitUntil: 'networkidle' })
  await wait(900)
  const restored = await page.evaluate(() => ({
    pressed: document.querySelector('.filters__chip[aria-pressed="true"]')?.textContent,
    cards: document.querySelectorAll('.collection__grid > li').length,
  }))
  check(/^Idli mix/.test(restored.pressed) && restored.cards === 1, `URL sync ${url.replace(BASE, '')} ${JSON.stringify(restored)}`)
  await page.getByRole('button', { name: /^All/ }).focus()
  await page.keyboard.press('Enter')
  await wait(900)
  check((await cards()).length === 3, '"All" restores every product (keyboard)')
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle)
  check(outline !== 'none', `visible focus outline (${outline})`)

  // Future concepts are not links and carry no commerce
  const concepts = await page.evaluate(() =>
    [...document.querySelectorAll('.horizon__item')].map((li) => ({
      link: !!li.closest('a') || !!li.querySelector('a'),
      stamp: li.querySelector('.horizon__stamp')?.textContent,
      status: li.querySelector('.horizon__status')?.textContent,
    })),
  )
  check(concepts.length === 2 && concepts.every((x) => !x.link && x.stamp === 'Concept' && /development/.test(x.status)), `concepts labelled, not linked ${JSON.stringify(concepts)}`)

  // Hash deep link from the footer
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }))
  await wait(600)
  await page.click('.site-footer a[href$="#on-the-horizon"]')
  await page.waitForURL('**/products#on-the-horizon')
  await wait(1600)
  const horizonTop = await page.evaluate(() => document.getElementById('on-the-horizon')?.getBoundingClientRect().top)
  check(Math.abs(horizonTop) < 160, `footer "On the horizon" lands on the section (top=${Math.round(horizonTop)})`)

  // Unknown product slug renders the 404
  await page.goto(BASE + '/products/not-a-product', { waitUntil: 'networkidle' })
  check((await page.textContent('h1')) === 'Not on the menu.', 'unknown product -> not found page')

  // Image failure shows the designed fallback rather than an empty box
  const failing = await context.newPage()
  await failing.route('**/images/vanilla-hero-*.webp', (r) => r.abort())
  await failing.goto(BASE + '/products/vanilla-protein-pancake-mix', { waitUntil: 'networkidle' })
  await scrollThrough(failing)
  const fb = await failing.evaluate(() => ({
    fallbacks: document.querySelectorAll('.img__fallback').length,
    label: document.querySelector('.img__fallback')?.getAttribute('aria-label'),
  }))
  check(fb.fallbacks >= 1 && !!fb.label, `failed image shows fallback (${fb.fallbacks}, "${fb.label?.slice(0, 40)}…")`)
  await failing.close()

  await page.close()
}

async function mobileInteractions(context) {
  console.log('\n== Mobile ==')
  const page = await context.newPage()
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await wait(1200)
  const toggle = page.locator('.menu-toggle')
  await toggle.click()
  await wait(900)
  let s = await page.evaluate(() => ({
    expanded: document.querySelector('.menu-toggle').getAttribute('aria-expanded'),
    dialog: !!document.querySelector('#mobile-menu'),
    inert: document.getElementById('main-content').hasAttribute('inert'),
    locked: document.body.classList.contains('is-locked'),
    toggleVisible: document.querySelector('.menu-toggle').getBoundingClientRect().top >= 0,
    lightLogo: getComputedStyle(document.querySelector('.site-header__logo-img--light')).opacity,
  }))
  check(s.expanded === 'true' && s.dialog && s.inert && s.locked && s.toggleVisible && s.lightLogo === '1', `menu opens ${JSON.stringify(s)}`)

  await page.keyboard.press('Escape')
  await wait(700)
  s = await page.evaluate(() => ({
    expanded: document.querySelector('.menu-toggle').getAttribute('aria-expanded'),
    dialog: !!document.querySelector('#mobile-menu'),
    focusIsToggle: document.activeElement === document.querySelector('.menu-toggle'),
    inert: document.getElementById('main-content').hasAttribute('inert'),
  }))
  check(s.expanded === 'false' && !s.dialog && s.focusIsToggle && !s.inert, `Escape closes menu ${JSON.stringify(s)}`)

  await toggle.click()
  await wait(700)
  await page.locator('#mobile-menu .mobile-menu__link', { hasText: 'Millet Idli Mix' }).click()
  await page.waitForURL('**/products/millet-idli-mix')
  await wait(1400)
  s = await page.evaluate(() => ({
    dialog: !!document.querySelector('#mobile-menu'),
    h1: document.querySelector('h1')?.textContent,
    locked: document.body.classList.contains('is-locked'),
  }))
  check(!s.dialog && s.h1 === 'Millet Idli Mix' && !s.locked, `menu link navigates and closes ${JSON.stringify(s)}`)

  // Nutrition tables scroll inside their region; the nutrient column stays put
  await page.evaluate(() => document.querySelector('.ntable').scrollIntoView({ block: 'center', behavior: 'instant' }))
  await wait(600)
  const table = await page.evaluate(() => {
    const scroller = document.querySelector('.ntable__scroll')
    const th = scroller.querySelector('tbody th')
    const before = th.getBoundingClientRect().left
    scroller.scrollLeft = 200
    return new Promise((r) =>
      requestAnimationFrame(() =>
        r({
          scrolls: scroller.scrollWidth > scroller.clientWidth,
          moved: scroller.scrollLeft > 0,
          stickyShift: Math.round(th.getBoundingClientRect().left - before),
          focusable: scroller.tabIndex === 0,
          labelled: !!document.getElementById(scroller.getAttribute('aria-labelledby')),
        }),
      ),
    )
  })
  check(table.scrolls && table.moved && table.stickyShift === 0 && table.focusable && table.labelled, `table scrolls in place, nutrient column sticky ${JSON.stringify(table)}`)

  // Section nav keeps the current section visible
  await page.evaluate(() => document.getElementById('storage').scrollIntoView({ behavior: 'instant' }))
  await wait(1200)
  const navState = await page.evaluate(() => {
    const a = document.querySelector('.snav [aria-current="true"]')
    const r = a?.getBoundingClientRect()
    return { label: a?.textContent, visible: !!r && r.left >= 0 && r.right <= innerWidth }
  })
  check(navState.label === 'Storage' && navState.visible, `section nav shows the current section ${JSON.stringify(navState)}`)

  const small = await page.evaluate(() =>
    [...document.querySelectorAll('a, button')]
      .filter((el) => el.offsetParent && !el.closest('.site-footer__col, .crumbs'))
      .map((el) => ({ t: el.textContent.trim().slice(0, 24), h: el.getBoundingClientRect().height }))
      .filter((x) => x.h > 0 && x.h < 32),
  )
  check(small.length === 0, `touch targets >= 32px ${JSON.stringify(small)}`)
  await page.close()
}

async function reducedMotion() {
  console.log('\n== Reduced motion ==')
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' })
  const page = await context.newPage()
  for (const route of ['/', '/products/millet-idli-mix']) {
    await page.goto(BASE + route, { waitUntil: 'networkidle' })
    await scrollThrough(page)
    const state = await page.evaluate(() => ({
      hiddenImgs: [...document.querySelectorAll('.img img')].filter((i) => getComputedStyle(i).opacity !== '1').length,
      clipped: [...document.querySelectorAll('.mask-reveal')].filter((m) => (m.style.clipPath || '').includes('100%')).length,
      offsetLines: [...document.querySelectorAll('.line-reveal__inner')].filter((l) => (l.style.transform || '').includes('115')).length,
      hiddenIngredients: [...document.querySelectorAll('.ingr li, .ingr__allergens, .ix__detail, .ix__photo, .icomp__item')].filter((el) => +getComputedStyle(el).opacity < 1).length,
    }))
    check(Object.values(state).every((v) => !v), `${route} content fully visible with reduced motion ${JSON.stringify(state)}`)
  }
  await context.close()
}

await labelFacts()
await ingredientFacts()

const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } })
await auditRoutes(desktop, 'desktop')
await vitals(desktop, 'desktop')
await homepageStructure(desktop)
await productPages(desktop)
await ingredientExplorer(desktop, 'desktop')
await desktopInteractions(desktop)
await desktop.close()

const tablet = await browser.newContext({ viewport: { width: 820, height: 1180 } })
await auditRoutes(tablet, 'tablet')
await tablet.close()

const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
})
await auditRoutes(mobile, 'mobile')
await vitals(mobile, 'mobile')
await mobileInteractions(mobile)
await ingredientExplorer(mobile, 'mobile')
await mobile.close()

await reducedMotion()
await browser.close()

console.log(`\n${problems.length ? `${problems.length} problem(s)` : 'All checks passed'}`)
process.exit(problems.length ? 1 : 0)
