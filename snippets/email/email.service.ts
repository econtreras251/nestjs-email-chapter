import { Inject, Injectable } from "@nestjs/common";
import * as Sqrl from "squirrelly";
import { EmailHelper } from "@BannedCompany/shared-util/src/helpers/EmailHelper";
import { ConfigType } from "@nestjs/config";
import type { DeleteTemplateCommandOutput } from "@aws-sdk/client-ses";
import type { ApplicationId } from "../config/application-id.enum";
import { CoreContextService } from "../config/context.service";
import { sesConfig } from "../config/ses.config";
import { FileService } from "../file/file.service";
import type { EmailTemplateResponseDto } from "./dto/email-template-response.dto";
import type { NotificationEmailDto } from "./dto/notification-email.dto";
import type { MailAttachmentDto } from "./dto/mail-attachment.dto";
import type { MailOptions } from "./interfaces/mail-options.interface";
import { SimpleEmailService } from "./simple-email.service";
import type { CreateTemplateDto } from "./dto/create-template.dto";

@Injectable()
export class EmailService {
  constructor(
    @Inject(sesConfig.KEY)
    private readonly config: ConfigType<typeof sesConfig>,
    private contextService: CoreContextService,
    private fileService: FileService,
    private simpleEmailService: SimpleEmailService
  ) {}

  private pathPatternLayout =
    "{{applicationId}}/notifications/_layout.{{locale}}.html";

  private getLayoutFilePath(applicationId: string, locale: string): string {
    const path = this.pathPatternLayout
      .replace("{{applicationId}}", applicationId)
      .replace("{{locale}}", locale);
    return path;
  }

  private async getMailLayout(
    applicationId: string,
    locale: string
  ): Promise<string | undefined> {
    let filename = this.getLayoutFilePath(applicationId, locale);

    let template = await this.fileService.getTextFileContents(filename);

    if (!template && locale != "en") {
      filename = this.getLayoutFilePath(applicationId, "en");
      template = await this.fileService.getTextFileContents(filename);
    }
    return template;
  }

  private async getMailTemplate(
    applicationId: string,
    templateName: string,
    type: string,
    locale: string,
    ext: string,
    withLayout = true
  ): Promise<string | undefined> {
    let filename = `${applicationId}/notifications/${templateName}.${type}.${locale}.${ext}`;

    let layout: string | undefined;
    if (withLayout) {
      layout = await this.getMailLayout(applicationId, locale);
    }

    let template = await this.fileService.getTextFileContents(filename);

    if (!template && locale != "en") {
      filename = `${applicationId}/notifications/${templateName}.${type}.en.${ext}`;
      template = await this.fileService.getTextFileContents(filename);
    }

    if (withLayout && layout && template) {
      template = layout.replace("<content />", template);
    }

    return template;
  }

