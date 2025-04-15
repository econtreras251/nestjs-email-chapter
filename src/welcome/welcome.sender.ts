import { Injectable } from "@nestjs/common";
import { EmailService } from "../email/abstract/email.service";
import { SendEmailParams } from "../email/abstract/email.interface";

export interface WelcomeEmailParams {
  name: string;
  email: string;
}

@Injectable()
export class WelcomeSender {
  constructor(private readonly emailService: EmailService) {}

  async sendWelcomeEmail(params: WelcomeEmailParams) {
    const emailParams: SendEmailParams<string> = {
      to: params.email,
      subject: "Welcome Email",
      template: {
        name: "welcome.html",
        params: {
          name: params.name,
        },
      },
    };

    return this.emailService.sendEmail(emailParams);
  }
}
