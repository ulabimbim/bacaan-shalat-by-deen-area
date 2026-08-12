import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App.tsx'

describe('Detail page', () => {
  beforeEach(() => {
    window.location.hash = '#/bagian/rukuk'
  })

  it('navigates next and previous with disabled states', async () => {
    const user = userEvent.setup()
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText(/Variasi 1 dari 8/iu)).toBeInTheDocument()
    })

    const previousButton = screen.getByRole('button', { name: /Sebelumnya/iu })
    const nextButton = screen.getByRole('button', { name: /Berikutnya/iu })

    expect(previousButton).toBeDisabled()
    expect(nextButton).not.toBeDisabled()

    await user.click(nextButton)
    expect(screen.getByText(/Variasi 2 dari 8/iu)).toBeInTheDocument()
    expect(previousButton).not.toBeDisabled()

    await user.click(previousButton)
    expect(screen.getByText(/Variasi 1 dari 8/iu)).toBeInTheDocument()
    expect(previousButton).toBeDisabled()
  })

  it('disables Berikutnya on the last variation', async () => {
    window.location.hash = '#/bagian/rukuk?bacaan=rukuk-08'
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText(/Variasi 8 dari 8/iu)).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /Berikutnya/iu })).toBeDisabled()
    expect(screen.getByRole('button', { name: /Sebelumnya/iu })).not.toBeDisabled()
  })

  it('returns to the home page via the back button', async () => {
    const user = userEvent.setup()
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText(/Variasi 1 dari 8/iu)).toBeInTheDocument()
    })

    const backButton = screen.getByRole('button', { name: /Kembali ke Urutan Shalat/iu })
    await user.click(backButton)

    expect(screen.getByRole('heading', { name: /Bacaan Shalat/iu })).toBeInTheDocument()
  })

  it('does not show the Jenis dalil field in source details', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByText('Sumber dan keterangan'))

    expect(screen.queryByText('Jenis dalil')).not.toBeInTheDocument()
    expect(screen.getByText('Rujukan')).toBeInTheDocument()
  })

  it('shows not found for a held reading deep link', async () => {
    window.location.hash = '#/bagian/salam?bacaan=salam-05'
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Bacaan tidak ditemukan.')).toBeInTheDocument()
    })
  })

  it('shows not found for an unknown section', async () => {
    window.location.hash = '#/bagian/tidak-ada'
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Bacaan tidak ditemukan.')).toBeInTheDocument()
    })
  })
})
