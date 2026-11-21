import { IEmailSender, EmailOptions } from './email.sender';

export class ConsoleEmailSender implements IEmailSender {
  async send(options: EmailOptions): Promise<void> {
    console.log(JSON.stringify({ email: options }, null, 2));
  }
}
