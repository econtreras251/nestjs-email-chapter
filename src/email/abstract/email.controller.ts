import { Body, Controller, Post } from "@nestjs/common";
import { EmailSender, ExampleEmailParams } from "./email.sender";

// TODO: remove this controller and make it a separate module
@Controller("email")
export class EmailController {
  constructor(private readonly emailSender: EmailSender) {}

  @Post("send")
  async sendEmail(@Body() params: ExampleEmailParams) {
    return this.emailSender.sendExampleEmail(params);
  }
}
