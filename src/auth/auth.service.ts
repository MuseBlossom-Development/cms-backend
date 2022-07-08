import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { SignOutDTO } from './dto/signout.DTO';
import { HttpService } from '@nestjs/axios';
import { createHmac } from 'crypto';
import { Users } from 'src/entities/users.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  // 로그인
  async signIn(loginInfo: LoginDTO) {
    const result = {
      status: 200,
      success: false,
      refreshToken: '',
      accessToken: '',
      message: '',
    };

    try {
      const user: any = await this.usersRepository
        .createQueryBuilder('user')
        .where('user.user_id=:id', { id: loginInfo.id })
        .getOne();

      if (user !== null) {
        // const truthy = await bcrypt.compare(loginInfo.password, user.password);
        const truthy =
          createHmac('sha256', process.env.PW_SECRET_KEY)
            .update(loginInfo.password)
            .digest('hex') === user.password
            ? true
            : false;

        result.success = truthy;

        if (truthy) {
          const payload = {
            id: user.id,
            tier: user.tier,
            name: user.company_name,
          };

          result.status = 201;
          result.refreshToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_TOKEN_SECRET,
            expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}s`,
          });
          result.accessToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_ACCESS_TOKEN_SECRET,
            expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}s`,
          });
        }
      }
    } catch (error) {
      console.log('error:', error);
      result.message = 'id 또는 password가 일치하지 않습니다.';
      return result;
    }

    if (!result.success) {
      result.message = 'id 또는 password가 일치하지 않습니다.';
      return result;
    }

    result.message = 'online';
    return result;
  }

  //회원가입
  async signUp(userInfo: SignOutDTO, userCheck?: boolean) {
    const result = {
      statusCode: 201,
      success: false,
      message: '',
    };

    userCheck = await this.userCheck(userInfo.user_id);

    if (!userCheck) {
      result.message = '아이디 중복 확인을 해주세요.';
      return result;
    }

    const findUser = this.usersRepository
      .createQueryBuilder('user')
      .where('user.user_id = :id', { id: userInfo.user_id });

    const pwCheck = userInfo.password === userInfo.passwordCheck ? true : false;

    if (findUser && pwCheck) {
      try {
        const user = this.usersRepository.create(userInfo);
        console.log(user);
        const addUser = await this.usersRepository.save(user);
        console.log(addUser);

        result.success = true;
      } catch (error) {
        console.log('error:', error);
      }
    }

    return result;
  }

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

  // email 중복 확인 / 이메일 인증
  async emailCheck(email: string) {
    const findEmail = await this.usersRepository
      .createQueryBuilder()
      .select('email')
      .where('email = :check', { check: email });

    if (findEmail) return false;

    try {
    } catch (error) {
      console.log(error);
    }

    return true;
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

  // 토큰 유효성 검사 (임시)
  async tokenCheck(access, refresh) {
    const secret = process.env.PW_SECRET_KEY;
    const refreshVerify = this.jwtService.decode(refresh);
    return;
  }

  // 중복, 유효성 인증 검사
  async validCheck(checkType: string, value: any) {
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
        break;

      case 'com':
        truthy = await this.comCheck(value);
        result.success = truthy;
        result.message =
          truthy === true
            ? '확인되었습니다.'
            : '사업자등록번호 또는 성명, 개업일자가 맞지 않아 확인할 수 없습니다.';
        break;

      case 'email':
        truthy = await this.emailCheck(value);
        break;

      default:
        result.message = 'type not selected';
        break;
    }

    console.log(result);
    return result;
  }
}
