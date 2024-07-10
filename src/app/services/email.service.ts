import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(to: string, username: string, resetLink: string) {
    await this.mailerService.sendMail({
      to,
      from: 'nextplayportfolio@gmail.com',
      subject: 'Password Reset Request',
      template: './password-reset',
      context: {
        username,
        resetLink,
      },
    });
  }
}
