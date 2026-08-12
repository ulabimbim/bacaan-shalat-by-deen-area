export interface Segment {
  id: string
  order: number
  label: string | null
  arabic: string
  transliteration: string
  meaning: string
}

export interface Reading {
  id: string
  displayOrder: number
  sourceOrder: number
  subcategory: string | null
  segments: Segment[]
  reference: {
    text: string | null
    note: string | null
    context: string | null
    sourceReference: string | null
    url: string | null
  }
}

export interface Section {
  id: string
  order: number
  name: string
  publishedCount: number
  readings: Reading[]
}

export interface ShalatData {
  version: number
  sections: Section[]
}
