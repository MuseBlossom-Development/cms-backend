import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { Users } from 'src/entities/users.entity';
import { ErrorResponse } from 'src/common/error/ErrorResponse';
import { MailService } from 'src/mail/mail.service';
import { InjectModel } from '@nestjs/mongoose';
import { Email, EmailDocument } from 'src/schemas/email.schema';
import { Model } from 'mongoose';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @Inject(MailService) private mailService: MailService,
    @InjectModel(Email.name) private emailModel: Model<EmailDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly errorResponse: ErrorResponse,
  ) {}
  private readonly secretAccess = process.env.JWT_ACCESS_TOKEN_SECRET;
  private readonly secretRefresh = process.env.JWT_REFRESH_TOKEN_SECRET;

  // 아이디 중복 확인
  async userCheck(user_id: string) {
    const findUser = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.user_id = :user_id', { user_id })
      .getOne();

    if (findUser) {
      return false;
    }

    return true;
  }

  // email 중복 확인
  async emailCheck(email: string) {
    try {
      const findEmail = await this.usersRepository
        .createQueryBuilder()
        .select('email')
        .where('email = :check', { check: email })
        .getOne();

      console.log(findEmail);
      if (findEmail !== null) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      return true;
    }
  }

  // 이메일 인증 번호 검사
  async emailAuthCheck(email: string, num: string) {
    const result = {
      status: 200,
      message: '',
      success: true,
    };
    try {
      const findMailAuth = await this.emailModel.findOne({
        email,
        auth_num: num,
      });

      result.success = findMailAuth.auth_num === num ? true : false;
      result.message =
        findMailAuth.auth_num === num
          ? '인증이 완료됐습니다.'
          : '다시 시도해 주세요';

      await this.emailModel.deleteOne({ email, auth_num: num });
      await this.usersRepository
        .createQueryBuilder()
        .update()
        .set({ isEmail: true })
        .where('email = :email', { email })
        .execute();

      return result;
    } catch (error) {
      console.log('error:', error);

      this.errorResponse.BadRequest(
        '인증시간이 초과되었습니다. 다시 시도해 주세요',
      );
    }
  }

  // 사업자등록 번호 확인
  async comCheck(value: Array<string>) {
    let result: boolean;
    const com = value[0];
    const name = value[1];
    const date = value[2];
    const data = {
      businesses: [
        {
          b_no: com,
          start_dt: date,
          p_nm: name,
          p_nm2: '',
          b_nm: '',
          corp_no: '',
          b_sector: '',
          b_type: '',
        },
      ],
    };
    try {
      const comInfo = await this.httpService.axiosRef.post(
        process.env.BUSINESSMAN_URL,
        data,
      );

      // console.log('ok', comInfo.data.data[0]);
      const reData = comInfo.data.data[0];

      if (reData.valid === '02') {
        result = false;
      } else {
        result = true;
      }
    } catch (error) {
      console.log('errorComCheck', error);
    }

    return result;
  }

  // 중복, 유효성 인증 검사
  async validCheck(checkType, value: any) {
    const result = {
      status: 200,
      success: false,
      message: '',
    };
    const types = checkType.toString();
    let truthy: boolean;

    switch (types) {
      case 'id':
        truthy = await this.userCheck(value);
        result.success = truthy;
        result.message =
          truthy === true
            ? '사용 가능한 아이디입니다.'
            : '사용 가능하지 않은 아이디입니다.';
        if (!truthy) {
          this.errorResponse.BadRequest(result.message);
        }

        break;

      case 'com':
        truthy = await this.comCheck(value);
        result.success = truthy;
        result.message =
          truthy === true
            ? '확인되었습니다.'
            : '사업자등록번호 또는 성명, 개업일자가 맞지 않아 확인할 수 없습니다.';
        if (!truthy) {
          this.errorResponse.BadRequest(result.message);
        }
        break;

      case 'email':
        truthy = await this.emailCheck(value);
        result.success = truthy;
        result.message =
          truthy === true
            ? '사용할 수 있는 이메일입니다.'
            : '사용할 수 없는 이메일입니다.';
        break;

      default:
        result.message = 'type not selected';
        break;
    }

    console.log(result);
    return result;
  }

  // 인증 메일 보내기
  async createMailAuth(email: any, name: string) {
    const result = {
      status: 200,
      success: await this.mailService.createAuthNum(email, name),
    };

    setTimeout(async () => {
      console.log('이메일 인증 확인');
      try {
        const findAuth = await this.emailModel.findOne({ email });
        if (findAuth) {
          const deleteAuth = await this.emailModel.deleteOne({ email });
          console.log(deleteAuth);
        }
      } catch (error) {}
    }, 300000);

    return result;
  }

  // 토큰 유효성 검사
  async validateToken(
    token: string,
    secret: string,
    t: string,
  ): Promise<boolean> {
    // console.log('token type', t);
    try {
      this.jwtService.verify(token, { secret });
      const decode: any = this.jwtService.decode(token);
      const { refreshToken, accessToken } = await this.cacheManager.get(
        decode.id,
      );

      if (t === 'refresh') {
        if (refreshToken === null) {
          this.errorResponse.Unauthorized(
            '로그인 후 이용할 수 있는 서비스입니다.',
          );
        } else if (refreshToken !== token) {
          this.cacheManager.del(decode.id);
          this.errorResponse.Unauthorized(
            '다른 PC에서 동일한 계정으로 로그인하여, 로그아웃 처리되었습니다.1',
          );
        }
      } else {
        if (accessToken === null) {
          this.errorResponse.Unauthorized(
            '로그인 후 이용할 수 있는 서비스입니다.',
          );
        } else if (accessToken !== token) {
          // this.cacheManager.del(decode.id);
          this.errorResponse.Unauthorized(
            '다른 PC에서 동일한 계정으로 로그인하여, 로그아웃 처리되었습니다.2',
          );
        }
      }

      return true;
    } catch (error) {
      console.log('유효하지 않는 토큰 에러', error);
      return false;
    }
  }

  // 토큰 캐시 저장
  async saveToken(key: string, value: any): Promise<boolean> {
    let result: boolean;

    try {
      const saveCache = await this.cacheManager.set(key, value, { ttl: 1000 });
      console.log('saveCache:', saveCache);
    } catch (error) {
      console.log('토큰 저장 에러', error);
      this.errorResponse.Internal_Server();
    }
    return result;
  }

  // 토큰 재발행
  async createNewToken(token: string) {
    token = token.split(' ')[1];
    console.log('create New Token', token);
    const verify = this.validateToken(token, this.secretAccess, 'access');

    if (!verify) {
      const decode: any = this.jwtService.decode(token);
      // const tokenExp = new Date(decode['exp'] * 1000);
      // const now = new Date();
      // const tokenLifeTime = Math.floor(
      //   (tokenExp.getTime() - now.getTime()) / 1000 / 60,
      // );
      console.log(decode);
      const payload = {
        id: decode.id,
        tier: decode.tier,
        name: decode.company_name,
      };
      const accessToken = this.jwtService.sign(payload, {
        secret: this.secretAccess,
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
      });
      const refreshToken = this.jwtService.sign(payload, {
        secret: this.secretAccess,
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
      });

      this.saveToken(decode.id, { accessToken, refreshToken });
      return {
        isCreate: true,
        accessToken: 'Bearer ' + accessToken,
        refreshToken: 'Bearer ' + refreshToken,
      };
    }

    // await this.cacheManager.get(decode);

    return {
      isCreate: false,
      accessToken: 'Bearer ' + token,
      refreshToken: '',
    };
  }

  async deleteToken(token: string) {
    token = token.split(' ')[1];
    const decode: any = this.jwtService.decode(token);
    // console.log(decode);
    try {
      this.cacheManager.del(decode.id);
    } catch (error) {
      console.log(error);
    }

    return true;
  }
}
