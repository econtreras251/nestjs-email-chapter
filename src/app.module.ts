import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "./config/config.module";
import { EmailAbstractModule } from "./email/abstract/email-abstract.module";
import { emailConfig } from "./config/email.config";
import { ConfigType } from "@nestjs/config";
import { SendgridAdapterModule } from "./email/sendgrid-adapter/sendgrid-adapter.module";
import { WelcomeModule } from "./welcome/welcome.module";
import { PugTemplateAdapterModule } from "./email/pug-template/pug-template-adapter.module";

@Module({
  imports: [
    ConfigModule,
    EmailAbstractModule.forRoot({
      adapter: SendgridAdapterModule.registerAsync({
        inject: [emailConfig.KEY],
        useFactory: (email: ConfigType<typeof emailConfig>) => ({
          sendgridApiKey: email.sendgridApiKey,
          emailFrom: email.emailFrom,
        }),
      }),
      templateService: PugTemplateAdapterModule.register(),
      isGlobal: true,
    }),
    WelcomeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
