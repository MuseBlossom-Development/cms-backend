import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Email, EmailSchema } from 'src/schemas/email.schema';
import { ErrorResponse } from 'src/common/error/ErrorResponse';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Email.name, schema: EmailSchema }]),
    MailerModule.forRootAsync({
      useFactory: () => ({
        // transport: 'smtps://user@example.com:topsecret@smtp.example.com',
        transport: {
          service: 'Daum',
          host: 'smtp.daum.net',
          port: 456,
          secure: true, // port 456 true
          auth: {
            user: process.env.MAIL_AUTH_USER,
            pass: process.env.MAIL_AUTH_PASS,
          },
        },
        defaults: {
          from: `"뮤즈블라썸 CMS" "<${process.env.MAIL_FROM}>"`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [MailService, ErrorResponse],
  exports: [MailService],
})
export class MailModule {}
