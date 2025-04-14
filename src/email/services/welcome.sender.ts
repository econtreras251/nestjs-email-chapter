import { Injectable } from "@nestjs/common";
import { SendEmailParams } from "../interfaces/email.interface";
import { MailingProviderService } from "../interfaces/mailing.provider";

export interface WelcomeEmailParams {
  name: string;
  email: string;
}

@Injectable()
export class WelcomeSender {
  constructor(
    private readonly mailingProviderService: MailingProviderService,
  ) {}

  async sendWelcomeEmail(params: WelcomeEmailParams): Promise<void> {
    const emailParams: SendEmailParams<string> = {
      to: params.email,
      subject: "Welcome to Our Service",
      template: {
        name: "welcome.html",
        params: {
          name: params.name,
        },
      },
    };

    await this.mailingProviderService.sendEmail(emailParams);
  }
}
