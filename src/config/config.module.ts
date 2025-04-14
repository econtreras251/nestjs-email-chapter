import { Module, Global } from "@nestjs/common";
import { ConfigModule as NestConfig } from "@nestjs/config";
import { emailConfig } from "./email.config";
import { baseConfig } from "./base.config";

@Module({
  imports: [
    NestConfig.forRoot({
      load: [baseConfig, emailConfig],
      isGlobal: true,
      cache: true,
      expandVariables: true,
    }),
  ],
  exports: [NestConfig],
})
@Global()
export class ConfigModule {}
