import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsObject,
  IsOptional,
  IsString
} from "class-validator";
import { ApplicationId } from "../../config/application-id.enum";
import { MailAttachmentDto } from "./mail-attachment.dto";

export class NotificationEmailDto {
  @IsArray()
  @IsString({ each: true })
  @ApiProperty()
  recipients: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  locale?: string;

  @IsEnum(ApplicationId)
  @ApiProperty({ enum: ApplicationId, enumName: "ApplicationId" })
  applicationId: ApplicationId;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiPropertyOptional()
  bcc?: string[];

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  withoutDuplicating?: boolean;

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({ type: MailAttachmentDto })
  attachments?: MailAttachmentDto[];

  @IsString()
  @ApiProperty()
  notificationType: string;

  @IsString()
  @ApiProperty()
  functionName: string;

  @ApiProperty()
  @IsObject()
  metadata: object;
}
