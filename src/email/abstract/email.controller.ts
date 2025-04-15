import { Body, Controller, Post } from "@nestjs/common";
import { EmailSender, ExampleEmailParams } from "./email.sender";

@Controller("email")
export class EmailController {
  constructor(private readonly emailSender: EmailSender) {}

  @Post("send")
  async sendEmail(@Body() params: ExampleEmailParams) {
    return this.emailSender.sendExampleEmail(params);
  }
}
