import type { Queue } from "bull";
import { ApplicationId } from "@BannedCompany/shared-util/src/enums/ApplicationId";
import { EmailSenderService } from "./email-sender.service";

class TestEmailSenderService extends EmailSenderService<any, any> {
  notificationType = "test";
  functionName = "test";

  protected buildData(args?: any): void | Promise<void> {
    this.metadata = args;
    this.recipients = ["test@mail.com"];
  }
}

describe(EmailSenderService.name, () => {
  let queue: Queue;
  let testSender: EmailSenderService<any, any>;

  beforeEach(() => {
    queue = {
      add: jest.fn(),
      client: {
        status: "ready"
      }
    } as unknown as Queue;
    testSender = new TestEmailSenderService(queue);
  });

  it("should have a module", () => {
    expect(EmailSenderService).toBeDefined();
  });

  it("should post a message to the message queue so an email gets sent", async () => {
    await testSender.requestSendEmail({ pipipi: "pipipi" });

    expect(queue.add).toHaveBeenCalledWith(
      expect.objectContaining({
        applicationId: ApplicationId.BannedCompanyTravel,
        notificationType: "test",
        functionName: "test",
        metadata: {
          pipipi: "pipipi"
        },
        recipients: ["test@mail.com"]
      })
    );
  });

  it("should not post a message to the message queue if it isn't available", async () => {
    queue.client.status = "close";

    await testSender.requestSendEmail();

    expect(queue.add).not.toHaveBeenCalled();
  });
});
