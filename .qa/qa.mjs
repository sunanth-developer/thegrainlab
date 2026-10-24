import { chromium } from 'playwright-core'

const BASE = process.env.BASE ?? 'http://localhost:5281'

const ROUTES = [
  '/',
  '/products',
  '/products/millet-flours',
  '/products/dosa-mixes',
  '/products/millet-pasta',
  '/products/breakfast-porridges',
  '/products/pancake-blends',
  '/products/breakfast',
  '/products/dosa-mixes/not-a-product',
  '/products/does-not-exist',
  '/nope',
]

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
      tonesMissing: [...document.querySelectorAll('main section')].filter((s) => !s.closest('[data-tone]')).length,
    }))
    info.links.forEach((l) => links.add(l))
    const tag = `${route} -> "${info.h1}"`
    const issues = []
    if (info.overflow > 0) issues.push(`overflow ${info.overflow}px`)
    if (info.broken.length) issues.push(`broken images ${info.broken.join(', ')}`)
    if (info.noAlt) issues.push(`${info.noAlt} images without alt attribute`)
    if (info.fallbacks) issues.push(`${info.fallbacks} image fallbacks shown`)
    if (info.h1Count !== 1) issues.push(`${info.h1Count} h1`)
    if (info.tonesMissing) issues.push(`${info.tonesMissing} sections without data-tone`)
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
      const exists = await page.evaluate((id) => !!document.getElementById(id), href.slice(1))
      ok(`anchor ${href}${exists ? '' : ' (target on another page)'}`)
      continue
    }
    await page.goto(BASE + href, { waitUntil: 'networkidle' })
    const h1 = await page.evaluate(() => document.querySelector('h1')?.textContent)
    check(!/the menu\.$/.test(h1 ?? ''), `${href} -> ${h1}`)
  }
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

