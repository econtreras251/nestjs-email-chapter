import { Inject, Injectable } from "@nestjs/common";
import { EmailService } from "../abstract/email.service";
import {
  SendEmailMultipleParams,
  SendEmailParams,
} from "../abstract/email.interface";
import { SENDGRID_ADAPTER_PROVIDER_CONFIG } from "./sendgrid-adapter-config-provider.const";
import { SendgridAdapterConfig } from "./sendgrid-adapter-config.interface";
import * as sgMail from "@sendgrid/mail";
import { ClientResponse } from "@sendgrid/mail";
import { EmailTemplateService } from "../abstract/templates.abstract";

@Injectable()
export class SendgridAdapterService extends EmailService {
  private emailFrom: string;

  constructor(
    @Inject(SENDGRID_ADAPTER_PROVIDER_CONFIG)
    config: SendgridAdapterConfig,
    templateService: EmailTemplateService,
  ) {
    super(templateService);
    this.emailFrom = config.emailFrom;
    sgMail.setApiKey(config.sendgridApiKey);
  }

  private async sendHTML(
    to: string,
    html: string,
    options: Pick<SendEmailParams, "from" | "subject">,
  ): Promise<ClientResponse> {
    options.from = options.from || this.emailFrom;
    options.subject = options.subject || "";
    return sgMail
      .send({
        to,
        from: options.from,
        subject: options.subject,
        html,
      })
      .then((resp) => resp[0]);
  }

  private async sendTemplate(
    to: string,
    templateId: string,
    locals: Record<string, any>,
    options: Pick<SendEmailParams, "from" | "subject">,
  ): Promise<ClientResponse> {
    options.from = options.from || this.emailFrom;
    options.subject = options.subject || "";
    return sgMail
      .send({
        to,
        from: options.from,
        subject: options.subject,
        templateId,
        dynamicTemplateData: locals,
      })
      .then((resp) => resp[0]);
  }

  private async sendMultipleTemplate(
    to: string[],
    templateId: string,
    locals: Record<string, any>,
    options: Pick<SendEmailParams, "from" | "subject">,
  ): Promise<ClientResponse> {
    options.from = options.from || this.emailFrom;
    options.subject = options.subject || "";
    return sgMail
      .sendMultiple({
        to,
        from: options.from,
        subject: options.subject,
        templateId,
        dynamicTemplateData: locals,
      })
      .then((resp) => resp[0]);
  }

  private async sendMultipleHTML(
    to: string[],
    html: string,
    options: Pick<SendEmailParams, "from" | "subject">,
  ): Promise<ClientResponse> {
    options.from = options.from || this.emailFrom;
    options.subject = options.subject || "";
    return sgMail
      .sendMultiple({
        to,
        from: options.from,
        subject: options.subject,
        html,
      })
      .then((resp) => resp[0]);
  }

  async sendEmail(params: SendEmailParams): Promise<ClientResponse> {
    try {
      if (params.template.templateId) {
        return this.sendTemplate(
          params.to,
          params.template.templateId,
          params.template.params,
          {
            from: params.from,
            subject: params.subject,
          },
        );
      }
      const html = this.render(params.template.name, params.template.params);
      return this.sendHTML(params.to, html, {
        from: params.from,
        subject: params.subject,
      });
    } catch (error) {
      // TODO: Integrate log provider
      console.log(`Failed to send email:`, `Error: ${error}`);
      throw error;
    }
  }

  async sendMultipleEmails(
    params: SendEmailMultipleParams,
  ): Promise<ClientResponse> {
    try {
      if (params.template.templateId) {
        return this.sendMultipleTemplate(
          params.to,
          params.template.templateId,
          params.template.params,
          {
            from: params.from,
            subject: params.subject,
          },
        );
      }
      const html = this.render(params.template.name, params.template.params);
      return this.sendMultipleHTML(params.to, html, {
        from: params.from,
        subject: params.subject,
      });
    } catch (error) {
      // TODO: Integrate log provider
      console.log(`Failed to send multiple emails:`, `Error: ${error}`);
      throw error;
    }
  }
}
