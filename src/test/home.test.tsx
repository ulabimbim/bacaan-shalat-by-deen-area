import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App.tsx'
import data from '../data/shalat.generated.json'

describe('Home page', () => {
  beforeEach(() => {
    window.location.hash = '#/'
  })

  it('renders 10 sections in order', () => {
    render(<App />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(10)

    const names = buttons.map((button) => {
      const nameEl = button.querySelector('.section-name')
      return nameEl?.textContent
    })

    expect(names).toEqual(data.sections.map((section) => section.name))
  })

  it('opens Rukuk detail showing variation 1 of 7', async () => {
    const user = userEvent.setup()
    render(<App />)

    const rukukButton = screen.getByRole('button', { name: /Rukuk/iu })
    await user.click(rukukButton)

    expect(screen.getByText(/Variasi 1 dari 7/iu)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sebelumnya/iu })).toBeDisabled()
  })

  it('renders support dakwah link', () => {
    render(<App />)

    const link = screen.getByRole('link', { name: /Dukung Dakwah/iu })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://deenarea.id/dukung-dakwah')
    expect(link).toHaveAttribute('target', '_blank')
  })
})
