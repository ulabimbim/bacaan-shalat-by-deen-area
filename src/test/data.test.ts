import { describe, expect, it } from 'vitest'
import type { ShalatData } from '../types.ts'
import { getData, getSectionById, getReadingById } from '../data/index.ts'
import rawData from '../data/shalat.generated.json'

const data: ShalatData = rawData as ShalatData

const EXPECTED_COUNTS: Record<string, number> = {
  doa_istiftah: 13,
  taawudz: 3,
  rukuk: 8,
  itidal: 14,
  sujud: 11,
  duduk_antara_dua_sujud: 4,
  tasyahhud: 7,
  shalawat_setelah_tasyahhud: 7,
  doa_sebelum_salam: 14,
  salam: 2,
}

const HELD_IDS = ['duduk-dua-sujud-05', 'salam-05']
const REMOVED_SALAM_IDS = ['salam-01', 'salam-02']

const MULTI_SEGMENT_IDS = ['istiftah-01', 'salam-04']
const RUKUK_08_ARABIC =
  'اللَّهُمَّ لَكَ رَكَعْتُ وَبِكَ آمَنْتُ وَلَكَ أَسْلَمْتُ وَعَلَيْكَ تَوَكَّلْتُ، أَنْتَ رَبِّي، خَشَعَ سَمْعِي وَبَصَرِي وَدَمِي وَلَحْمِيْ وَعَظَمِي وَعَصَبِي لِلهِ رَبِّ الْعَالَمِيْنَ'
const ISTIFTAH_02_CONTEXT =
  'Doa istiftah banyak dan beragam. Rasulullah shallallahu ‘alaihi wa sallam sendiri mengganti-ganti bacaan doa istiftahnya. Terkadang membaca doa yang ini, di kali lain membaca doa yang itu. Ketika shalat fardhu beliau membaca yang satu dan ketika shalat nafilah/sunnah beliau membaca yang lainnya.'

describe('Generated shalat data', () => {
  it('has exactly 10 sections in the correct order', () => {
    expect(data.sections).toHaveLength(10)
    data.sections.forEach((section, index) => {
      expect(section.order).toBe(index + 1)
    })
  })

  it('has exactly 83 production readings', () => {
    const totalReadings = data.sections.reduce((sum, section) => sum + section.readings.length, 0)
    expect(totalReadings).toBe(83)
  })

  it('has exactly 85 production segments', () => {
    const totalSegments = data.sections.reduce(
      (sum, section) => sum + section.readings.reduce((s, reading) => s + reading.segments.length, 0),
      0,
    )
    expect(totalSegments).toBe(85)
  })

  it('excludes the remaining held reading IDs', () => {
    const allReadingIds = data.sections.flatMap((section) => section.readings.map((reading) => reading.id))
    for (const heldId of HELD_IDS) {
      expect(allReadingIds).not.toContain(heldId)
    }
  })

  it('publishes rukuk and sujud additions as variation 2', () => {
    const rukuk = data.sections.find((section) => section.id === 'rukuk')
    expect(rukuk?.readings[1].id).toBe('rukuk-02')
    expect(rukuk?.readings[1].displayOrder).toBe(2)

    const sujud = data.sections.find((section) => section.id === 'sujud')
    expect(sujud?.readings[1].id).toBe('sujud-02')
    expect(sujud?.readings[1].displayOrder).toBe(2)
  })

  it('does not publish promotional notes for the added rukuk and sujud readings', () => {
    expect(getReadingById('rukuk', 'rukuk-02')?.reference.note).toBeNull()
    expect(getReadingById('sujud', 'sujud-02')?.reference.note).toBeNull()
  })

  it('publishes the revised Arabic text for rukuk variation 8', () => {
    expect(getReadingById('rukuk', 'rukuk-08')?.segments[0].arabic).toBe(RUKUK_08_ARABIC)
  })

  it('removes usage context from the requested itidal variations', () => {
    const itidal = getSectionById('itidal')
    const clearedDisplayOrders = [1, 2, 5, 6, 7, 8, 9, 10, 11]

    for (const displayOrder of clearedDisplayOrders) {
      expect(itidal?.readings[displayOrder - 1].reference.context).toBeNull()
    }
  })

  it('revises the usage context for itidal 14 and istiftah 2', () => {
    expect(getSectionById('itidal')?.readings[13].reference.context).toBe('Sekali waktu dalam shalat malam')
    expect(getSectionById('doa_istiftah')?.readings[1].reference.context).toBe(ISTIFTAH_02_CONTEXT)
  })

  it('keeps only salam variations 3 and 4 and renumbers them', () => {
    const salam = data.sections.find((section) => section.id === 'salam')
    expect(salam?.readings.map((reading) => reading.id)).toEqual(['salam-03', 'salam-04'])
    expect(salam?.readings.map((reading) => reading.displayOrder)).toEqual([1, 2])

    const allReadingIds = data.sections.flatMap((section) => section.readings.map((reading) => reading.id))
    for (const removedId of REMOVED_SALAM_IDS) {
      expect(allReadingIds).not.toContain(removedId)
    }
  })

  it('places the requested additions at their specified variation numbers', () => {
    const istiftah = data.sections.find((section) => section.id === 'doa_istiftah')
    expect(istiftah?.readings[0].id).toBe('istiftah-tanbih-01')
    expect(istiftah?.readings[0].displayOrder).toBe(1)

    const itidal = data.sections.find((section) => section.id === 'itidal')
    expect(itidal?.readings.slice(0, 4).map((reading) => reading.id)).toEqual([
      'itidal-01',
      'itidal-02',
      'itidal-tanbih-01',
      'itidal-tanbih-02',
    ])
    expect(itidal?.readings.slice(0, 4).map((reading) => reading.displayOrder)).toEqual([1, 2, 3, 4])

    const shalawat = data.sections.find((section) => section.id === 'shalawat_setelah_tasyahhud')
    expect(shalawat?.readings[0].id).toBe('shalawat-tanbih-01')
    expect(shalawat?.readings[0].displayOrder).toBe(1)
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
    expect(getReadingById('rukuk', 'rukuk-02')?.displayOrder).toBe(2)
    expect(getReadingById('tidak-ada', 'rukuk-01')).toBeUndefined()
  })
})
