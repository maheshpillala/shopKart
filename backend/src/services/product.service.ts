import { IProductProvider, Product } from '../providers/product.provider';

export class ProductService {
  constructor(private readonly provider: IProductProvider) {}

  async getFeatured(): Promise<Product[]> {
    const products = await this.provider.getAllProducts();
    return products.slice(0, 5);
  }

  async getAll(): Promise<Product[]> {
    return this.provider.getAllProducts();
  }

  async search(q: string): Promise<Product[]> {
    const products = await this.provider.getAllProducts();
    const lower = q.toLowerCase();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower)
    );
  }

  async getById(id: number): Promise<Product | null> {
    return this.provider.getProductById(id);
  }
}
