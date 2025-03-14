import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { MailingProviderService } from './interfaces/email.interface';
import { SendgridAdapter } from './adapters/sendgrid.adapter';

@Module({
  controllers: [EmailController],
  providers: [
    {
      provide: MailingProviderService,
      useClass: SendgridAdapter,
    },
  ],
  exports: [MailingProviderService],
})
export class EmailModule {}
