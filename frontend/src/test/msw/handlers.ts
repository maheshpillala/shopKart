import { http, HttpResponse } from 'msw'
import type { Product } from '../../types/api.types'

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 1,
  title: 'Test Product',
  price: 29.99,
  description: 'A great product for testing purposes.',
  image: 'https://fakestoreapi.com/img/test.jpg',
  category: 'electronics',
  rating: { rate: 4.5, count: 120 },
  ...overrides,
})

export const featuredProducts: Product[] = Array.from({ length: 5 }, (_, i) =>
  makeProduct({ id: i + 1, title: `Featured Product ${i + 1}` })
)

export const allProducts: Product[] = [
  ...featuredProducts,
  makeProduct({ id: 6, title: 'Blue Jacket', category: "men's clothing", price: 55.99 }),
  makeProduct({ id: 7, title: 'Red Shoes', category: "women's clothing", price: 39.99 }),
]

export const categories = ['electronics', 'jewelery', "men's clothing", "women's clothing"]

export const handlers = [
  // Featured products
  http.get('/api/products/featured', () =>
    HttpResponse.json({ data: featuredProducts })
  ),

  // All / searched products
  http.get('/api/products', ({ request }) => {
    const url = new URL(request.url)
    const q = url.searchParams.get('q')?.toLowerCase()
    const data = q
      ? allProducts.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        )
      : allProducts
    return HttpResponse.json({ data })
  }),

  // Single product
  http.get('/api/products/:id', ({ params }) => {
    const id = Number(params.id)
    const product = allProducts.find((p) => p.id === id)
    if (!product) return HttpResponse.json({ error: 'Product not found' }, { status: 404 })
    return HttpResponse.json({ data: product })
  }),

  // Categories
  http.get('/api/categories', () =>
    HttpResponse.json({ data: categories })
  ),

  // Category products
  http.get('/api/categories/:name/products', ({ params }) => {
    const name = params.name as string
    const data = allProducts.filter((p) => p.category === decodeURIComponent(name))
    return HttpResponse.json({ data })
  }),

  // Enquiries
  http.post('/api/enquiries', () =>
    HttpResponse.json(
      { data: { id: 'enq_test123', submittedAt: new Date().toISOString() } },
      { status: 201 }
    )
  ),
]
