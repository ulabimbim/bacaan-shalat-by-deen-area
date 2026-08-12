import * as fs from 'node:fs'
import * as path from 'node:path'
import XLSX from 'xlsx'

const ROOT = process.cwd()
const INPUT_PATH = path.join(ROOT, 'data', 'source', 'Database_Variasi_Bacaan_Shalat_Terkurasi.xlsx')
const OUTPUT_PATH = path.join(ROOT, 'src', 'data', 'shalat.generated.json')

const SHEET_SECTIONS = 'Bagian Shalat'
const SHEET_READINGS = 'Variasi Bacaan'
const SHEET_SEGMENTS = 'Teks Bacaan'

const REQUIRED_SECTION_COLUMNS = ['urutan', 'bagian_id', 'nama_bagian', 'jumlah_variasi']
const REQUIRED_READING_COLUMNS = [
  'bacaan_id',
  'urutan_variasi',
  'bagian_id',
  'subkategori',
  'rujukan_hadis',
  'keterangan',
  'konteks_penggunaan',
  'sumber_referensi',
  'url_sumber',
  'url_verifikasi',
  'siap_publish',
]
const REQUIRED_SEGMENT_COLUMNS = ['teks_id', 'bacaan_id', 'urutan_segmen', 'label_segmen', 'teks_arab', 'transliterasi', 'arti']

const HELD_IDS = new Set(['rukuk-02', 'sujud-02', 'duduk-dua-sujud-05', 'salam-05'])
const PRODUCT_EXCLUDED_IDS = new Set(['salam-01', 'salam-02'])

interface RawSection {
  urutan: number
  bagian_id: string
  nama_bagian: string
  jumlah_variasi: number
}

interface RawReading {
  bacaan_id: string
  urutan_variasi: number
  bagian_id: string
  subkategori: string | null
  rujukan_hadis: string | null
  keterangan: string | null
  konteks_penggunaan: string | null
  sumber_referensi: string | null
  url_sumber: string | null
  url_verifikasi: string | null
  siap_publish: string
}

interface RawSegment {
  teks_id: string
  bacaan_id: string
  urutan_segmen: number
  label_segmen: string | null
  teks_arab: string
  transliterasi: string
  arti: string
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`[generate-data] ${message}`)
  }
}

function normalizeCell(value: unknown): string | null {
  if (value === null || value === undefined) return null
  if (typeof value === 'string') return value.trim() === '' ? null : value.trim()
  if (typeof value === 'number') return String(value)
  return String(value)
}

function normalizeNumber(value: unknown): number {
  if (typeof value === 'number') return value
  const str = normalizeCell(value)
  if (str === null) return NaN
  const parsed = Number(str)
  return Number.isFinite(parsed) ? parsed : NaN
}

function readSheet<T>(workbook: XLSX.WorkBook, name: string): T[] {
  const sheet = workbook.Sheets[name]
  assert(sheet, `Sheet "${name}" tidak ditemukan dalam workbook.`)
  return XLSX.utils.sheet_to_json<T>(sheet, { defval: null })
}

function validateColumns(row: Record<string, unknown>, required: string[], sheetName: string): void {
  const present = Object.keys(row)
  const missing = required.filter((col) => !present.includes(col))
  assert(missing.length === 0, `Kolom wajib hilang di sheet "${sheetName}": ${missing.join(', ')}`)
}

function parseSections(rows: Record<string, unknown>[]): RawSection[] {
  assert(rows.length > 0, `Sheet "${SHEET_SECTIONS}" kosong.`)
  validateColumns(rows[0] as Record<string, unknown>, REQUIRED_SECTION_COLUMNS, SHEET_SECTIONS)

  const sections: RawSection[] = []
  const ids = new Set<string>()

  for (const row of rows) {
    const id = normalizeCell(row.bagian_id)
    assert(id, `Sheet "${SHEET_SECTIONS}" memiliki baris dengan bagian_id kosong.`)
    assert(!ids.has(id), `bagian_id duplikat: "${id}"`)
    ids.add(id)

    const order = normalizeNumber(row.urutan)
    assert(Number.isFinite(order), `urutan tidak valid untuk bagian_id "${id}"`)

    sections.push({
      urutan: order,
      bagian_id: id,
      nama_bagian: normalizeCell(row.nama_bagian) ?? id,
      jumlah_variasi: normalizeNumber(row.jumlah_variasi),
    })
  }

  return sections.sort((a, b) => a.urutan - b.urutan)
}

