import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(to: string, subject: string, text: string) {
    await this.mailerService.sendMail({
      to,
      from: 'nextplayportfolio@gmail.com',
      subject,
      text,
    });
  }
}
