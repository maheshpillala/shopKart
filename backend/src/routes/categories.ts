import { Router, Request, Response, NextFunction } from 'express';
import { IProductProvider } from '../providers/product.provider';
import { FakeStoreProvider } from '../providers/fake-store.provider';
import { CategoryService } from '../services/category.service';

export function createCategoriesRouter(provider?: IProductProvider) {
  const router = Router();
  const categoryService = new CategoryService(provider ?? new FakeStoreProvider());

  router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await categoryService.getAll();
      res.json({ data });
    } catch (err) {
      next(err);
    }
  });

  router.get('/:name/products', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await categoryService.getProducts(req.params.name);
      res.json({ data });
    } catch (err) {
      next(err);
    }
  });

  return router;
}

export default createCategoriesRouter();
