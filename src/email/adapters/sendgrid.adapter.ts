import { Inject } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import sgMail, { ClientResponse } from "@sendgrid/mail";
import { Injectable } from "@nestjs/common";
import { emailConfig } from "../../config/email.config";
import { SendEmailParams } from "../interfaces/email.interface";
import { MailingProviderService } from "../interfaces/mailing.provider";

@Injectable()
export class SendgridAdapter extends MailingProviderService {
  constructor(
    @Inject(emailConfig.KEY)
    private readonly emailConf: ConfigType<typeof emailConfig>,
  ) {
    super();
    sgMail.setApiKey(emailConf.sendgridApiKey);
  }

  private async sendHTML(
    to: string,
    html: string,
    options: Pick<SendEmailParams<string>, "from" | "subject">,
  ): Promise<ClientResponse> {
    options.from = options.from || this.emailConf.emailFrom;
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
    options: Pick<SendEmailParams<string>, "from" | "subject">,
  ): Promise<ClientResponse> {
    options.from = options.from || this.emailConf.emailFrom;
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

  async sendEmail(params: SendEmailParams<string>): Promise<ClientResponse> {
    if (params.template.name.includes("html")) {
      return this.sendHTML(params.to, params.template.name, {
        from: params.from,
        subject: params.subject,
      });
    }

    return this.sendTemplate(
      params.to,
      params.template.name,
      params.template.params,
      {
        from: params.from,
        subject: params.subject,
      },
    );
  }
}
