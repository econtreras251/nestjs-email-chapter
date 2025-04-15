export type Template = string;

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

export interface MailingResponse<TPayload = object> {
  statusCode: number;
  body: TPayload;
  headers: any;
}
