import { Controller, Post, Body } from "@nestjs/common";
import { WelcomeEmailParams } from "./services/welcome.sender";
import { WelcomeSender } from "./services/welcome.sender";

@Controller("email")
export class EmailController {
  constructor(private readonly welcomeSender: WelcomeSender) {}

  @Post("send")
  async sendEmail(@Body() emailData: WelcomeEmailParams) {
    return this.welcomeSender.sendWelcomeEmail(emailData);
  }
}
