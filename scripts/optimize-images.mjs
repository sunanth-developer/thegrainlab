// Converts source images into responsive WebP files in public/images and writes
// src/data/imageMeta.json (sizes + dominant colour).
//   assets-src/photos       photography (opaque)
//   assets-src/brand        logo and packaging artwork (alpha kept)
//   assets-src/ingredients  ingredient photography → public/images/ingredients/,
//                           keyed "ingredients/<name>"
// Run with: npm run images            (everything)
//           npm run images -- --only ingredients
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const OUT = 'public/images'
const META = 'src/data/imageMeta.json'

const SOURCES = [
  { id: 'photos', dir: 'assets-src/photos', widths: [480, 800, 1280], webp: { quality: 80, effort: 5 } },
  { id: 'brand', dir: 'assets-src/brand', widths: [240, 480, 960, 1440], webp: { quality: 90, alphaQuality: 100, effort: 6 } },
  { id: 'ingredients', dir: 'assets-src/ingredients', prefix: 'ingredients/', widths: [240, 480, 864], webp: { quality: 80, effort: 5 } },
]

const onlyArg = process.argv.indexOf('--only')
const only = onlyArg > -1 ? process.argv[onlyArg + 1] : null

// Keep entries for sources that are not rebuilt in this run.
const meta = only ? JSON.parse(await readFile(META, 'utf8')) : {}

for (const { id, dir, prefix = '', widths: targets, webp } of SOURCES) {
  if (only && id !== only) continue
  await mkdir(path.join(OUT, prefix), { recursive: true })
  const files = (await readdir(dir)).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort()

  for (const file of files) {
    const name = path.parse(file).name
    const key = `${prefix}${name}`
    const input = sharp(path.join(dir, file))
    const { width, height } = await input.metadata()
    const { dominant } = await input.stats()

    // Never upscale; the native width is always the largest variant.
    const max = targets[targets.length - 1]
    const widths = [...new Set(targets.filter((w) => w < width).concat(Math.min(width, max)))]

    for (const w of widths) {
      await input.clone().resize({ width: w }).webp(webp).toFile(path.join(OUT, `${key}-${w}.webp`))
    }

    const hex = (n) => n.toString(16).padStart(2, '0')
    meta[key] = { width, height, widths, color: `#${hex(dominant.r)}${hex(dominant.g)}${hex(dominant.b)}` }
    console.log(`${key}: ${widths.join(', ')}`)
  }
}

const sorted = Object.fromEntries(Object.entries(meta).sort(([a], [b]) => a.localeCompare(b)))
await writeFile(META, `${JSON.stringify(sorted, null, 2)}\n`)
