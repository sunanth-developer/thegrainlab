// Hero geometry: the pack and photo must not overlap the headline or copy, and
// the two actions must line up on small screens.
import { chromium } from 'playwright-core'

const BASE = process.env.BASE ?? 'http://localhost:5280'
const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
})
let failed = 0
const sizes = [[320, 700, true], [360, 780, true], [390, 844, true], [600, 960], [820, 1180], [900, 800], [1024, 768], [1280, 800], [1440, 900], [1920, 1080]]

for (const [w, h, mobile] of sizes) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, isMobile: !!mobile, hasTouch: !!mobile })
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(2600)
  const r = await page.evaluate(() => {
    const rect = (el) => el.getBoundingClientRect()
    const hit = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
    const texts = [...document.querySelectorAll('.hero__copy .line-reveal__inner, .hero__copy p, .hero__actions a')].map(rect)
    const packs = [...document.querySelectorAll('.hero__packs .pack')].map(rect)
    const photo = rect(document.querySelector('.hero__photo'))
    const btns = [...document.querySelectorAll('.hero__actions a')].map(rect)
    return {
      packs: packs.length,
      packOverText: texts.some((t) => packs.some((p) => hit(t, p))),
      photoOverText: texts.some((t) => hit(t, photo)),
      lines: document.querySelectorAll('.hero__title .line-reveal__line').length,
      lineHeights: [...document.querySelectorAll('.hero__title .line-reveal__line')].map((l) => Math.round(rect(l).height)),
      btns: btns.map((b) => ({ x: Math.round(b.left), w: Math.round(b.width), h: Math.round(b.height) })),
      overflow: document.documentElement.scrollWidth - innerWidth,
    }
  })
  const [a, b] = r.btns
  const stacked = a && b && a.x === b.x
  const aligned = r.btns.length === 2 && a.h === b.h && a.w === b.w && (!stacked || a.x === b.x)
  const okay = r.packs === 3 && !r.packOverText && !r.photoOverText && aligned && r.overflow <= 0
  if (!okay) failed++
  console.log(`${okay ? 'ok  ' : 'FAIL'} ${w}x${h}`, JSON.stringify(r))
  if (w === 1440 || w === 1280 || w === 390) await page.screenshot({ path: new URL(`./shots/hero-${w}.png`, import.meta.url).pathname })
  await page.close()
}
await browser.close()
process.exit(failed ? 1 : 0)
