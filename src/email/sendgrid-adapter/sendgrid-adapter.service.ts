import { Inject, Injectable } from "@nestjs/common";
import { EmailService } from "../abstract/email.service";
import { SendEmailParams } from "../abstract/email.interface";
import { SENDGRID_ADAPTER_PROVIDER_CONFIG } from "./sendgrid-adapter-config-provider.const";
import { SendgridAdapterConfig } from "./sendgrid-adapter-config.interface";
import * as sgMail from "@sendgrid/mail";
import { ClientResponse } from "@sendgrid/mail";
import { Template } from "../templates";
@Injectable()
export class SendgridAdapterService extends EmailService {
  private emailFrom: string;

  constructor(
    @Inject(SENDGRID_ADAPTER_PROVIDER_CONFIG)
    config: SendgridAdapterConfig,
  ) {
    super();
    this.emailFrom = config.emailFrom;
    sgMail.setApiKey(config.sendgridApiKey);
  }

  private async sendHTML(
    to: string,
    html: string,
    options: Pick<SendEmailParams<Template>, "from" | "subject">,
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
    options: Pick<SendEmailParams<Template>, "from" | "subject">,
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

  async sendEmail<T extends Template>(
    params: SendEmailParams<T>,
  ): Promise<ClientResponse> {
    try {
      return this.sendHTML(params.to, params.template.name, {
        from: params.from,
        subject: params.subject,
      });
    } catch (error) {
      console.error("Failed to send email:", error);
      throw error;
    }
  }
}
