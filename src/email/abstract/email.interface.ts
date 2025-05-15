/**
 * Represents the base parameters required for sending an email.
 * Includes common fields such as recipient, sender, and subject.
 */
export interface BaseEmailParams {
  to: string;
  from: string;
  subject?: string;
}

/**
 * Represents the response returned after sending an email.
 * @typeParam TPayload - The type of the response body (default: object)
 */
export interface MailingResponse<TPayload = object> {
  statusCode: number;
  body: TPayload;
  headers: any;
}

/**
 * Core interface for sending an email.
 * The template and params types are defined at the module level.
 */
export interface SendEmailParams extends BaseEmailParams {
  template: {
    name: string;
    params: Record<string, any>;
  };
}

/**
 * Core interface for the email service.
 * The template and params types are defined at the module level.
 */
export interface EmailService {
  sendEmail(params: SendEmailParams): Promise<MailingResponse>;
}
