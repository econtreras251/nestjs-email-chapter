import { Inject, Injectable } from "@nestjs/common";
import { EmailService } from "../abstract/email.service";
import { SendEmailParams, TemplateParams } from "../abstract/email.interface";
import { SENDGRID_ADAPTER_PROVIDER_CONFIG } from "./sendgrid-adapter-config-provider.const";
import { SendgridAdapterConfig } from "./sendgrid-adapter-config.interface";
import * as sgMail from "@sendgrid/mail";
import { ClientResponse } from "@sendgrid/mail";
import { Template, TEMPLATE_PATHS } from "../templates";
import * as pug from "pug";

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
      const html = this.renderTemplate(
        params.template.name,
        params.template.params,
      );
      return this.sendHTML(params.to, html, {
        from: params.from,
        subject: params.subject,
      });
    } catch (error) {
      console.error("Failed to send email:", error);
      throw error;
    }
  }

  private renderTemplate(
    template: Template,
    params: TemplateParams[Template],
  ): string {
    const templatePath = TEMPLATE_PATHS[template];
    const html = pug.renderFile(templatePath, params);
    return html;
  }
}
