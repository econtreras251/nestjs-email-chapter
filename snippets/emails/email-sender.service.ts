import type { Queue } from "bull";
import { NotificationBase } from "@BannedCompany/core-api/src/models/NotificationBase";
import { ApplicationId } from "@BannedCompany/shared-util/src/enums/ApplicationId";
import { Logger } from "@nestjs/common";

export abstract class EmailSenderService<
  TData extends object,
  TArgs extends object = never
> extends NotificationBase {
  private logger = new Logger(EmailSenderService.name);

  applicationId = ApplicationId.BannedCompanyTravel;
  metadata: TData;

  constructor(private readonly queue: Queue<NotificationBase>) {
    super();
  }

  async requestSendEmail(args?: TArgs): Promise<void> {
    const notification = this.clone();
    await notification.buildData(args);

    await this.postEventToMq({
      applicationId: notification.applicationId,
      functionName: notification.functionName,
      metadata: notification.metadata,
      notificationType: notification.notificationType,
      recipients: notification.recipients
    });
  }

  protected abstract buildData(args?: TArgs): void | Promise<void>;

  private async postEventToMq(event: NotificationBase): Promise<void> {
    if (this.queue.client.status !== "ready") {
      this.logger.warn(
        `Redis is not available - Event was discarded.\n${JSON.stringify(
          event,
          null,
          2
        )}`
      );
      return;
    }

    await this.queue.add(event);
  }

  private clone(): EmailSenderService<TData, TArgs> {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }
}