function parseReadings(rows: Record<string, unknown>[], validSectionIds: Set<string>): RawReading[] {
  assert(rows.length > 0, `Sheet "${SHEET_READINGS}" kosong.`)
  validateColumns(rows[0] as Record<string, unknown>, REQUIRED_READING_COLUMNS, SHEET_READINGS)

  const readings: RawReading[] = []
  const ids = new Set<string>()

  for (const row of rows) {
    const id = normalizeCell(row.bacaan_id)
    assert(id, `Sheet "${SHEET_READINGS}" memiliki baris dengan bacaan_id kosong.`)
    assert(!ids.has(id), `bacaan_id duplikat: "${id}"`)
    ids.add(id)

    const sectionId = normalizeCell(row.bagian_id)
    assert(sectionId, `bagian_id kosong untuk bacaan_id "${id}"`)
    assert(validSectionIds.has(sectionId), `Foreign key tidak ditemukan: bagian_id "${sectionId}" untuk bacaan_id "${id}"`)

    const order = normalizeNumber(row.urutan_variasi)
    assert(Number.isFinite(order), `urutan_variasi tidak valid untuk bacaan_id "${id}"`)

    readings.push({
      bacaan_id: id,
      urutan_variasi: order,
      bagian_id: sectionId,
      subkategori: normalizeCell(row.subkategori),
      rujukan_hadis: normalizeCell(row.rujukan_hadis),
      keterangan: normalizeCell(row.keterangan),
      konteks_penggunaan: normalizeCell(row.konteks_penggunaan),
      sumber_referensi: normalizeCell(row.sumber_referensi),
      url_sumber: normalizeCell(row.url_sumber),
      url_verifikasi: normalizeCell(row.url_verifikasi),
      siap_publish: normalizeCell(row.siap_publish) ?? '',
    })
  }

  return readings
}

function parseSegments(rows: Record<string, unknown>[], validReadingIds: Set<string>): RawSegment[] {
  assert(rows.length > 0, `Sheet "${SHEET_SEGMENTS}" kosong.`)
  validateColumns(rows[0] as Record<string, unknown>, REQUIRED_SEGMENT_COLUMNS, SHEET_SEGMENTS)

  const segments: RawSegment[] = []
  const ids = new Set<string>()

  for (const row of rows) {
    const readingId = normalizeCell(row.bacaan_id)
    if (!readingId || !validReadingIds.has(readingId)) continue


    const id = normalizeCell(row.teks_id)
    assert(id, `Sheet "${SHEET_SEGMENTS}" memiliki baris dengan teks_id kosong.`)
    assert(!ids.has(id), `teks_id duplikat: "${id}"`)
    ids.add(id)

    const order = normalizeNumber(row.urutan_segmen)
    assert(Number.isFinite(order), `urutan_segmen tidak valid untuk teks_id "${id}"`)

    const arabic = normalizeCell(row.teks_arab)
    const transliteration = normalizeCell(row.transliterasi)
    const meaning = normalizeCell(row.arti)

    assert(arabic, `Segmen "${id}" tidak memiliki teks_arab`)
    assert(transliteration, `Segmen "${id}" tidak memiliki transliterasi`)
    assert(meaning, `Segmen "${id}" tidak memiliki arti`)

    segments.push({
      teks_id: id,
      bacaan_id: readingId,
      urutan_segmen: order,
      label_segmen: normalizeCell(row.label_segmen),
      teks_arab: arabic,
      transliterasi: transliteration,
      arti: meaning,
    })
  }

  return segments.sort((a, b) => a.urutan_segmen - b.urutan_segmen)
}

