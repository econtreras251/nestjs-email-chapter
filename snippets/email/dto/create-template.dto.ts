import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

// TODO: this DTO needs to be removed, only exists to test the templates creation in SES
export class CreateTemplateDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  locale?: string;

  @IsString()
  @ApiProperty()
  notificationType: string;

  @IsString()
  @ApiProperty()
  functionName: string;
}
