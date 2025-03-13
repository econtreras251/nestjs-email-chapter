import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { bannedOkResponseDoc } from "@BannedCompany/shared-api-v2/src/common/decorators/banned-ok-response-doc.decorator";
import { HttpOkResponse } from "@BannedCompany/shared-api-v2/src/common/dto/ok.response";
import type { DeleteTemplateCommandOutput } from "@aws-sdk/client-ses";
import { AuthGuard } from "../auth/auth.guard";
import { NotificationEmailDto } from "./dto/notification-email.dto";
import type { EmailTemplateResponseDto } from "./dto/email-template-response.dto";
import { EmailService } from "./email.service";
import { CreateTemplateDto } from "./dto/create-template.dto";

@Controller("emails")
@UseGuards(AuthGuard)
@ApiTags("emails")
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post("send-template")
  @bannedOkResponseDoc()
  async logout(
    @Body() sendEmailRequest: NotificationEmailDto
  ): Promise<HttpOkResponse<EmailTemplateResponseDto>> {
    const response = await this.emailService.sendEmailTemplate(
      sendEmailRequest
    );
    return new HttpOkResponse(response);
  }

  @Post("create-template")
  @bannedOkResponseDoc()
  async createTemplate(
    @Body() sendEmailRequest: CreateTemplateDto
  ): Promise<HttpOkResponse<DeleteTemplateCommandOutput>> {
    const response = await this.emailService.createTemplate(sendEmailRequest);
    return new HttpOkResponse(response);
  }
}
