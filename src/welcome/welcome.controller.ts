import { Body, Controller, Post } from "@nestjs/common";
import { WelcomeService } from "./welcome.service";
import { SendEmailDto } from "./dto/send-email.dto";

@Controller("welcome")
export class WelcomeController {
  constructor(private readonly welcomeService: WelcomeService) {}

  @Post("send-email")
  async sendWelcomeEmail(@Body() params: SendEmailDto) {
    return this.welcomeService.sendWelcomeEmail(params);
  }
}
