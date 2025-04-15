import { MailingResponse, SendEmailParams, Template } from "./email.interface";

export abstract class EmailService {
  abstract sendEmail<T extends Template>(
    params: SendEmailParams<T>,
  ): Promise<MailingResponse>;
}
