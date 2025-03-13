import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { QueueModule } from "@BannedCompany/shared-api-v2/src/queue/queue.module";
import { AuthModule } from "../auth/auth.module";
import { EmailsService } from "./emails.service";
import { emailQueueName } from "./email-queue.const";
import { EmailsProcessor } from "./emails.processor";

@Module({
  imports: [
    HttpModule,
    AuthModule,
    QueueModule.registerQueue({ name: emailQueueName })
  ],
  providers: [EmailsService, EmailsProcessor],
  exports: [QueueModule]
})
export class EmailsModule {}
