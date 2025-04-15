import { Module } from "@nestjs/common";
import { WelcomeService } from "./welcome.service";
import { WelcomeSender } from "./welcome.sender";
import { WelcomeController } from "./welcome.controller";

@Module({
  providers: [WelcomeService, WelcomeSender],
  controllers: [WelcomeController],
  exports: [WelcomeService],
})
export class WelcomeModule {}
