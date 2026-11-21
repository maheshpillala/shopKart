import { Router, Request, Response, NextFunction } from 'express';
import { IEmailSender } from '../email/email.sender';
import { createEmailSender } from '../email/email.factory';
import { EnquiryService } from '../services/enquiry.service';
import { EnquiryRequestSchema } from '../schemas/enquiry.schema';

export function createEnquiriesRouter(emailSender?: IEmailSender) {
  const router = Router();
  const enquiryService = new EnquiryService(emailSender ?? createEmailSender());

  router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = EnquiryRequestSchema.parse(req.body);
      const result = await enquiryService.submit(data);
      res.status(201).json({ data: result });
    } catch (err) {
      next(err);
    }
  });

  return router;
}

export default createEnquiriesRouter();
