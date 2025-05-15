import { EmailTemplateService } from "./templates.abstract";
import { MailingResponse, SendEmailParams } from "./email.interface";

export abstract class EmailService {
  constructor(protected templateService?: EmailTemplateService) {}

  protected render(template: string, context: Record<string, any>): string {
    if (!this.templateService) throw new Error("No template service provided");
    return this.templateService.compile(template, context);
  }

  abstract sendEmail(params: SendEmailParams): Promise<MailingResponse>;
}
