import * as fs from 'node:fs'
import * as path from 'node:path'
import sharp from 'sharp'

const ROOT = process.cwd()
const PUBLIC_DIR = path.join(ROOT, 'public')

const ICON_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="104" fill="#33473B"/>
  <g fill="#FFFEFA">
    <path d="M248 348c-36-18-80-18-116 0V158c36-18 80-18 116 0v190z"/>
    <path d="M264 158c36-18 80-18 116 0v190c-36-18-80-18-116 0V158z"/>
    <rect x="248" y="148" width="16" height="216" rx="4"/>
  </g>
</svg>`

const MASKABLE_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#33473B"/>
  <g fill="#FFFEFA" transform="translate(0, 12) scale(0.85)" transform-origin="center">
    <path d="M248 348c-36-18-80-18-116 0V158c36-18 80-18 116 0v190z"/>
    <path d="M264 158c36-18 80-18 116 0v190c-36-18-80-18-116 0V158z"/>
    <rect x="248" y="148" width="16" height="216" rx="4"/>
  </g>
</svg>`

async function generate(): Promise<void> {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true })

  const sharpIcon = sharp(Buffer.from(ICON_SVG))
  const sharpMaskable = sharp(Buffer.from(MASKABLE_SVG))

  await sharpIcon.resize(192, 192).png().toFile(path.join(PUBLIC_DIR, 'icon-192.png'))
  await sharpIcon.resize(512, 512).png().toFile(path.join(PUBLIC_DIR, 'icon-512.png'))
  await sharpMaskable.resize(512, 512).png().toFile(path.join(PUBLIC_DIR, 'icon-maskable.png'))
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.svg'), ICON_SVG)

  console.log('[generate-icons] Ikon PWA berhasil dibuat.')
}

generate().catch((error) => {
  console.error('[generate-icons] Gagal membuat ikon:', error)
  process.exit(1)
})
