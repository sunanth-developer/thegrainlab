// Converts source photography in assets-src/photos into responsive WebP files
// in public/images and writes src/data/imageMeta.json (sizes + dominant colour).
// Run with: npm run images
import { readdir, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const SRC = 'assets-src/photos'
const OUT = 'public/images'
const META = 'src/data/imageMeta.json'
const WIDTHS = [480, 800, 1280]

await mkdir(OUT, { recursive: true })

const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort()
const meta = {}

for (const file of files) {
  const name = path.parse(file).name
  const input = sharp(path.join(SRC, file))
  const { width, height } = await input.metadata()
  const { dominant } = await input.stats()

  // Never upscale; the native width is always the largest variant.
  const widths = [...new Set(WIDTHS.filter((w) => w < width).concat(Math.min(width, 1280)))]

  for (const w of widths) {
    await input
      .clone()
      .resize({ width: w })
      .webp({ quality: 80, effort: 5 })
      .toFile(path.join(OUT, `${name}-${w}.webp`))
  }

  const hex = (n) => n.toString(16).padStart(2, '0')
  meta[name] = { width, height, widths, color: `#${hex(dominant.r)}${hex(dominant.g)}${hex(dominant.b)}` }
  console.log(`${name}: ${widths.join(', ')}`)
}

await writeFile(META, `${JSON.stringify(meta, null, 2)}\n`)
