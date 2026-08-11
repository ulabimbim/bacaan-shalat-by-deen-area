import { useNavigate } from 'react-router-dom'
import { ChevronRight, Heart } from 'lucide-react'
import { InstallPrompt } from '../components/InstallPrompt.tsx'
import { getData } from '../data/index.ts'

const DUKUNG_DAKWAH_URL = 'https://deenarea.id/dukung-dakwah'

export function HomePage() {
  const navigate = useNavigate()
  const { sections } = getData()

  return (
    <main className="page" id="urutan-shalat">
      <header className="home-header">
        <p className="home-kicker">Dibuat oleh tim Deen Area</p>
        <h1 className="home-title">Bacaan Shalat</h1>
        <p className="home-subtitle">Kenali bacaan sesuai urutan shalat.</p>
        <p className="home-note">
          Sebagian bacaan merupakan alternatif dan sebagian memiliki konteks khusus. Buka sumber dan keterangan sebelum mengamalkannya.
        </p>
      </header>

      <InstallPrompt />

      <nav aria-label="Urutan bagian shalat">
        <ol className="section-list" role="list">
          {sections.map((section) => (
            <li key={section.id} className="section-item">
              <button
                type="button"
                className="section-button"
                onClick={() => navigate(`/bagian/${section.id}`)}
                aria-label={`${section.name}, ${section.publishedCount} variasi`}
              >
                <span className="section-number" aria-hidden="true">
                  {String(section.order).padStart(2, '0')}
                </span>
                <span className="section-info">
                  <span className="section-name">{section.name}</span>
                  <span className="section-count">{section.publishedCount} variasi</span>
                </span>
                <ChevronRight className="section-arrow" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <aside className="support-cta" aria-label="Dukung dakwah">
        <p className="support-text">
          Jika aplikasi kecil ini bermanfaat, Anda bisa mendukung Deen Area agar kami bisa membuat alat bantu amalan lainnya.
        </p>
        <a
          href={DUKUNG_DAKWAH_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="support-button"
        >
          <Heart className="support-icon" aria-hidden="true" />
          Dukung Dakwah Deen Area
        </a>
      </aside>
    </main>
  )
}
