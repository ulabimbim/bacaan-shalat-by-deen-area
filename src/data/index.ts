import type { Reading, Section, ShalatData } from '../types.ts'
import rawData from './shalat.generated.json'

const data: ShalatData = rawData as ShalatData

export function getData(): ShalatData {
  return data
}

export function getSectionById(id: string): Section | undefined {
  return data.sections.find((section) => section.id === id)
}

export function getReadingById(sectionId: string, readingId: string): Reading | undefined {
  const section = getSectionById(sectionId)
  if (!section) return undefined
  return section.readings.find((reading) => reading.id === readingId)
}

export type { ShalatData, Section, Reading }
