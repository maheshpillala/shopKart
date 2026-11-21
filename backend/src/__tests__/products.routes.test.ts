import { describe, it, expect, vi, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { IProductProvider, Product } from '../providers/product.provider';

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 1,
  title: 'Test Product',
  price: 9.99,
  description: 'A descriptive test product',
  image: 'https://example.com/img.jpg',
  category: 'electronics',
  rating: { rate: 4.2, count: 50 },
  ...overrides,
});

const mockProducts: Product[] = Array.from({ length: 10 }, (_, i) =>
  makeProduct({ id: i + 1, title: `Product ${i + 1}` })
);

const mockProvider: IProductProvider = {
  getAllProducts: vi.fn().mockResolvedValue(mockProducts),
  getProductById: vi.fn().mockImplementation(async (id: number) => {
    return mockProducts.find((p) => p.id === id) ?? null;
  }),
  getCategories: vi.fn().mockResolvedValue(['electronics', 'jewelery']),
  getProductsByCategory: vi.fn().mockResolvedValue(mockProducts.slice(0, 3)),
};

const app = createApp({ productProvider: mockProvider });

describe('GET /api/products/featured', () => {
  it('returns exactly 5 products', async () => {
    const res = await request(app).get('/api/products/featured');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(5);
  });
});

describe('GET /api/products', () => {
  it('returns all products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(10);
  });

  it('filters by search query ?q', async () => {
    // override getAllProducts to include a searchable product
    vi.mocked(mockProvider.getAllProducts).mockResolvedValueOnce([
      makeProduct({ id: 1, title: 'Blue Jacket', description: 'Nice coat' }),
      makeProduct({ id: 2, title: 'Red Shoes', description: 'Running' }),
    ]);
    const res = await request(app).get('/api/products?q=jacket');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].title).toBe('Blue Jacket');
  });
});

describe('GET /api/products/:id', () => {
  it('returns 200 with product data for a valid id', async () => {
    const res = await request(app).get('/api/products/1');
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(1);
  });

  it('returns 404 for a non-existent id', async () => {
    vi.mocked(mockProvider.getProductById).mockResolvedValueOnce(null);
    const res = await request(app).get('/api/products/9999');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Product not found');
  });
});
