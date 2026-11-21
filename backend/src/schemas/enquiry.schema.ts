import { z } from 'zod';

export const EnquiryRequestSchema = z.object({
  productId: z.number(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type EnquiryRequest = z.infer<typeof EnquiryRequestSchema>;
