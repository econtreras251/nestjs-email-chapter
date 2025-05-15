import { EmailTemplateService } from "./templates.abstract";
import {
  MailingResponse,
  SendEmailParams,
  TemplateParamsMap,
  ValueOf,
} from "./email.interface";

export abstract class EmailService {
  constructor(protected templateService?: EmailTemplateService) {}

  protected render<
    TEMPLATES extends Record<string, string>,
    T extends ValueOf<TEMPLATES>,
  >(template: T, context: TemplateParamsMap<TEMPLATES>): string {
    if (!this.templateService) throw new Error("No template service provided");
    return this.templateService.compile(String(template), context);
  }

  abstract sendEmail<
    TEMPLATES extends Record<string, string>,
    T extends ValueOf<TEMPLATES>,
    P extends TemplateParamsMap<TEMPLATES>,
  >(params: SendEmailParams<TEMPLATES, T, P>): Promise<MailingResponse>;
}