async function desktopInteractions(context) {
  console.log('\n== Desktop interactions ==')
  const page = await context.newPage()
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await wait(1500)

  await page.keyboard.press('Tab')
  const first = await page.evaluate(() => document.activeElement?.textContent?.trim())
  check(first === 'Skip to content', `first tab stop: ${first}`)

  const tone = () => page.evaluate(() => document.querySelector('.site-header').className)
  check((await tone()).includes('site-header--dark'), 'header is light-on-dark over the hero')

  await page.click('.hero .btn')
  await wait(1800)
  const top = await page.evaluate(() => document.getElementById('categories').getBoundingClientRect().top)
  check(Math.abs(top) < 120, `hero CTA scrolls to categories (top=${Math.round(top)})`)
  const into = (sel) =>
    page.evaluate((s) => {
      const el = document.querySelector(s)
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + 200, behavior: 'instant' })
    }, sel)
  await into('#categories')
  await wait(500)
  const cls = await tone()
  check(cls.includes('is-scrolled') && cls.includes('site-header--light'), `header over ivory section: ${cls}`)

  await page.evaluate(() => window.scrollTo({ top: window.scrollY + 1200, behavior: 'instant' }))
  await wait(400)
  check((await tone()).includes('is-hidden'), 'header hides while scrolling down')
  await page.evaluate(() => window.scrollTo({ top: window.scrollY - 300, behavior: 'instant' }))
  await wait(400)
  check(!(await tone()).includes('is-hidden'), 'header returns on scroll up')

  await into('.interlude')
  await wait(500)
  check((await tone()).includes('site-header--dark'), 'header switches to dark over the interlude')

  // Collection filtering
  await page.evaluate(() => document.getElementById('collection').scrollIntoView({ behavior: 'instant' }))
  await wait(600)
  const cards = () => page.$$eval('#collection .collection__grid > li h3', (els) => els.map((e) => e.textContent))
  check((await cards()).length === 5, 'collection shows 5 categories')
  check((await page.$$('#collection input[type="search"]')).length === 0, 'search hidden until the catalogue is large enough')
  const collection = page.locator('#collection')
  await collection.getByRole('button', { name: 'Dosa mixes', exact: true }).click()
  await wait(900)
  let c = await cards()
  check(c.length === 1 && c[0] === 'Dosa mixes', `filter Dosa mixes -> ${c.join(', ')}`)
  const count = await page.textContent('#collection .collection__count')
  check(count.includes('1 category'), `live count "${count}"`)
  await collection.getByRole('button', { name: 'Dosa mixes', exact: true }).click()
  await wait(900)
  check((await cards()).length === 5, 'clicking the active chip clears the filter')
  await collection.getByRole('button', { name: 'Pancake blends', exact: true }).click()
  await wait(500)
  await collection.getByRole('button', { name: 'All', exact: true }).click()
  await wait(900)
  check((await cards()).length === 5, '"All" restores every category')

  // Navigation + page transition (scroll up so the auto-hiding header returns)
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await wait(500)
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Flours' }).click()
  await page.waitForURL('**/products/millet-flours')
  await wait(1400)
  const after = await page.evaluate(() => ({
    h1: document.querySelector('h1')?.textContent,
    y: window.scrollY,
    current: document.querySelector('.site-nav [aria-current="page"]')?.textContent,
    title: document.title,
  }))
  check(after.h1 === 'Millet flours.' && after.y < 5 && after.current === 'Flours', `nav -> ${JSON.stringify(after)}`)

  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Breakfast' }).click()
  await page.waitForURL('**/products/breakfast')
  await wait(1400)
  check((await page.textContent('h1')) === 'Breakfast collection.', 'Breakfast collection page')

  // URL-synced filters on /products
  await page.goto(BASE + '/products', { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Millet pasta', exact: true }).click()
  await wait(300)
  const url = page.url()
  await page.reload({ waitUntil: 'networkidle' })
  await wait(900)
  const restored = await page.evaluate(() => ({
    pressed: document.querySelector('.chip[aria-pressed="true"]')?.textContent,
    cards: document.querySelectorAll('.collection__grid > li').length,
  }))
  check(restored.pressed === 'Millet pasta' && restored.cards === 1, `URL sync ${url.replace(BASE, '')} ${JSON.stringify(restored)}`)

  // Keyboard operation of chips + visible focus
  await page.goto(BASE + '/products', { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Pancake blends', exact: true }).focus()
  await page.keyboard.press('Enter')
  await wait(800)
  check((await page.$$('.collection__grid > li')).length === 1, 'chip toggles with keyboard')
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle)
  check(outline !== 'none', `visible focus outline (${outline})`)

  // Image failure shows the designed fallback rather than an empty box
  const failing = await context.newPage()
  await failing.route('**/images/cat-dosa-*.webp', (r) => r.abort())
  await failing.goto(BASE + '/products/dosa-mixes', { waitUntil: 'networkidle' })
  await wait(1200)
  const fb = await failing.evaluate(() => ({
    fallbacks: document.querySelectorAll('.img__fallback').length,
    label: document.querySelector('.img__fallback')?.getAttribute('aria-label'),
  }))
  check(fb.fallbacks >= 1 && !!fb.label, `failed image shows fallback (${fb.fallbacks}, labelled)`)
  await failing.close()

  await page.close()
}

async function mobileInteractions(context) {
  console.log('\n== Mobile menu ==')
  const page = await context.newPage()
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await wait(1200)
  const toggle = page.locator('.menu-toggle')
  await toggle.click()
  await wait(900)
  let s = await page.evaluate(() => ({
    expanded: document.querySelector('.menu-toggle').getAttribute('aria-expanded'),
    dialog: !!document.querySelector('#mobile-menu'),
    focused: document.activeElement?.textContent,
    inert: document.getElementById('main-content').hasAttribute('inert'),
    locked: document.body.classList.contains('is-locked'),
    toggleVisible: document.querySelector('.menu-toggle').getBoundingClientRect().top >= 0,
  }))
  check(s.expanded === 'true' && s.dialog && s.inert && s.locked && s.toggleVisible, `menu opens ${JSON.stringify(s)}`)

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
  await page.locator('#mobile-menu').getByRole('link', { name: /Pasta/ }).click()
  await page.waitForURL('**/products/millet-pasta')
  await wait(1400)
  s = await page.evaluate(() => ({
    dialog: !!document.querySelector('#mobile-menu'),
    h1: document.querySelector('h1')?.textContent,
    locked: document.body.classList.contains('is-locked'),
  }))
  check(!s.dialog && s.h1 === 'Millet pasta.' && !s.locked, `menu link navigates and closes ${JSON.stringify(s)}`)

  const small = await page.evaluate(() =>
    [...document.querySelectorAll('a, button')]
      .filter((el) => el.offsetParent && !el.closest('.site-footer__columns, .breadcrumbs, .gallery__caption, .hero__index'))
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
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await scrollThrough(page)
  const state = await page.evaluate(() => ({
    hiddenImgs: [...document.querySelectorAll('.img img')].filter((i) => getComputedStyle(i).opacity !== '1').length,
    clipped: [...document.querySelectorAll('.mask-reveal')].filter((m) => (m.style.clipPath || '').includes('100%')).length,
    offsetLines: [...document.querySelectorAll('.line-reveal__inner')].filter((l) => (l.style.transform || '').includes('115')).length,
  }))
  check(!state.hiddenImgs && !state.clipped && !state.offsetLines, `content fully visible with reduced motion ${JSON.stringify(state)}`)
  await context.close()
}

const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } })
await auditRoutes(desktop, 'desktop')
await vitals(desktop, 'desktop')
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
await mobile.close()

await reducedMotion()
await browser.close()

console.log(`\n${problems.length ? `${problems.length} problem(s)` : 'All checks passed'}`)
process.exit(problems.length ? 1 : 0)
