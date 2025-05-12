import { MailingResponse, SendEmailParams } from "./email.interface";

export abstract class EmailService {
  abstract sendEmail(params: SendEmailParams): Promise<MailingResponse>;
}
