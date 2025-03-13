import { ApiProperty } from "@nestjs/swagger";

export class EmailTemplateResponseDto {
  @ApiProperty()
  emailsStatus: Record<string, boolean>;
}
