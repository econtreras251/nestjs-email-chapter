import { IsNotEmpty, IsString, IsEmail } from "class-validator";

export class SendEmailTemplateDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  verificationUrl: string;
}
