import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import sgMail, { ClientResponse } from '@sendgrid/mail';
import { SendEmailParams } from '../interfaces/email.interface';
import { emailConfig } from '../../config/email.config';

export class SendgridSender {
  constructor(
    @Inject(emailConfig.KEY)
    private readonly emailConf: ConfigType<typeof emailConfig>,
  ) {
    sgMail.setApiKey(emailConf.sendgridApiKey);
  }

  async sendHTML(
    to: string,
    html: string,
    options: Pick<SendEmailParams<string>, 'from' | 'subject'>,
  ): Promise<ClientResponse> {
    options.from = options.from || this.emailConf.emailFrom;
    options.subject = options.subject || '';
    return sgMail
      .send({
        to,
        from: options.from,
        subject: options.subject,
        html,
      })
      .then((resp) => resp[0]);
  }

  async sendTemplate(
    to: string,
    templateId: string,
    locals: Record<string, any>,
    options: Pick<SendEmailParams<string>, 'from' | 'subject'>,
  ): Promise<ClientResponse> {
    options.from = options.from || this.emailConf.emailFrom;
    options.subject = options.subject || '';
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
}