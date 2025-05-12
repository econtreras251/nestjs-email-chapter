import { Injectable } from "@nestjs/common";
import { EmailService } from "../email/abstract/email.service";
import { TEMPLATE_FILENAMES, TEMPLATES } from "src/email/templates";
import { SendEmailParams } from "src/email/abstract/email.interface";

interface WelcomeEmailParams {
  name: string;
  email: string;
}

@Injectable()
export class WelcomeService {
  constructor(private readonly emailService: EmailService) {}

  async sendWelcomeEmail(serviceParams: WelcomeEmailParams) {
    console.log("Sending welcome email to", serviceParams);

    const emailParams: SendEmailParams<typeof TEMPLATES.WELCOME> = {
      template: {
        name: TEMPLATES.WELCOME,
        params: {
          name: serviceParams.name,
        },
      },
      subject: TEMPLATE_FILENAMES[TEMPLATES.WELCOME],
      to: serviceParams.email,
    };

    return this.emailService.sendEmail(emailParams);
  }
}
