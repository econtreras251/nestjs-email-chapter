/**
 * Represents the base parameters required for sending an email.
 * Includes common fields such as recipient, sender, and subject.
 */
export interface BaseEmailParams {
  /** Email address of the recipient */
  to: string;
  /** Email address of the sender */
  from?: string;
  /** Optional subject line of the email */
  subject?: string;
}

/**
 * Represents the base parameters required for sending multiple emails.
 * Includes common fields such as recipients, sender, and subject.
 */
export interface BaseEmailMultipleParams {
  /** Array of recipient email addresses */
  to: string[];
  /** Email address of the sender */
  from: string;
  /** Optional subject line of the email */
  subject?: string;
}

/**
 * Type for email headers with common header fields
 */
export type EmailHeaders = {
  "Content-Type"?: string;
  "X-Mailer"?: string;
  [key: string]: string | undefined;
};

/**
 * Represents the response returned after sending an email.
 * @typeParam TPayload - The type of the response body (default: object)
 */
export interface MailingResponse<TPayload = object> {
  /** HTTP status code of the response */
  statusCode: number;
  /** Response body containing the result of the email operation */
  body: TPayload;
  /** Response headers */
  headers: EmailHeaders;
}

/**
 * Core interface for sending an email.
 * The template and params types are defined at the module level.
 */
export interface SendEmailParams extends BaseEmailParams {
  template: {
    /** Name of the email template to use */
    name: string;
    /** ID of the email template to use */
    templateId?: string;
    /** Parameters to be used in the template */
    params: Record<string, any>;
  };
}

/**
 * Core interface for sending multiple emails.
 * The template and params types are defined at the module level.
 */
export interface SendEmailMultipleParams extends BaseEmailMultipleParams {
  template: {
    /** Name of the email template to use */
    name: string;
    /** ID of the email template to use */
    templateId?: string;
    /** Parameters to be used in the template */
    params: Record<string, any>;
  };
}

/**
 * Core interface for the email service.
 * Provides methods for sending single and multiple emails.
 */
export interface EmailService {
  /**
   * Sends a single email using the provided parameters
   * @param params - The parameters for sending the email
   * @returns Promise resolving to the mailing response
   */
  sendEmail(params: SendEmailParams): Promise<MailingResponse>;

  /**
   * Sends multiple emails using the provided parameters
   * @param params - The parameters for sending multiple emails
   * @returns Promise resolving to an array of mailing responses
   */
  sendEmailMultiple(
    params: SendEmailMultipleParams,
  ): Promise<MailingResponse[]>;
}
