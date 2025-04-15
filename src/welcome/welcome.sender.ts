import { Injectable } from "@nestjs/common";
import { EmailService } from "../email/abstract/email.service";
import { SendEmailParams } from "../email/abstract/email.interface";
import { TemplateService } from "../email/templates/template.service";

export interface WelcomeEmailParams {
  name: string;
  email: string;
}

@Injectable()
export class WelcomeSender {
  constructor(
    private readonly emailService: EmailService,
    private readonly templateService: TemplateService,
  ) {}

  async sendWelcomeEmail(params: WelcomeEmailParams) {
    const html = await this.templateService.render("welcome", {
      name: params.name,
    });

    const emailParams: SendEmailParams<string> = {
      to: params.email,
      subject: "Welcome to Our Platform!",
      template: {
        name: "welcome",
        params: {
          html,
        },
      },
    };

    return this.emailService.sendEmail(emailParams);
  }
}
