import { IEmailSender } from './email.sender';
import { ConsoleEmailSender } from './console.email.sender';
import { config } from '../config';

export function createEmailSender(): IEmailSender {
  switch (config.emailProvider) {
    case 'console':
    default:
      return new ConsoleEmailSender();
  }
}
