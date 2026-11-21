import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ProductCard } from '../components/product/ProductCard'
import type { Product } from '../types/api.types'

const mockProduct: Product = {
  id: 42,
  title: 'Awesome Test Product',
  price: 49.99,
  description: 'A wonderful product for testing.',
  image: 'https://fakestoreapi.com/img/test.jpg',
  category: 'electronics',
  rating: { rate: 4.3, count: 87 },
}

function renderCard(product = mockProduct) {
  return render(
    <MemoryRouter>
      <ProductCard product={product} />
    </MemoryRouter>
  )
}

describe('ProductCard', () => {
  it('renders the product title', () => {
    renderCard()
    expect(screen.getByText('Awesome Test Product')).toBeInTheDocument()
  })

  it('renders the formatted price', () => {
    renderCard()
    expect(screen.getByText('$49.99')).toBeInTheDocument()
  })

  it('renders the product image with correct alt text', () => {
    renderCard()
    const img = screen.getByRole('img', { name: 'Awesome Test Product' })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', mockProduct.image)
  })

  it('renders a View Details link pointing to the product page', () => {
    renderCard()
    const link = screen.getByRole('link', { name: /view details/i })
    expect(link).toHaveAttribute('href', '/products/42')
  })

  it('renders the category badge', () => {
    renderCard()
    expect(screen.getByText('electronics')).toBeInTheDocument()
  })

  it('renders the rating count', () => {
    renderCard()
    expect(screen.getByText('(87)')).toBeInTheDocument()
  })
})
