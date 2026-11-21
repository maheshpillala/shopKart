export interface EmailOptions {
  to: string;
  subject: string;
  body: string;
}

export interface IEmailSender {
  send(options: EmailOptions): Promise<void>;
}
