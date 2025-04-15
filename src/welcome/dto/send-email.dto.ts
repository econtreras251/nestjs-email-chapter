import { IsNotEmpty, IsString, IsEmail } from "class-validator";

export class SendEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
