import { Controller, Post, Body } from '@nestjs/common';
import { MailingProviderService, SendEmailParams } from './interfaces/email.interface';

@Controller('email')
export class EmailController {
  constructor(private readonly mailingService: MailingProviderService) {}

  @Post('send')
  async sendEmail(@Body() emailData: SendEmailParams<string>) {
    return this.mailingService.sendEmail(emailData);
  }
}
