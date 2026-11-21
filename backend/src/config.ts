import 'dotenv/config';
import { z } from 'zod';

const ConfigSchema = z.object({
  PORT: z.string().transform(Number).pipe(z.number().int().positive()),
  FAKE_STORE_BASE_URL: z.string().url(),
  EMAIL_PROVIDER: z.enum(['console']).default('console'),
  FRONTEND_URL: z.string().url(),
});

const parsed = ConfigSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const config = {
  port: parsed.data.PORT,
  fakeStoreBaseUrl: parsed.data.FAKE_STORE_BASE_URL,
  emailProvider: parsed.data.EMAIL_PROVIDER,
  frontendUrl: parsed.data.FRONTEND_URL,
};
