import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from '@/app/services/email.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',

          auth: {
            user: 'nextplayportfolio@gmail.com',
            pass: 'btpv bnwd dqyl mulr',
          },
        },
        defaults: {
          from: '"No Reply" <noreply@example.com>',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
