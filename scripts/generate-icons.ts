import * as fs from 'node:fs'
import * as path from 'node:path'
import sharp from 'sharp'

const ROOT = process.cwd()
const SOURCE_PATH = path.join(ROOT, 'assets', 'Logo Bacaan Shalat.png')
const PUBLIC_DIR = path.join(ROOT, 'public')

async function writeIcon(size: number, filename: string): Promise<void> {
  await sharp(SOURCE_PATH)
    .resize(size, size, { fit: 'cover' })
    .png({ compressionLevel: 9 })
    .toFile(path.join(PUBLIC_DIR, filename))
}

async function generate(): Promise<void> {
  if (!fs.existsSync(SOURCE_PATH)) {
    throw new Error(`Logo sumber tidak ditemukan di "${SOURCE_PATH}"`)
  }

  fs.mkdirSync(PUBLIC_DIR, { recursive: true })

  await Promise.all([
    writeIcon(32, 'favicon-32.png'),
    writeIcon(180, 'apple-touch-icon.png'),
    writeIcon(192, 'icon-192.png'),
    writeIcon(512, 'icon-512.png'),
    writeIcon(512, 'icon-maskable.png'),
  ])

  console.log('[generate-icons] Logo aplikasi, favicon, dan ikon PWA berhasil dibuat.')
}

generate().catch((error) => {
  console.error('[generate-icons] Gagal membuat ikon:', error)
  process.exit(1)
})
