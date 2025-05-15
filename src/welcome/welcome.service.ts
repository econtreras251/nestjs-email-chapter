import { Injectable } from "@nestjs/common";
import { EmailService } from "../email/abstract/email.service";
import { TEMPLATES } from "src/templates";
import { buildEmailParams } from "src/email/utils/build-email.helper";

interface WelcomeEmailParams {
  name: string;
  email: string;
}

@Injectable()
export class WelcomeService {
  constructor(private readonly emailService: EmailService) {}

  async sendWelcomeEmail(serviceParams: WelcomeEmailParams) {
    const emailParams = buildEmailParams(
      TEMPLATES.WELCOME,
      {
        name: serviceParams.name,
      },
      { to: serviceParams.email },
    );

    return this.emailService.sendEmail(emailParams);
  }
}
