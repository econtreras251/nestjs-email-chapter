import { Template, TEMPLATES } from "../templates";
import { VerificationParams } from "../templates/verification";
import { WelcomeParams } from "../templates/welcome";

export interface TemplateParams {
  [TEMPLATES.WELCOME]: WelcomeParams;
  [TEMPLATES.VERIFICATION]: VerificationParams;
}

export interface SendEmailParams<T extends Template = Template> {
  template: {
    name: T;
    params: TemplateParams[T];
  };
  to: string;
  from?: string;
  subject?: string;
}

export interface MailingResponse<TPayload = object> {
  statusCode: number;
  body: TPayload;
  headers: any;
}
