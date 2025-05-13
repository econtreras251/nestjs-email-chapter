import { EmailTemplateService } from "./templates.abstract";
import {
  MailingResponse,
  SendEmailParams,
  TemplateParams,
} from "./email.interface";
import { Template } from "../../templates";

export abstract class EmailService {
  constructor(protected templateService?: EmailTemplateService) {}

  protected render<T extends Template>(
    template: T,
    context: TemplateParams[T],
  ): string {
    if (!this.templateService) throw new Error("No template service provided");
    return this.templateService.compile(template, context);
  }

  abstract sendEmail(params: SendEmailParams): Promise<MailingResponse>;
}
