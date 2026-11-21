import { IEmailSender } from '../email/email.sender';
import { EnquiryRequest } from '../schemas/enquiry.schema';

export interface EnquiryResult {
  id: string;
  submittedAt: string;
}

export class EnquiryService {
  constructor(private readonly emailSender: IEmailSender) {}

  async submit(data: EnquiryRequest): Promise<EnquiryResult> {
    const id = `enq_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`;
    const submittedAt = new Date().toISOString();

    await this.emailSender.send({
      to: 'enquiries@shopkart.example.com',
      subject: `Product Enquiry #${id} — Product ${data.productId}`,
      body: `Name: ${data.name}\nEmail: ${data.email}\nProduct ID: ${data.productId}\nMessage:\n${data.message}`,
    });

    return { id, submittedAt };
  }
}
