import { describe, expect, it } from 'vitest'
import type { ShalatData } from '../types.ts'
import { getData, getSectionById, getReadingById } from '../data/index.ts'
import rawData from '../data/shalat.generated.json'

const data: ShalatData = rawData as ShalatData

const EXPECTED_COUNTS: Record<string, number> = {
  doa_istiftah: 12,
  taawudz: 3,
  rukuk: 7,
  itidal: 12,
  sujud: 10,
  duduk_antara_dua_sujud: 4,
  tasyahhud: 7,
  shalawat_setelah_tasyahhud: 6,
  doa_sebelum_salam: 14,
  salam: 4,
}

const HELD_IDS = ['rukuk-02', 'sujud-02', 'duduk-dua-sujud-05', 'salam-05']

const MULTI_SEGMENT_IDS = ['istiftah-01', 'salam-02', 'salam-04']

describe('Generated shalat data', () => {
  it('has exactly 10 sections in the correct order', () => {
    expect(data.sections).toHaveLength(10)
    data.sections.forEach((section, index) => {
      expect(section.order).toBe(index + 1)
    })
  })

  it('has exactly 79 published readings', () => {
    const totalReadings = data.sections.reduce((sum, section) => sum + section.readings.length, 0)
    expect(totalReadings).toBe(79)
  })

  it('has exactly 82 published segments', () => {
    const totalSegments = data.sections.reduce(
      (sum, section) => sum + section.readings.reduce((s, reading) => s + reading.segments.length, 0),
      0,
    )
    expect(totalSegments).toBe(82)
  })

  it('excludes the four held reading IDs', () => {
    const allReadingIds = data.sections.flatMap((section) => section.readings.map((reading) => reading.id))
    for (const heldId of HELD_IDS) {
      expect(allReadingIds).not.toContain(heldId)
    }
  })

  it('matches the published count per section', () => {
    for (const section of data.sections) {
      expect(section.publishedCount).toBe(EXPECTED_COUNTS[section.id])
      expect(section.readings).toHaveLength(EXPECTED_COUNTS[section.id])
    }
  })

  it('orders readings by source order within each section', () => {
    for (const section of data.sections) {
      section.readings.forEach((reading, index) => {
        expect(reading.displayOrder).toBe(index + 1)
      })
      const sourceOrders = section.readings.map((reading) => reading.sourceOrder)
      const sorted = [...sourceOrders].sort((a, b) => a - b)
      expect(sourceOrders).toEqual(sorted)
    }
  })

  it('preserves multi-segment readings in the correct order', () => {
    for (const bacaanId of MULTI_SEGMENT_IDS) {
      const reading = data.sections
        .flatMap((section) => section.readings)
        .find((r) => r.id === bacaanId)
      expect(reading).toBeDefined()
      expect(reading!.segments.length).toBeGreaterThan(1)
      reading!.segments.forEach((segment, index) => {
        expect(segment.order).toBe(index + 1)
      })
    }
  })

  it('ensures every published reading has at least one segment', () => {
    for (const section of data.sections) {
      for (const reading of section.readings) {
        expect(reading.segments.length).toBeGreaterThan(0)
      }
    }
  })

  it('ensures every segment has arabic, transliteration, and meaning', () => {
    for (const section of data.sections) {
      for (const reading of section.readings) {
        for (const segment of reading.segments) {
          expect(segment.arabic).toBeTruthy()
          expect(segment.transliteration).toBeTruthy()
          expect(segment.meaning).toBeTruthy()
        }
      }
    }
  })

  it('exposes the same data through getData', () => {
    expect(getData()).toBe(data)
  })

  it('finds a section by id', () => {
    expect(getSectionById('rukuk')?.name).toBe('Rukuk')
    expect(getSectionById('tidak-ada')).toBeUndefined()
  })

  it('finds a reading by section and reading id', () => {
    const reading = getReadingById('rukuk', 'rukuk-01')
    expect(reading).toBeDefined()
    expect(reading?.displayOrder).toBe(1)
    expect(getReadingById('rukuk', 'rukuk-02')).toBeUndefined()
    expect(getReadingById('tidak-ada', 'rukuk-01')).toBeUndefined()
  })
})
