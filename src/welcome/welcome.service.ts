import { Injectable } from "@nestjs/common";
import { EmailService } from "../email/abstract/email.service";
import { TEMPLATE_SUBJECTS, TEMPLATES } from "src/templates";
import { createEmail } from "src/email/utils/create-email.helper";

interface WelcomeEmailParams {
  name: string;
  email: string;
}

interface ConfirmationEmailParams {
  email: string;
  name: string;
  verificationUrl: string;
}

@Injectable()
export class WelcomeService {
  constructor(private readonly emailService: EmailService) {}

  async sendWelcomeEmail(serviceParams: WelcomeEmailParams) {
    const emailParams = createEmail(
      TEMPLATES.WELCOME,
      {
        name: serviceParams.name,
      },
      {
        to: serviceParams.email,
        subject: TEMPLATE_SUBJECTS[TEMPLATES.WELCOME],
      },
    );

    return this.emailService.sendEmail(emailParams);
  }

  async sendTemplateEmail(
    serviceParams: ConfirmationEmailParams,
    templateId: string,
  ) {
    return this.emailService.sendEmail({
      to: serviceParams.email,
      subject: TEMPLATE_SUBJECTS[TEMPLATES.VERIFICATION],
      template: {
        name: "template",
        templateId,
        params: serviceParams,
      },
    });
  }
}
