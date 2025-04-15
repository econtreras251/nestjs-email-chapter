import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "./config/config.module";
import { EmailAbstractModule } from "./email/abstract/email-abstract.module";
import { emailConfig } from "./config/email.config";
import { ConfigType } from "@nestjs/config";
import { SendgridAdapterModule } from "./email/sendgrid-adapter/sendgrid-adapter.module";

@Module({
  imports: [
    ConfigModule,
    EmailAbstractModule.forRoot({
      adapter: SendgridAdapterModule.registerAsync({
        inject: [emailConfig.KEY],
        useFactory: (email: ConfigType<typeof emailConfig>) => ({
          apiKey: email.sendgridApiKey,
          fromEmail: email.emailFrom,
        }),
      }),
      useDefaultController: true,
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
