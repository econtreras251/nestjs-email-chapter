import NodeMailComposer from "nodemailer/lib/mail-composer";
import type Mail from "nodemailer/lib/mailer";
import type { MailOptions } from "./interfaces/mail-options.interface";

export class MailComposer {
  public static async getData(mailOptions: MailOptions): Promise<Buffer> {
    const options: Mail.Options = {
      subject: mailOptions.subject,
      text: mailOptions.text,
      html: mailOptions.html,
      to: mailOptions.to,
      attachments: (mailOptions.attachments || []) as Mail.Attachment[]
    };

    const instance = new NodeMailComposer(options).compile();

    const promise: Promise<Buffer> = new Promise((resolve, reject) => {
      instance.build((err: Error | null, buf: Buffer) => {
        if (err) {
          reject(err);
        }

        resolve(buf);
      });
    });

    return promise;
  }
}
