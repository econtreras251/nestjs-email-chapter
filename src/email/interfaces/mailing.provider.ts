import { Injectable } from "@nestjs/common";
import { MailingResponse, SendEmailParams, Template } from "./email.interface";

@Injectable()
export abstract class MailingProviderService {
  abstract sendEmail<T extends Template>(
    params: SendEmailParams<T>,
  ): Promise<MailingResponse>;
}
