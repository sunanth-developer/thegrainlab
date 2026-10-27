import { chromium } from 'playwright-core'
import { mkdir, rm } from 'node:fs/promises'
import { createRequire } from 'node:module'
const sharp = createRequire(import.meta.url)('../node_modules/sharp')

const BASE = process.env.BASE ?? 'http://localhost:5281'
const OUT = new URL('./shots/', import.meta.url).pathname
const only = process.argv.slice(2)
await rm(OUT, { recursive: true, force: true })
await mkdir(OUT, { recursive: true })

const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
})
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

async function settle(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 300) {
      window.scrollTo({ top: y, behavior: 'instant' })
      await new Promise((r) => setTimeout(r, 90))
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
    const end = Date.now() + 8000
    while (Date.now() < end && [...document.images].some((i) => !i.complete)) {
      await new Promise((r) => setTimeout(r, 100))
    }
  })
  await wait(1600)
}

async function split(file, name, segment) {
  const img = sharp(file)
  const { width, height } = await img.metadata()
  let i = 0
  for (let y = 0; y < height; y += segment) {
    await sharp(file)
      .extract({ left: 0, top: y, width, height: Math.min(segment, height - y) })
      .resize({ width: Math.min(width, 900) })
      .jpeg({ quality: 74 })
      .toFile(`${OUT}${name}-${i++}.jpg`)
  }
}

const jobs = [
  { name: 'd-home', url: '/', vp: [1440, 900], full: true },
  { name: 'm-home', url: '/', vp: [390, 844], mobile: true, full: true },
  { name: 't-home', url: '/', vp: [820, 1180], full: true },
  { name: 'd-products', url: '/products', vp: [1440, 900], full: true },
  { name: 'd-pancakes', url: '/pancake-mixes', vp: [1440, 900], full: true },
  { name: 'd-vanilla', url: '/products/vanilla-protein-pancake-mix', vp: [1440, 900], full: true },
  { name: 'd-chocolate', url: '/products/chocolate-protein-pancake-mix', vp: [1440, 900] },
  { name: 'd-idli', url: '/products/millet-idli-mix', vp: [1440, 900], full: true },
  { name: 'm-idli', url: '/products/millet-idli-mix', vp: [390, 844], mobile: true, full: true },
  { name: 'm-products', url: '/products', vp: [390, 844], mobile: true, full: true },
  { name: 'd-404', url: '/nope', vp: [1440, 900] },
]

for (const job of jobs.filter((j) => !only.length || only.includes(j.name))) {
  const ctx = await browser.newContext({
    viewport: { width: job.vp[0], height: job.vp[1] },
    deviceScaleFactor: job.mobile ? 2 : 1,
    isMobile: !!job.mobile,
    hasTouch: !!job.mobile,
  })
  const page = await ctx.newPage()
  page.on('console', (m) => m.type() === 'error' && console.log(`  [${job.name}] console:`, m.text()))
  page.on('pageerror', (e) => console.log(`  [${job.name}] pageerror:`, e.message))
  await page.goto(BASE + job.url, { waitUntil: 'networkidle' })
  await wait(2600)
  await page.screenshot({ path: `${OUT}${job.name}-first.png` })
  if (job.full) {
    await settle(page)
    const file = `${OUT}${job.name}-full.png`
    await page.screenshot({ path: file, fullPage: true })
    await split(file, job.name, job.mobile ? 2400 : 1800)
  }
  await ctx.close()
  console.log('shot', job.name)
}
await browser.close()
