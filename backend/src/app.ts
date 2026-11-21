import express from 'express';
import cors from 'cors';
import { config } from './config';
import { IProductProvider } from './providers/product.provider';
import { FakeStoreProvider } from './providers/fake-store.provider';
import { IEmailSender } from './email/email.sender';
import { createEmailSender } from './email/email.factory';
import { createHealthRouter } from './routes/health';
import { createProductsRouter } from './routes/products';
import { createCategoriesRouter } from './routes/categories';
import { createEnquiriesRouter } from './routes/enquiries';
import { notFoundMiddleware } from './middleware/not-found.middleware';
import { errorMiddleware } from './middleware/error.middleware';

export interface AppDeps {
  productProvider?: IProductProvider;
  emailSender?: IEmailSender;
}

export function createApp(deps: AppDeps = {}) {
  const app = express();

  const productProvider = deps.productProvider ?? new FakeStoreProvider();
  const emailSender = deps.emailSender ?? createEmailSender();

  app.use(cors({ origin: config.frontendUrl }));
  app.use(express.json());

  app.use('/api/health', createHealthRouter());
  app.use('/api/products', createProductsRouter(productProvider));
  app.use('/api/categories', createCategoriesRouter(productProvider));
  app.use('/api/enquiries', createEnquiriesRouter(emailSender));

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}
