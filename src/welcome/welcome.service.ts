import { Injectable } from "@nestjs/common";
import { EmailService } from "../email/abstract/email.service";
import { TEMPLATE_SUBJECTS, TEMPLATES } from "src/templates";
import { createEmail } from "src/email/utils/create-email.helper";

interface WelcomeEmailParams {
  name: string;
  email: string;
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
        from: "unrankedhappy@gmail.com",
        subject: TEMPLATE_SUBJECTS[TEMPLATES.WELCOME],
      },
    );

    return this.emailService.sendEmail(emailParams);
  }
}