function main(): void {
  assert(fs.existsSync(INPUT_PATH), `Workbook tidak ditemukan di "${INPUT_PATH}"`)

  const workbook = XLSX.readFile(INPUT_PATH)
  const sections = parseSections(readSheet<Record<string, unknown>>(workbook, SHEET_SECTIONS))
  const sectionIds = new Set(sections.map((s) => s.bagian_id))

  const allReadings = parseReadings(readSheet<Record<string, unknown>>(workbook, SHEET_READINGS), sectionIds)
  const publishedReadings = allReadings.filter(
    (r) => r.siap_publish === 'Ya' && !PRODUCT_EXCLUDED_IDS.has(r.bacaan_id),
  )
  const publishedReadingIds = new Set(publishedReadings.map((r) => r.bacaan_id))

  for (const heldId of HELD_IDS) {
    assert(!publishedReadingIds.has(heldId), `Bacaan tahan "${heldId}" masuk ke hasil publish.`)
  }

  const allSegments = parseSegments(readSheet<Record<string, unknown>>(workbook, SHEET_SEGMENTS), publishedReadingIds)

  const segmentsByReading = new Map<string, RawSegment[]>()
  for (const segment of allSegments) {
    const list = segmentsByReading.get(segment.bacaan_id) ?? []
    list.push(segment)
    segmentsByReading.set(segment.bacaan_id, list)
  }

  for (const reading of publishedReadings) {
    const segs = segmentsByReading.get(reading.bacaan_id)
    assert(segs && segs.length > 0, `Bacaan publish "${reading.bacaan_id}" tidak memiliki segmen`)
  }

  const readingsBySection = new Map<string, RawReading[]>()
  for (const reading of publishedReadings) {
    const list = readingsBySection.get(reading.bagian_id) ?? []
    list.push(reading)
    readingsBySection.set(reading.bagian_id, list)
  }

  const output = {
    version: 1,
    sections: sections
      .map((section) => {
        const sectionReadings = (readingsBySection.get(section.bagian_id) ?? []).sort(
          (a, b) => a.urutan_variasi - b.urutan_variasi,
        )

        if (sectionReadings.length === 0) {
          console.warn(`[generate-data] Peringatan: bagian "${section.bagian_id}" tidak memiliki bacaan publish.`)
        }

        return {
          id: section.bagian_id,
          order: section.urutan,
          name: section.nama_bagian,
          publishedCount: sectionReadings.length,
          readings: sectionReadings.map((reading, index) => {
            const segments = (segmentsByReading.get(reading.bacaan_id) ?? []).sort(
              (a, b) => a.urutan_segmen - b.urutan_segmen,
            )

            return {
              id: reading.bacaan_id,
              displayOrder: index + 1,
              sourceOrder: reading.urutan_variasi,
              subcategory: reading.subkategori,
              segments: segments.map((segment) => ({
                id: segment.teks_id,
                order: segment.urutan_segmen,
                label: segment.label_segmen,
                arabic: segment.teks_arab,
                transliteration: segment.transliterasi,
                meaning: segment.arti,
              })),
              reference: {
                text: reading.rujukan_hadis,
                note: reading.keterangan,
                context: reading.konteks_penggunaan,
                sourceReference: reading.sumber_referensi,
                url: reading.url_verifikasi ?? reading.url_sumber,
              },
            }
          }),
        }
      })
      .filter((section) => section.publishedCount > 0),
  }

  const totalReadings = output.sections.reduce((sum, section) => sum + section.readings.length, 0)
  const totalSegments = output.sections.reduce(
    (sum, section) => sum + section.readings.reduce((s, r) => s + r.segments.length, 0),
    0,
  )

  assert(output.sections.length === 10, `Diharapkan 10 bagian, didapat ${output.sections.length}`)
  assert(totalReadings === 81, `Diharapkan 81 bacaan production, didapat ${totalReadings}`)
  assert(totalSegments === 83, `Diharapkan 83 segmen production, didapat ${totalSegments}`)

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true })
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2))

  console.log(`[generate-data] Berhasil: ${output.sections.length} bagian, ${totalReadings} bacaan, ${totalSegments} segmen.`)
  console.log(`[generate-data] Output: ${OUTPUT_PATH}`)
}

main()
