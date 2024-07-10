import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from '@/app/services/email.service';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Logger } from '@nestjs/common';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const templateDir = join(__dirname, '../mail/templates');
        Logger.log(`Template directory: ${templateDir}`); // Adicionando log do caminho do template
        return {
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
          template: {
            dir: templateDir,
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
