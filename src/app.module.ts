import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [ConfigModule, EmailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
