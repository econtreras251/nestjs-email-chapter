import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { FileModule } from "../file/file.module";
import { UserModule } from "../users/user.module";
import { EmailController } from "./email.controller";
import { EmailService } from "./email.service";
import { SimpleEmailService } from "./simple-email.service";

@Module({
  imports: [AuthModule, UserModule, FileModule],
  controllers: [EmailController],
  providers: [EmailService, SimpleEmailService],
  exports: [EmailService]
})
export class EmailModule {}
