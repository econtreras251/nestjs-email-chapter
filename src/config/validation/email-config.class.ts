import { plainToInstance } from "class-transformer";
import { IsString } from "class-validator";

export class EmailConfig {
    @IsString()
    emailFrom!: string;

    @IsString()
    sendgridApiKey!: string;

    static fromPlain(plain: object): EmailConfig {
        return plainToInstance(EmailConfig, plain);
    }
}
