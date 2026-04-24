/**
 * Generate branded Econa PWA icons (192×192 and 512×512)
 * Dark void (#1C1C2E) background with flame-gold "E" in Cinzel style
 * Uses raw PNG encoding — no external dependencies required.
 */

import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// --- Minimal PNG encoder ---
function crc32(buf) {
  const table = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let j = 0; j < 8; j++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : (c >>> 1)
    table[i] = c
  }
  let crc = 0xffffffff
  for (const b of buf) crc = table[(crc ^ b) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function adler32(buf) {
  let s1 = 1, s2 = 0
  for (const b of buf) { s1 = (s1 + b) % 65521; s2 = (s2 + s1) % 65521 }
  return (s2 << 16) | s1
}

function deflate(data) {
  // Store method (no compression) — valid zlib/deflate
  const chunks = []
  const chunkSize = 65535
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize)
    const last = i + chunkSize >= data.length ? 1 : 0
    chunks.push(new Uint8Array([last, chunk.length & 0xff, (chunk.length >> 8) & 0xff, (~chunk.length) & 0xff, (~chunk.length >> 8) & 0xff]))
    chunks.push(chunk)
  }
  const adl = adler32(data)
  const header = new Uint8Array([0x78, 0x01]) // zlib header
  const trailer = new Uint8Array([adl >> 24, (adl >> 16) & 0xff, (adl >> 8) & 0xff, adl & 0xff])
  const total = chunks.reduce((s, c) => s + c.length, 0)
  const out = new Uint8Array(2 + total + 4)
  out.set(header, 0)
  let off = 2
  for (const c of chunks) { out.set(c, off); off += c.length }
  out.set(trailer, off)
  return out
}

function uint32be(n) {
  return new Uint8Array([(n >> 24) & 0xff, (n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff])
}

function pngChunk(type, data) {
  const typeBytes = new TextEncoder().encode(type)
  const len = uint32be(data.length)
  const content = new Uint8Array(typeBytes.length + data.length)
  content.set(typeBytes); content.set(data, 4)
  const crc = uint32be(crc32(content))
  const out = new Uint8Array(4 + 4 + data.length + 4)
  out.set(len); out.set(typeBytes, 4); out.set(data, 8); out.set(crc, 8 + data.length)
  return out
}

function encodePNG(pixels, size) {
  // pixels: Uint8Array of RGBA values, row by row
  const sig = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])

  // IHDR
  const ihdr = new Uint8Array(13)
  const dv = new DataView(ihdr.buffer)
  dv.setUint32(0, size); dv.setUint32(4, size)
  ihdr[8] = 8  // bit depth
  ihdr[9] = 2  // color type: RGB
  // compression, filter, interlace = 0

  // Raw pixel data with filter byte per row (filter 0 = none)
  const raw = new Uint8Array(size * (1 + size * 3))
  for (let y = 0; y < size; y++) {
    raw[y * (1 + size * 3)] = 0 // filter none
    for (let x = 0; x < size; x++) {
      const si = (y * size + x) * 4
      const di = y * (1 + size * 3) + 1 + x * 3
      raw[di] = pixels[si]
      raw[di + 1] = pixels[si + 1]
      raw[di + 2] = pixels[si + 2]
      // alpha ignored in RGB mode (background is opaque)
    }
  }

  const idat = deflate(raw)
  const iend = new Uint8Array(0)

  const ihdrChunk = pngChunk('IHDR', ihdr)
  const idatChunk = pngChunk('IDAT', idat)
  const iendChunk = pngChunk('IEND', iend)

  const out = new Uint8Array(sig.length + ihdrChunk.length + idatChunk.length + iendChunk.length)
  let off = 0
  out.set(sig, off); off += sig.length
  out.set(ihdrChunk, off); off += ihdrChunk.length
  out.set(idatChunk, off); off += idatChunk.length
  out.set(iendChunk, off)
  return out
}

// --- Icon rasterizer ---
// Renders a simple flame-torch icon:
// Background: void #1C1C2E
// A large "E" letterform in Cinzel style at center in flame gold #E8981D

