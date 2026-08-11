import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

function isStandaloneMode(): boolean {
  const navigatorWithStandalone = navigator as Navigator & { standalone?: boolean }
  const hasStandaloneMediaQuery = typeof window.matchMedia === 'function' && window.matchMedia('(display-mode: standalone)').matches
  return hasStandaloneMediaQuery || navigatorWithStandalone.standalone === true
}

function isIosDevice(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

export function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [isIos, setIsIos] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isStandaloneMode()) return

    setIsIos(isIosDevice())

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setInstallEvent(event as BeforeInstallPromptEvent)
      setIsVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  }, [])

  useEffect(() => {
    if (isIos) setIsVisible(true)
  }, [isIos])

  const handleInstall = async () => {
    if (!installEvent) return

    await installEvent.prompt()
    await installEvent.userChoice
    setInstallEvent(null)
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <aside className="install-prompt" aria-label="Tambahkan aplikasi ke layar utama">
      <div className="install-prompt-content">
        <Download className="install-prompt-icon" aria-hidden="true" />
        <div>
          <p className="install-prompt-title">Baca lebih praktis</p>
          {installEvent ? (
            <p className="install-prompt-text">Tambahkan Bacaan Shalat ke layar utama Anda.</p>
          ) : (
            <p className="install-prompt-text">Di Safari, pilih Bagikan lalu Tambahkan ke Layar Utama.</p>
          )}
        </div>
      </div>
      {installEvent && (
        <button type="button" className="install-prompt-button" onClick={handleInstall}>
          Tambahkan ke Home
        </button>
      )}
      <button
        type="button"
        className="install-prompt-close"
        onClick={() => setIsVisible(false)}
        aria-label="Tutup pemberitahuan instalasi"
      >
        <X aria-hidden="true" />
      </button>
    </aside>
  )
}
