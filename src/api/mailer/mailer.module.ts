import { Module } from '@nestjs/common';
import { MailerService } from './providers/mailer.service';

@Module({
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}