function renderIcon(size) {
  const pixels = new Uint8Array(size * size * 4)
  const bg = [0x1C, 0x1C, 0x2E]
  const gold = [0xE8, 0x98, 0x1D]
  const goldLight = [0xF5, 0xC8, 0x4A] // spark highlight

  // Fill background
  for (let i = 0; i < size * size; i++) {
    pixels[i * 4] = bg[0]
    pixels[i * 4 + 1] = bg[1]
    pixels[i * 4 + 2] = bg[2]
    pixels[i * 4 + 3] = 255
  }

  function setPixel(x, y, r, g, b) {
    if (x < 0 || x >= size || y < 0 || y >= size) return
    const i = (y * size + x) * 4
    pixels[i] = r; pixels[i + 1] = g; pixels[i + 2] = b; pixels[i + 3] = 255
  }

  function fillRect(x, y, w, h, r, g, b) {
    for (let dy = 0; dy < h; dy++)
      for (let dx = 0; dx < w; dx++)
        setPixel(x + dx, y + dy, r, g, b)
  }

  function fillCircle(cx, cy, radius, r, g, b) {
    for (let dy = -radius; dy <= radius; dy++)
      for (let dx = -radius; dx <= radius; dx++)
        if (dx * dx + dy * dy <= radius * radius)
          setPixel(cx + dx, cy + dy, r, g, b)
  }

  // Draw a stylized flame torch shape
  // Center of canvas
  const cx = Math.floor(size / 2)
  const cy = Math.floor(size / 2)

  // Scale factor
  const s = size / 192

  // ---- Flame body (teardrop shape pointing upward) ----
  // Base of flame (wide oval)
  const flameBaseR = Math.round(38 * s)
  const flameCenterY = Math.round(cy + 12 * s)

  // Draw flame as stacked ellipses that narrow toward the top
  for (let dy = -Math.round(70 * s); dy <= Math.round(30 * s); dy++) {
    // Width narrows as we go up
    const t = (dy + Math.round(70 * s)) / (Math.round(100 * s)) // 0 at top, 1 at bottom
    const w = Math.round(flameBaseR * Math.sqrt(t) * (1 - (1 - t) * 0.3))
    const y = flameCenterY + dy

    // Gradient: goldLight at tip, gold in middle, ember at base
    let r, g, b
    if (t < 0.2) {
      // Tip — spark yellow
      r = goldLight[0]; g = goldLight[1]; b = goldLight[2]
    } else if (t < 0.6) {
      // Middle — gold
      const blend = (t - 0.2) / 0.4
      r = Math.round(goldLight[0] + (gold[0] - goldLight[0]) * blend)
      g = Math.round(goldLight[1] + (gold[1] - goldLight[1]) * blend)
      b = Math.round(goldLight[2] + (gold[2] - goldLight[2]) * blend)
    } else {
      // Base — ember
      const blend = (t - 0.6) / 0.4
      r = Math.round(gold[0] + (0xC4 - gold[0]) * blend)
      g = Math.round(gold[1] + (0x62 - gold[1]) * blend)
      b = Math.round(gold[2] + (0x1A - gold[2]) * blend)
    }

    fillRect(cx - w, y, w * 2, 1, r, g, b)
  }

  // Inner dark core for depth
  for (let dy = Math.round(5 * s); dy <= Math.round(28 * s); dy++) {
    const t = (dy - Math.round(5 * s)) / (Math.round(23 * s))
    const innerW = Math.round(18 * s * Math.sqrt(t))
    const y = flameCenterY + dy - Math.round(20 * s)
    // Slightly darkened gold
    fillRect(cx - innerW, y, innerW * 2, 1, Math.round(gold[0] * 0.6), Math.round(gold[1] * 0.6), Math.round(gold[2] * 0.6))
  }

  // ---- Torch handle (vertical rect below flame center) ----
  const handleW = Math.round(14 * s)
  const handleTop = flameCenterY + Math.round(28 * s)
  const handleH = Math.round(40 * s)
  fillRect(cx - Math.round(handleW / 2), handleTop, handleW, handleH, gold[0], gold[1], gold[2])

  // Handle grip lines
  const gripW = Math.round(handleW * 0.7)
  for (let i = 0; i < 4; i++) {
    const gy = handleTop + Math.round((i + 1) * (handleH / 5))
    fillRect(cx - Math.round(gripW / 2), gy, gripW, Math.round(1.5 * s), bg[0], bg[1], bg[2])
  }

  // Torch base cap
  const capW = Math.round(20 * s)
  const capH = Math.round(8 * s)
  fillRect(cx - Math.round(capW / 2), handleTop + handleH - capH, capW, capH, 0xC4, 0x62, 0x1A)

  // ---- Subtle corner ornaments (4 dots) ----
  const margin = Math.round(18 * s)
  const dotR = Math.round(3 * s)
  fillCircle(margin, margin, dotR, gold[0], gold[1], gold[2])
  fillCircle(size - margin, margin, dotR, gold[0], gold[1], gold[2])
  fillCircle(margin, size - margin, dotR, gold[0], gold[1], gold[2])
  fillCircle(size - margin, size - margin, dotR, gold[0], gold[1], gold[2])

  // Thin border ring
  const borderW = Math.max(1, Math.round(2 * s))
  for (let i = 0; i < borderW; i++) {
    for (let x = i; x < size - i; x++) {
      setPixel(x, i, 0x2A, 0x2A, 0x42)
      setPixel(x, size - 1 - i, 0x2A, 0x2A, 0x42)
    }
    for (let y = i; y < size - i; y++) {
      setPixel(i, y, 0x2A, 0x2A, 0x42)
      setPixel(size - 1 - i, y, 0x2A, 0x2A, 0x42)
    }
  }

  return pixels
}

function generateIcon(size, outPath) {
  const pixels = renderIcon(size)
  const png = encodePNG(pixels, size)
  writeFileSync(outPath, png)
  console.log(`Generated ${size}×${size} icon → ${outPath} (${png.length} bytes)`)
}

const publicDir = resolve(__dirname, '../public')
generateIcon(192, resolve(publicDir, 'icon-192.png'))
generateIcon(512, resolve(publicDir, 'icon-512.png'))
console.log('Icons generated successfully.')
