import { Injectable } from "@nestjs/common";
import { WelcomeSender } from "./welcome.sender";
import { WelcomeEmailParams } from "./welcome.sender";

@Injectable()
export class WelcomeService {
  constructor(private readonly welcomeSender: WelcomeSender) {}

  async sendWelcomeEmail(params: WelcomeEmailParams) {
    console.log("Sending welcome email to", params);
    return this.welcomeSender.sendWelcomeEmail(params);
  }
}
