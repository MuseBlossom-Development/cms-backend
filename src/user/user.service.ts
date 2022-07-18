import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInfo } from 'src/entities/userinfo.entity';
import { Users } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import { ContractInfoDTO } from './dto/contractInfo.dto';
import { UserInfoUpdateDTO } from './dto/userInfoUpdata.dto';
import { ErrorResponse } from 'src/common/error/ErrorResponse';
import { createHmac } from 'crypto';
import { LoginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './../auth/auth.service';
import { SignOutDTO } from './dto/signout.DTO';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(UserInfo)
    private userInfoRepository: Repository<UserInfo>,
    private readonly errorResponse: ErrorResponse,
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}
  private readonly secretAccess = process.env.JWT_ACCESS_TOKEN_SECRET;
  private readonly secretRefresh = process.env.JWT_REFRESH_TOKEN_SECRET;

  // 로그인
  async signIn(loginInfo: LoginDTO) {
    const result = {
      status: 200,
      success: false,
      refreshToken: '',
      accessToken: '',
      isEmail: false,
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
            id: user.user_id,
            tier: user.tier,
            name: user.company_name,
          };

          result.status = 200;
          result.refreshToken =
            'Bearer ' +
            this.jwtService.sign(payload, {
              secret: process.env.JWT_REFRESH_TOKEN_SECRET,
              expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}`,
            });
          result.accessToken =
            'Bearer ' +
            this.jwtService.sign(payload, {
              secret: process.env.JWT_ACCESS_TOKEN_SECRET,
              expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}`,
            });

          result.isEmail = user.isEmail;

          // const tokens = `${result.refreshToken}, ${result.accessToken}`;
          const saveAcToken = result.accessToken.split(' ')[1];
          const saveReToken = result.refreshToken.split(' ')[1];
          const tokens = {
            refreshToken: saveReToken,
            accessToken: saveAcToken,
          };

          this.authService.saveToken(loginInfo.id, tokens);
        }
      }
    } catch (error) {
      console.log('error:', error);
      this.errorResponse.BadRequest('id 또는 password가 일치하지 않습니다.');
    }

    if (!result.success) {
      this.errorResponse.BadRequest('id 또는 password가 일치하지 않습니다.');
    }

    result.message = 'online';
    return result;
  }

  //회원가입
  async signUp(userInfo: SignOutDTO, userCheck?: boolean) {
    const result = {
      statusCode: 201,
      success: true,
      message: `${userInfo.company_name}님, 회원가입을 축하합니다. 새로운 아이디는 ${userInfo.user_id}입니다.`,
      user: {
        refreshToken: '',
        accessToken: '',
        isEmail: false,
      },
    };

    userCheck = await this.authService.userCheck(userInfo.user_id);

    if (!userCheck) {
      this.errorResponse.BadRequest('아이디 중복 확인을 해주세요.');
    }

    const pwCheck = userInfo.password === userInfo.passwordCheck ? true : false;

    if (userCheck && pwCheck) {
      try {
        const user = this.usersRepository.create(userInfo);
        console.log(user);
        const addUser = await this.usersRepository.save(user);
        console.log(addUser);

        result.success = true;
      } catch (error) {
        console.log('error:', error);

        this.errorResponse.Internal_Server();
      }
    }

    const login = { id: userInfo.user_id, password: userInfo.password };
    const user = await this.signIn(login);

    result.user = {
      refreshToken: user.refreshToken,
      accessToken: user.accessToken,
      isEmail: user.isEmail,
    };

    return result;
  }

  // 계약 진행 전 회사 정보 입력
  async acceptContract(info: ContractInfoDTO) {
    const result = {
      status: 201,
      success: true,
      message: '정보 입력이 완료되었습니다.',
    };

    try {
      const userInfo = this.userInfoRepository.create(info);
      const saveUserInfo = await this.userInfoRepository.save(userInfo);

      console.log(saveUserInfo);
    } catch (error) {
      console.log(error);

      this.errorResponse.Internal_Server();
    }

    return result;
  }

  // 유저 정보 업데이트
  async userInfoUpDate(user_id: string, update: UserInfoUpdateDTO) {
    const result = {
      status: 201,
      success: true,
      message: '',
    };
    const updateInfo = {};
    const updateKeys = Object.keys(update);

    for (const key of updateKeys) {
      if (update[key] !== '') {
        updateInfo[key] = update[key];
      }
    }

    try {
      await this.userInfoRepository
        .createQueryBuilder()
        .update()
        .set(updateInfo)
        .where('userIdUserId = :id', { id: user_id })
        .execute();

      result.message = `${user_id}님의 정보가 업데이트 되었습니다.`;
    } catch (error) {
      console.log(error);
    }

    return result;
  }

  async getUsers(tier?: number) {
    const result = {
      status: 200,
      success: true,
      users: [],
      message: '',
    };

    switch (tier) {
      case 0:
        break;
      case 1:
        break;
      case 8:
      case 9:
      case 10:
        // const;
        break;
      default:
        break;
    }
    return result;
  }

  async logout(token: string) {
    const result = {
      status: 200,
      message: '로그아웃',
      success: true,
    };

    const valid = this.authService.validateToken(
      token.split(', ')[1],
      this.secretRefresh,
      'refresh',
    );

    if (valid) {
      this.authService.deleteToken(token);
    }

    return result;
  }
}
