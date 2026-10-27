// Viewport screenshots at real scroll positions (sticky / scroll-linked scenes
// do not render correctly in full-page captures).
// Usage: node scenes.mjs <name> <path> <width> <height> [mobile]
import { chromium } from 'playwright-core'
import { mkdir } from 'node:fs/promises'

const BASE = process.env.BASE ?? 'http://localhost:5280'
const [name = 'scene', path = '/', w = '1440', h = '900', mobile] = process.argv.slice(2)
const OUT = new URL('./shots/', import.meta.url).pathname
await mkdir(OUT, { recursive: true })

const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
})
const ctx = await browser.newContext({
  viewport: { width: +w, height: +h },
  deviceScaleFactor: mobile ? 2 : 1,
  isMobile: !!mobile,
  hasTouch: !!mobile,
})
const page = await ctx.newPage()
page.on('console', (m) => m.type() === 'error' && console.log('console:', m.text()))
page.on('pageerror', (e) => console.log('pageerror:', e.message))
await page.goto(BASE + path, { waitUntil: 'networkidle' })
await page.waitForTimeout(2200)

const total = await page.evaluate(() => document.documentElement.scrollHeight)
const step = Math.round(+h * 0.85)
let i = 0
for (let y = 0; y < total; y += step) {
  await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y)
  await page.waitForTimeout(1300)
  await page.screenshot({ path: `${OUT}${name}-s${String(i++).padStart(2, '0')}.jpg`, type: 'jpeg', quality: 70 })
}
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
console.log(`${name}: ${i} shots, height ${total}, horizontal overflow ${overflow}px`)
await browser.close()
