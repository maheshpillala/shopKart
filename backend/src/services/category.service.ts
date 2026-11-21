import { IProductProvider, Product } from '../providers/product.provider';

export class CategoryService {
  constructor(private readonly provider: IProductProvider) {}

  async getAll(): Promise<string[]> {
    return this.provider.getCategories();
  }

  async getProducts(category: string): Promise<Product[]> {
    return this.provider.getProductsByCategory(category);
  }
}
