import { Body, Controller, Param, Post } from "@nestjs/common";
import { WelcomeService } from "./welcome.service";
import { SendEmailDto } from "./dto/send-email.dto";
import { SendEmailTemplateDto } from "./dto/send-email-template.dto";

// TODO: Refactor to use generic dto for all email's send methods
@Controller("welcome")
export class WelcomeController {
  constructor(private readonly welcomeService: WelcomeService) {}

  @Post("send-email")
  async sendWelcomeEmail(@Body() params: SendEmailDto) {
    return this.welcomeService.sendWelcomeEmail(params);
  }

  @Post("send-template/:templateId")
  async sendTemplateEmail(
    @Body() params: SendEmailTemplateDto,
    @Param("templateId") templateId: string,
  ) {
    return this.welcomeService.sendTemplateEmail(params, templateId);
  }
}
