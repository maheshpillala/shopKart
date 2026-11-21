import { IProductProvider, Product } from './product.provider';
import { ProductSchema } from '../schemas/product.schema';
import { config } from '../config';
import { z } from 'zod';

export class FakeStoreProvider implements IProductProvider {
  private readonly baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl ?? config.fakeStoreBaseUrl;
  }

  async getAllProducts(): Promise<Product[]> {
    const res = await fetch(`${this.baseUrl}/products`);
    if (!res.ok) throw new Error(`FakeStore error: ${res.status}`);
    const data = await res.json();
    return z.array(ProductSchema).parse(data);
  }

  async getProductById(id: number): Promise<Product | null> {
    const res = await fetch(`${this.baseUrl}/products/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`FakeStore error: ${res.status}`);
    const data = await res.json();
    // FakeStore returns empty object for invalid id sometimes
    if (!data || typeof data !== 'object' || !('id' in data)) return null;
    return ProductSchema.parse(data);
  }

  async getCategories(): Promise<string[]> {
    const res = await fetch(`${this.baseUrl}/products/categories`);
    if (!res.ok) throw new Error(`FakeStore error: ${res.status}`);
    const data = await res.json();
    return z.array(z.string()).parse(data);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const res = await fetch(`${this.baseUrl}/products/category/${encodeURIComponent(category)}`);
    if (!res.ok) throw new Error(`FakeStore error: ${res.status}`);
    const data = await res.json();
    return z.array(ProductSchema).parse(data);
  }
}
