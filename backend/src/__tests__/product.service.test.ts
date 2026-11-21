import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductService } from '../services/product.service';
import { IProductProvider, Product } from '../providers/product.provider';

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 1,
  title: 'Test Product',
  price: 9.99,
  description: 'A test description for search testing',
  image: 'https://example.com/image.jpg',
  category: 'electronics',
  rating: { rate: 4.5, count: 100 },
  ...overrides,
});

const makeMockProvider = (): IProductProvider => ({
  getAllProducts: vi.fn(),
  getProductById: vi.fn(),
  getCategories: vi.fn(),
  getProductsByCategory: vi.fn(),
});

describe('ProductService', () => {
  let provider: IProductProvider;
  let service: ProductService;

  beforeEach(() => {
    provider = makeMockProvider();
    service = new ProductService(provider);
  });

  describe('getFeatured', () => {
    it('returns exactly 5 products when provider has more', async () => {
      const products = Array.from({ length: 10 }, (_, i) =>
        makeProduct({ id: i + 1, title: `Product ${i + 1}` })
      );
      vi.mocked(provider.getAllProducts).mockResolvedValue(products);

      const result = await service.getFeatured();
      expect(result).toHaveLength(5);
      expect(result[0].id).toBe(1);
      expect(result[4].id).toBe(5);
    });

    it('returns all products when fewer than 5 available', async () => {
      const products = [makeProduct({ id: 1 }), makeProduct({ id: 2 })];
      vi.mocked(provider.getAllProducts).mockResolvedValue(products);

      const result = await service.getFeatured();
      expect(result).toHaveLength(2);
    });
  });

  describe('search', () => {
    it('filters by title (case-insensitive)', async () => {
      const products = [
        makeProduct({ id: 1, title: 'Blue Jacket', description: 'Nice coat' }),
        makeProduct({ id: 2, title: 'Red Shoes', description: 'Running shoes' }),
        makeProduct({ id: 3, title: 'JACKET Pro', description: 'Premium outerwear' }),
      ];
      vi.mocked(provider.getAllProducts).mockResolvedValue(products);

      const result = await service.search('jacket');
      expect(result).toHaveLength(2);
      expect(result.map((p) => p.id)).toEqual([1, 3]);
    });

    it('filters by description (case-insensitive)', async () => {
      const products = [
        makeProduct({ id: 1, title: 'Product A', description: 'Contains waterproof material' }),
        makeProduct({ id: 2, title: 'Product B', description: 'Lightweight cotton' }),
      ];
      vi.mocked(provider.getAllProducts).mockResolvedValue(products);

      const result = await service.search('waterproof');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('returns empty array when no matches', async () => {
      const products = [
        makeProduct({ id: 1, title: 'Product A', description: 'Some description' }),
      ];
      vi.mocked(provider.getAllProducts).mockResolvedValue(products);

      const result = await service.search('nonexistentterm12345');
      expect(result).toHaveLength(0);
    });
  });

  describe('getById', () => {
    it('returns null when product is not found', async () => {
      vi.mocked(provider.getProductById).mockResolvedValue(null);

      const result = await service.getById(999);
      expect(result).toBeNull();
    });

    it('returns product when found', async () => {
      const product = makeProduct({ id: 5 });
      vi.mocked(provider.getProductById).mockResolvedValue(product);

      const result = await service.getById(5);
      expect(result).toEqual(product);
    });
  });
});
