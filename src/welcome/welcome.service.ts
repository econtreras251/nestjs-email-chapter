import { Injectable } from "@nestjs/common";
import { EmailService } from "../email/abstract/email.service";
import { TEMPLATE_SUBJECTS, TemplateParamsMap, TEMPLATES } from "src/templates";

interface WelcomeEmailParams {
  name: string;
  email: string;
}

interface ConfirmationEmailParams {
  name: string;
  email: string;
  verificationUrl: string;
}

@Injectable()
export class WelcomeService {
  constructor(private readonly emailService: EmailService) {}

  async sendWelcomeEmail(serviceParams: WelcomeEmailParams) {
    const rendered = await this.emailService.renderTemplate<
      typeof TEMPLATES,
      TemplateParamsMap
    >({
      name: TEMPLATES.WELCOME,
      params: {
        name: serviceParams.name,
      },
    });

    return this.emailService.sendEmail({
      to: serviceParams.email,
      subject: TEMPLATE_SUBJECTS[TEMPLATES.WELCOME],
      content: rendered,
    });
  }

  async sendTemplateEmail(
    serviceParams: ConfirmationEmailParams,
    templateId: string,
  ) {
    return this.emailService.sendEmail({
      to: serviceParams.email,
      subject: TEMPLATE_SUBJECTS[TEMPLATES.VERIFICATION],
      content: {
        html: "",
        templateId,
        params: serviceParams,
      },
    });
  }
}
