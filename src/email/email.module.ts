import { Module } from "@nestjs/common";
import { SendgridAdapter } from "./adapters/sendgrid.adapter";
import { WelcomeSender } from "./services/welcome.sender";
import { MailingProviderService } from "./interfaces/mailing.provider";
import { EmailController } from "./email.controller";

@Module({
  controllers: [EmailController],
  providers: [
    {
      provide: MailingProviderService,
      useClass: SendgridAdapter,
    },
    WelcomeSender,
  ],
  exports: [WelcomeSender],
})
export class EmailModule {}
