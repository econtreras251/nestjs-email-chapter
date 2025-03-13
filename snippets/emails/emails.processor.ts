import { Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job } from "bull";
import type { NotificationBase } from "@BannedCompany/core-api/src/models/NotificationBase";
import { emailQueueName } from "./email-queue.const";
import { EmailsService } from "./emails.service";

@Processor(emailQueueName)
export class EmailsProcessor {
  private logger = new Logger(EmailsProcessor.name);

  constructor(private readonly emailService: EmailsService) {}

  @Process()
  async onWrite(job: Job<NotificationBase>) {
    this.logger.log(`Sending email: ${job.data.notificationType}`);

    try {
      await this.emailService.sendEmail(job.data);
    } catch (err: any) {
      this.logger.warn(err.message);
      throw err;
    }

    this.logger.log(`Email sent: ${job.data.notificationType}`);
  }
}
