import { useEffect, useMemo, useRef, useCallback } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Reading } from '../types.ts'
import { getSectionById } from '../data/index.ts'
import { ReadingCard } from '../components/ReadingCard.tsx'

const FOCUSABLE_SELECTORS = 'a, button, input, textarea, select, summary, [contenteditable="true"]'

export function DetailPage() {
  const { bagianId } = useParams<{ bagianId: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const cardRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)

  const section = useMemo(() => (bagianId ? getSectionById(bagianId) : undefined), [bagianId])

  const activeIndex = useMemo(() => {
    if (!section) return -1
    const bacaanId = searchParams.get('bacaan')
    if (!bacaanId) return 0
    const index = section.readings.findIndex((reading: Reading) => reading.id === bacaanId)
    return index >= 0 ? index : -1
  }, [section, searchParams])

  const reading = section && activeIndex >= 0 ? section.readings[activeIndex] : undefined

  const setReadingIndex = useCallback(
    (index: number) => {
      if (!section) return
      const readingId = section.readings[index]?.id
      if (!readingId) return
      setSearchParams({ bacaan: readingId }, { replace: true })
    },
    [section, setSearchParams],
  )

  useEffect(() => {
    if (cardRef.current && typeof cardRef.current.scrollIntoView === 'function') {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [activeIndex])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      const target = event.target as HTMLElement | null
      if (target?.closest(FOCUSABLE_SELECTORS)) return

      event.preventDefault()
      if (event.key === 'ArrowLeft' && activeIndex > 0) {
        setReadingIndex(activeIndex - 1)
      } else if (event.key === 'ArrowRight' && section && activeIndex < section.readings.length - 1) {
        setReadingIndex(activeIndex + 1)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex, section, setReadingIndex])

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.changedTouches[0].screenX
  }

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const endX = event.changedTouches[0].screenX
    const delta = endX - touchStartX.current
    touchStartX.current = null

    if (Math.abs(delta) < 50) return
    if (delta < 0 && section && activeIndex < section.readings.length - 1) {
      setReadingIndex(activeIndex + 1)
    } else if (delta > 0 && activeIndex > 0) {
      setReadingIndex(activeIndex - 1)
    }
  }

  const handleBack = () => {
    navigate('/')
  }

  if (!section || !reading) {
    return (
      <main className="page error-page" role="alert">
        <h1 className="error-title">Bacaan tidak ditemukan.</h1>
        <button type="button" className="error-button" onClick={handleBack}>
          Kembali ke Urutan Shalat
        </button>
      </main>
    )
  }

  const progressPercent = ((activeIndex + 1) / section.readings.length) * 100
  const isFirst = activeIndex === 0
  const isLast = activeIndex === section.readings.length - 1

  return (
    <main
      className="page"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <header className="app-bar">
        <button
          type="button"
          className="back-button"
          onClick={handleBack}
          aria-label="Kembali ke Urutan Shalat"
        >
          <ArrowLeft aria-hidden="true" />
        </button>
        <div className="app-bar-title">
          <h1 className="app-bar-name">{section.name}</h1>
          <p className="app-bar-count">{section.publishedCount} variasi</p>
        </div>
      </header>

      <div className="position-track">
        <p className="position-label">Variasi {reading.displayOrder} dari {section.readings.length}</p>
        <div className="position-line" aria-hidden="true">
          <div className="position-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <ReadingCard ref={cardRef} reading={reading} />

      <nav className="navigation" aria-label="Navigasi variasi bacaan">
        <button
          type="button"
          className="nav-button"
          onClick={() => setReadingIndex(activeIndex - 1)}
          disabled={isFirst}
          aria-disabled={isFirst}
        >
          <ChevronLeft aria-hidden="true" />
          Sebelumnya
        </button>
        <button
          type="button"
          className="nav-button"
          onClick={() => setReadingIndex(activeIndex + 1)}
          disabled={isLast}
          aria-disabled={isLast}
        >
          Berikutnya
          <ChevronRight aria-hidden="true" />
        </button>
      </nav>
    </main>
  )
}
