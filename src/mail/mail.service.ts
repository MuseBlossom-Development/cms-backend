import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ErrorResponse } from 'src/common/error/ErrorResponse';
import { Email, EmailDocument } from 'src/schemas/email.schema';

@Injectable()
export class MailService {
  constructor(
    @InjectModel(Email.name) private emailModel: Model<EmailDocument>,
    private readonly errorResponse: ErrorResponse,
    private mailerService: MailerService,
  ) {}

  async createAuthNum(email: string, name: string) {
    const createEmailAuth = {
      email,
      auth_num: '',
    };
    const min = Math.ceil(11111);
    const max = Math.floor(99999);
    const random = () =>
      (Math.floor(Math.random() * (max - min)) + min).toString();

    createEmailAuth.auth_num = random();

    try {
      await this.emailModel.create(createEmailAuth);

      console.log('메일 인증 보냄');
      await this.mailerService.sendMail({
        to: email,
        subject: '[ 뮤즈블라썸 ] 회원가입 이메일 인증번호',
        template: './authMailCheck',
        context: {
          name,
          num: createEmailAuth.auth_num,
        },
      });
    } catch (error) {
      console.log(error);
      this.errorResponse.Internal_Server();
    }

    return true;
  }
}
