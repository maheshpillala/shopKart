import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ProductDetailPage } from '../pages/ProductDetailPage'

function renderProductDetail(id = '1') {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/products/${id}`]}>
        <Routes>
          <Route path="/products/:id" element={<ProductDetailPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('ProductDetailPage', () => {
  it('renders product title after loading', async () => {
    renderProductDetail('1')
    await waitFor(() => {
      expect(screen.getByText('Featured Product 1')).toBeInTheDocument()
    })
  })

  it('renders Make an Enquiry button linking to enquiry page', async () => {
    renderProductDetail('1')
    await waitFor(() => {
      const link = screen.getByRole('link', { name: /make an enquiry/i })
      expect(link).toHaveAttribute('href', '/products/1/enquiry')
    })
  })

  it('renders the product price', async () => {
    renderProductDetail('1')
    await waitFor(() => {
      expect(screen.getByText('$29.99')).toBeInTheDocument()
    })
  })
})
