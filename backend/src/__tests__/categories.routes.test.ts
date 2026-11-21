import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { IProductProvider, Product } from '../providers/product.provider';

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 1,
  title: 'Test Product',
  price: 9.99,
  description: 'A test product',
  image: 'https://example.com/img.jpg',
  category: 'electronics',
  rating: { rate: 4.0, count: 30 },
  ...overrides,
});

const mockProvider: IProductProvider = {
  getAllProducts: vi.fn().mockResolvedValue([]),
  getProductById: vi.fn().mockResolvedValue(null),
  getCategories: vi.fn().mockResolvedValue(['electronics', 'jewelery', "men's clothing", "women's clothing"]),
  getProductsByCategory: vi.fn().mockResolvedValue([
    makeProduct({ id: 1, category: 'electronics' }),
    makeProduct({ id: 2, category: 'electronics' }),
  ]),
};

const app = createApp({ productProvider: mockProvider });

describe('GET /api/categories', () => {
  it('returns 200 with an array of category strings', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    res.body.data.forEach((cat: unknown) => expect(typeof cat).toBe('string'));
  });
});

describe('GET /api/categories/:name/products', () => {
  it('returns 200 with products for electronics category', async () => {
    const res = await request(app).get('/api/categories/electronics/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});
