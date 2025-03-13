import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class MailAttachmentDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  filename?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  path?: string;
}
