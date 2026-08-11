import { forwardRef } from 'react'
import { ExternalLink, ChevronDown } from 'lucide-react'
import type { Reading } from '../types.ts'

const GENERIC_LABELS = ['bacaan utama']

interface ReadingCardProps {
  reading: Reading
}

export const ReadingCard = forwardRef<HTMLElement, ReadingCardProps>(function ReadingCard({ reading }, ref) {
  const showLabel = (label: string | null) => {
    if (!label) return false
    if (reading.segments.length === 1 && GENERIC_LABELS.includes(label.trim().toLowerCase())) {
      return false
    }
    return true
  }

  const sourceUrl = reading.reference.url

  return (
    <article ref={ref as React.Ref<HTMLDivElement>} className="reading-card" aria-label={`Variasi ${reading.displayOrder}`}>
      {reading.subcategory && (
        <span className="subcategory-badge">{reading.subcategory}</span>
      )}

      <div className="segments">
        {reading.segments.map((segment) => (
          <div key={segment.id}>
            {showLabel(segment.label) && segment.label && (
              <p className="segment-label">{segment.label}</p>
            )}
            <p className="arabic-text" dir="rtl" lang="ar">
              {segment.arabic}
            </p>
            <p className="transliteration">{segment.transliteration}</p>
            <p className="meaning">{segment.meaning}</p>
          </div>
        ))}
      </div>

      <details className="source-accordion">
        <summary className="source-summary" aria-expanded="false">
          Sumber dan keterangan
          <ChevronDown aria-hidden="true" />
        </summary>
        <div className="source-content">
          {reading.reference.text && (
            <div className="source-field">
              <span className="source-label">Rujukan</span>
              <p>{reading.reference.text}</p>
            </div>
          )}
          {reading.reference.evidenceType && (
            <div className="source-field">
              <span className="source-label">Jenis dalil</span>
              <p>{reading.reference.evidenceType}</p>
            </div>
          )}
          {reading.reference.note && (
            <div className="source-field">
              <span className="source-label">Keterangan</span>
              <p>{reading.reference.note}</p>
            </div>
          )}
          {reading.reference.context && (
            <div className="source-field">
              <span className="source-label">Konteks penggunaan</span>
              <p>{reading.reference.context}</p>
            </div>
          )}
          {sourceUrl && (
            <div className="source-field">
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="source-link"
              >
                Buka sumber
                <ExternalLink aria-hidden="true" />
              </a>
            </div>
          )}
          {reading.reference.sourceReference && reading.reference.sourceReference !== sourceUrl && (
            <div className="source-field">
              <span className="source-label">Sumber referensi</span>
              <p>{reading.reference.sourceReference}</p>
            </div>
          )}
        </div>
      </details>
    </article>
  )
})
