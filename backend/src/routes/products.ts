import { Router, Request, Response, NextFunction } from 'express';
import { IProductProvider } from '../providers/product.provider';
import { FakeStoreProvider } from '../providers/fake-store.provider';
import { ProductService } from '../services/product.service';
import { AppError } from '../middleware/app-error';

export function createProductsRouter(provider?: IProductProvider) {
  const router = Router();
  const productService = new ProductService(provider ?? new FakeStoreProvider());

  router.get('/featured', async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await productService.getFeatured();
      res.json({ data });
    } catch (err) {
      next(err);
    }
  });

  router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const q = req.query.q as string | undefined;
      const data = q ? await productService.search(q) : await productService.getAll();
      res.json({ data });
    } catch (err) {
      next(err);
    }
  });

  router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        throw new AppError(404, 'Product not found');
      }
      const product = await productService.getById(id);
      if (!product) {
        throw new AppError(404, 'Product not found');
      }
      res.json({ data: product });
    } catch (err) {
      next(err);
    }
  });

  return router;
}

export default createProductsRouter();
