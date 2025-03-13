import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import type {
  SendRawEmailCommandInput,
  SendEmailCommandInput,
  CreateTemplateCommandInput,
  SendBulkTemplatedEmailCommandInput
} from "@aws-sdk/client-ses";
import {
  SESClient,
  SendRawEmailCommand,
  SendEmailCommand,
  ListTemplatesCommand,
  CreateTemplateCommand,
  DeleteTemplateCommand,
  SendBulkTemplatedEmailCommand
} from "@aws-sdk/client-ses";
import { localStackConfig } from "../config/localstack.config";
import { awsConfig } from "../config/aws.config";
import { sesConfig } from "../config/ses.config";
import { emailConfig } from "../config/email.config";
import type { MailOptions } from "./interfaces/mail-options.interface";
import { MailComposer } from "./mail.composer";

@Injectable()
export class SimpleEmailService {
  private logger = new Logger("SimpleEmailService");

  constructor(
    @Inject(sesConfig.KEY)
    private readonly config: ConfigType<typeof sesConfig>,
    @Inject(localStackConfig.KEY)
    private readonly localStackConf: ConfigType<typeof localStackConfig>,
    @Inject(emailConfig.KEY)
    private readonly emailConf: ConfigType<typeof emailConfig>,
    @Inject(awsConfig.KEY)
    private readonly awsConf: ConfigType<typeof awsConfig>
  ) {}

  private getSES(): SESClient {
    const params: any = { region: this.awsConf.region };
    if (this.localStackConf.isLocal) {
      params.endpoint = `http://${this.localStackConf.urlString}`;
    }
    const client = new SESClient(params);

    return client;
  }

  async sendEmail(
    emailTo: string,
    subject: string,
    body: string,
    replyTo?: string
  ): Promise<string | undefined> {
    this.logger.log(`Sending email to ${emailTo}, subject: ${subject}.`);
    let messageId: string | undefined;
    const from = this.config.from;
    const sesClient = this.getSES();

    const param: SendEmailCommandInput = {
      Source: from,
      Destination: { ToAddresses: [emailTo] },
      Message: {
        Subject: { Data: subject },
        Body: { Html: { Data: body } }
      }
    };
    if (replyTo) {
      param.ReplyToAddresses = [
        `${this.emailConf.replyAddressName} <${replyTo}>`
      ];
    }
    try {
      const command = new SendEmailCommand(param);
      const data = await sesClient.send(command);
      this.logger.log(`Email successfully sent to: ${emailTo}.`);
      messageId = data.MessageId;
    } catch (error: any) {
      this.logger.error(`Error sending email to: ${emailTo}.`, error);
    }

    return messageId;
  }

  async sendRawEmail(
    emailTo: string,
    mailOptions: MailOptions
  ): Promise<string | undefined> {
    this.logger.log(
      `Sending raw email to ${emailTo}, options: ${JSON.stringify(
        mailOptions
      )}.`
    );
    const sesClient = this.getSES();
    const from = this.config.from;

    let messageId: string | undefined;

    const data = await MailComposer.getData(mailOptions);
    const param: SendRawEmailCommandInput = {
      Source: from,
      Destinations: [emailTo],
      RawMessage: {
        Data: data
      }
    };

    try {
      const command = new SendRawEmailCommand(param);
      const promiseMessage = await sesClient.send(command);
      messageId = promiseMessage.MessageId;
      this.logger.log(`Email raw successfully sent to ${emailTo}.`);
    } catch (error: any) {
      this.logger.error(`Error sending raw email to ${emailTo}`, error);
    }

    return messageId;
  }

  // async sendBulkEmail(
  //   emailTos: string[],
  //   mailOptions: MailOptions,
  //   metadata: any
  // ): Promise<string | undefined> {
  //   this.logger.log(
  //     `Sending raw email to ${emailTos.join(", ")}options: ${JSON.stringify(
  //       mailOptions
  //     )}.`
  //   );
  //   const sesClient = this.getSES();
  //   const from = this.config.from;

  //   let messageId: string | undefined;

  //   const data = await MailComposer.getData(mailOptions);
  //   const param: SendBulkTemplatedEmailCommandInput = {
  //     Source: from,
  //     Template: "STRING_VALUE",
  //     DefaultTemplateData: "STRING_VALUE",
  //     Destinations: [
  //       {
  //         Destination: {
  //           ToAddresses: emailTos
  //         },
  //         ReplacementTags: [
  //           // TODO: iterate over the metadata keys and generate an array of this.
  //           {
  //             Name: "STRING_VALUE", // required
  //             Value: "STRING_VALUE" // required
  //           }
  //         ],
  //         ReplacementTemplateData: "STRING_VALUE"
  //       }
  //     ]
  //   };

  //   try {
  //     const command = new SendRawEmailCommand(param);
  //     const promiseMessage = await sesClient.send(command);
  //     messageId = promiseMessage.MessageId;
  //     this.logger.log(`Email raw successfully sent to ${emailTo}.`);
  //   } catch (error: any) {
  //     this.logger.error(`Error sending raw email to ${emailTo}`, error);
  //   }

  //   return messageId;
  // }

  async listTemplates(sesClient: SESClient) {
    try {
      const command = new ListTemplatesCommand({ MaxItems: 10 });
      const response = await sesClient.send(command);
      this.logger.log("Templates: ", response.TemplatesMetadata);
    } catch (error) {
      this.logger.error("Error listing templates: ", error);
    }
  }

  async createTemplate(
    templateName: string,
    subject: string,
    htmlPart: string,
    textPart: string
  ) {
    const params: CreateTemplateCommandInput = {
      Template: {
        TemplateName: templateName,
        SubjectPart: subject,
        HtmlPart: htmlPart,
        TextPart: textPart
      }
    };
    const sesClient = this.getSES();

    try {
      const command = new CreateTemplateCommand(params);
      const response = await sesClient.send(command);
      return response; // Handle response appropriately
    } catch (error) {
      console.error("Error creating template:", error);
      throw error; // Handle error appropriately
    }
  }

  async deleteTemplate(templateName: string) {
    const params = {
      TemplateName: templateName
    };
    const sesClient = this.getSES();

    try {
      const command = new DeleteTemplateCommand(params);
      const response = await sesClient.send(command);
      return response; // Handle response appropriately
    } catch (error) {
      console.error("Error deleting template:", error);
      throw error; // Handle error appropriately
    }
  }
}