  private async processBodyTemplate(
    templateName: string,
    locale?: string,
    data?: any[]
  ): Promise<string | undefined> {
    const applicationId = this.contextService.getApplicationId();

    if (!locale) {
      locale = "en";
    }

    let template = await this.getMailTemplate(
      applicationId,
      templateName,
      "body",
      locale,
      "html"
    );

    if (template && data) {
      Sqrl.defaultConfig.autoEscape = false;
      template = Sqrl.render(template, data);
    }
    const regex = /{{it\.([^}]+)}}/g;
    return template.replace(regex, "{{$1}}");
  }

  private async processSubjectTemplate(
    templateName: string,
    locate?: string,
    data?: any[]
  ): Promise<string> {
    const applicationId = this.contextService.getApplicationId();

    if (!locate) {
      locate = "en";
    }

    let template = await this.getMailTemplate(
      applicationId,
      templateName,
      "subject",
      locate,
      "txt",
      false
    );

    if (template && data) {
      Sqrl.defaultConfig.autoEscape = false;
      template = Sqrl.render(template, data);
    }

    const regex = /{{it\.([^}]+)}}/g;
    return template.replace(regex, "{{$1}}");
  }

  private sanitize(email: string): string {
    const pattern = this.config.forceEmailSanitizePattern;
    email = email.replace(/[@|\+\.]/g, "_");
    if (pattern) {
      email = pattern.replace("{{email}}", email);
    }
    return email;
  }

  private async sendEmail(
    emailTo: string,
    body: string,
    subject: string,
    applicationId: ApplicationId,
    emailType: string,
    metaData?: any,
    withoutDuplicating = false,
    attachments?: MailAttachmentDto[]
  ): Promise<boolean> {
    let result = false;
    let emailId = undefined;
    const includeAttachments = Boolean(attachments?.length);

    let emailNormalized = EmailHelper.normalize(emailTo);
    if (this.config.forceEmailSanitize) {
      emailNormalized = this.sanitize(emailNormalized);
    }

    try {
      const optionsRaw: MailOptions = {
        subject,
        html: body,
        text: body,
        to: emailNormalized,
        attachments
      };
      const method = includeAttachments
        ? this.simpleEmailService.sendRawEmail(emailNormalized, optionsRaw)
        : this.simpleEmailService.sendEmail(emailNormalized, subject, body);

      emailId = (await method) ?? "";
      if (!emailId || emailId === "") {
        result = false;
      } else {
        // TODO: [Persist succesful emails sent]
        result = true;
      }
    } catch (err: any) {
      // TODO: [Persist failed emails sent]
      result = false;
    }
    return result;
  }

  async sendEmailTemplate(
    sendEmailRequest: NotificationEmailDto
  ): Promise<EmailTemplateResponseDto> {
    let result: EmailTemplateResponseDto;

    const metadata = sendEmailRequest?.metadata as any;

    if (metadata) {
      for (const key in metadata) {
        const value: any = metadata[key];
        if (typeof value == "string") {
          metadata[key] = value.replace(/[\n]/g, "<br/>");
        }
      }
    }

    const body = await this.processBodyTemplate(
      sendEmailRequest.notificationType,
      sendEmailRequest.locale,
      metadata
    );
    const subject = await this.processSubjectTemplate(
      sendEmailRequest.notificationType,
      sendEmailRequest.locale,
      metadata
    );
    if (body && subject) {
      console.log(
        `Sending Emails: ${JSON.stringify(sendEmailRequest.recipients)}`
      );

      result = { emailsStatus: {} };
      for (let index = 0; index < sendEmailRequest.recipients.length; index++) {
        const emailTo = sendEmailRequest.recipients[index];

        const sent = await this.sendEmail(
          emailTo,
          body,
          subject,
          sendEmailRequest.applicationId,
          sendEmailRequest.notificationType,
          sendEmailRequest.metadata,
          sendEmailRequest.withoutDuplicating,
          sendEmailRequest.attachments
        );

        result.emailsStatus[emailTo] = sent;
      }
    } else {
      console.log(
        "Email dont send - missing body template or subject template."
      );
    }

    return result;
  }

  private removeConditionals(template: string) {
    const regex =
      /{{@if\(it\.round > 1\)}}\s*|{{@if\(it\.round === 2\)}}|{{#elif\(it\.round === 3\)}}|{{#else}}|{{\/if}}/g;

    return template.replace(regex, "");
  }

  private addConditionals(template: string) {
    const regex = /a{{round}}ndrdth/g;

    return template
      .replace(
        regex,
        "a{{#if round > 1}} {{round}}{{#if round == 2}}nd{{else if round == 3}}rd{{else}}th{{/if}}{{/if}}"
      )
      .replace("{{new Date().getFullYear()}}", "{{year}}");
  }

  async createTemplate(
    createTemplateRequest: CreateTemplateDto
  ): Promise<DeleteTemplateCommandOutput> {
    let body = await this.processBodyTemplate(
      createTemplateRequest.notificationType,
      createTemplateRequest.locale
    );
    const subject = await this.processSubjectTemplate(
      createTemplateRequest.notificationType,
      createTemplateRequest.locale
    );

    body = this.removeConditionals(body);
    // body = this.addConditionals(body);
    return this.simpleEmailService.createTemplate(
      createTemplateRequest.notificationType,
      subject,
      "",
      ""
    );
  }
}
