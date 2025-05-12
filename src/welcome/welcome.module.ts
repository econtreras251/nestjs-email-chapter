import { Module } from "@nestjs/common";
import { WelcomeService } from "./welcome.service";
import { WelcomeController } from "./welcome.controller";

@Module({
  providers: [WelcomeService],
  controllers: [WelcomeController],
  exports: [WelcomeService],
})
export class WelcomeModule {}
