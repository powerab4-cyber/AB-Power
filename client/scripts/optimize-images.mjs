import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const imagesDir = path.resolve(__dirname, '../public/images')

const EXTENSIONS = new Set(['.jpg', '.jpeg', '.jfif', '.png'])

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...(await walk(full)))
    else files.push(full)
  }
  return files
}

async function main() {
  const files = (await walk(imagesDir)).filter((f) => EXTENSIONS.has(path.extname(f).toLowerCase()))

  for (const file of files) {
    const out = path.join(path.dirname(file), path.basename(file, path.extname(file)) + '.webp')
    try {
      const img = sharp(file)
      const meta = await img.metadata()
      const width = meta.width && meta.width > 1920 ? 1920 : undefined

      let pipeline = img
      if (width) pipeline = pipeline.resize({ width, withoutEnlargement: true })

      await pipeline.webp({ quality: 80, effort: 4 }).toFile(out)
      console.log(`optimized: ${path.relative(imagesDir, out)}`)
    } catch (err) {
      console.error(`failed: ${file}`, err.message)
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
