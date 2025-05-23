import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "./config/config.module";
import { EmailAbstractModule } from "./email/abstract/email-abstract.module";
import { emailConfig } from "./config/email.config";
import { ConfigType } from "@nestjs/config";
import { SendgridAdapterModule } from "./email/sendgrid-adapter/sendgrid-adapter.module";
import { WelcomeModule } from "./welcome/welcome.module";
import { PugCompilerModule } from "./templates/pug-compiler/pug-compiler.module";

@Module({
  imports: [
    ConfigModule,
    EmailAbstractModule.forRoot({
      templateService: PugCompilerModule,
      adapter: SendgridAdapterModule.registerAsync({
        inject: [emailConfig.KEY],
        useFactory: (email: ConfigType<typeof emailConfig>) => ({
          sendgridApiKey: email.sendgridApiKey,
          emailFrom: email.emailFrom,
        }),
      }),
      isGlobal: true,
    }),
    WelcomeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
