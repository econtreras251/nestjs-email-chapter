import { Injectable } from "@nestjs/common";

export type Template = string; // You can extend this to match your template types

export interface TemplateParams {
  [key: string]: any;
}

export interface SendEmailParams<T extends Template> {
  template: {
    name: T;
    params: TemplateParams;
  };
  to: string;
  from?: string;
  subject?: string;
}

@Injectable()
export abstract class MailingProviderService {
  abstract sendEmail<T extends Template, R>(
    params: SendEmailParams<T>
  ): Promise<R>;
} 