import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HomePage } from '../pages/HomePage'

function renderHomePage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('HomePage', () => {
  it('renders the hero section', () => {
    renderHomePage()
    expect(screen.getByText(/welcome to shopkart/i)).toBeInTheDocument()
  })

  it('renders the Featured Products heading', () => {
    renderHomePage()
    expect(screen.getByText(/featured products/i)).toBeInTheDocument()
  })

  it('renders exactly 5 product cards after loading', async () => {
    renderHomePage()

    await waitFor(() => {
      const links = screen.getAllByRole('link', { name: /view details/i })
      expect(links).toHaveLength(5)
    })
  })

  it('renders product titles from MSW stub data', async () => {
    renderHomePage()

    await waitFor(() => {
      expect(screen.getByText('Featured Product 1')).toBeInTheDocument()
      expect(screen.getByText('Featured Product 5')).toBeInTheDocument()
    })
  })
})
