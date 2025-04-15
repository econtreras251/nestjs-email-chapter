import { Injectable } from "@nestjs/common";
import { EmailService } from "./email.service";
import { SendEmailParams } from "./email.interface";

export interface ExampleEmailParams {
  name: string;
  email: string;
}

@Injectable()
export class EmailSender {
  constructor(private readonly emailService: EmailService) {}

  async sendExampleEmail(params: ExampleEmailParams) {
    const emailParams: SendEmailParams<string> = {
      to: params.email,
      subject: "Example Email",
      template: {
        name: "example.html",
        params: {
          name: params.name,
        },
      },
    };

    return this.emailService.sendEmail(emailParams);
  }
}
