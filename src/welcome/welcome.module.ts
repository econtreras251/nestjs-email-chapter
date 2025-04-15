import { Module } from "@nestjs/common";
import { WelcomeService } from "./welcome.service";
import { WelcomeSender } from "./welcome.sender";
import { WelcomeController } from "./welcome.controller";
import { TemplateService } from "../email/templates/template.service";

@Module({
  providers: [WelcomeService, WelcomeSender, TemplateService],
  controllers: [WelcomeController],
  exports: [WelcomeService],
})
export class WelcomeModule {}
