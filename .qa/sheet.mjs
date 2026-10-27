import { readdir } from 'node:fs/promises'
import { createRequire } from 'node:module'
const sharp = createRequire(import.meta.url)('../node_modules/sharp')
const [prefix, per = '6', tw = '300'] = process.argv.slice(2)
const dir = new URL('./shots/', import.meta.url).pathname
const files = (await readdir(dir)).filter((f) => f.startsWith(prefix + '-s')).sort()
const n = +per, w = +tw
for (let s = 0; s * n < files.length; s++) {
  const group = files.slice(s * n, s * n + n)
  const tiles = await Promise.all(group.map((f) => sharp(dir + f).resize({ width: w }).toBuffer({ resolveWithObject: true })))
  const h = Math.max(...tiles.map((t) => t.info.height))
  await sharp({ create: { width: w * group.length + 8 * (group.length - 1), height: h, channels: 3, background: '#888' } })
    .composite(tiles.map((t, i) => ({ input: t.data, left: i * (w + 8), top: 0 })))
    .jpeg({ quality: 78 }).toFile(`${dir}${prefix}-sheet${s}.jpg`)
}
console.log('sheets', Math.ceil(files.length / n))
