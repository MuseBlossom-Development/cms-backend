import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users.entity';
import { Repository } from 'typeorm';
import { LoginDTO } from './dto/login.dto';
import { login } from './entities/login.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignOut } from './dto/signOut.DTO';
import { query } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    private readonly jwtService: JwtService,
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

      // const salt = await bcrypt.genSalt();
      // const password = await bcrypt.hash('aaaa', salt);
      // console.log(password);

      if (user !== null) {
        const truthy = await bcrypt.compare(loginInfo.password, user.password);

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
    }

    return result;
  }

  // 아이디 중복 확인
  async userCheck(user_id: string) {
    const result = {
      success: true,
      message: '',
    };
    const findUser = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.user_id = :user_id', { user_id })
      .getOne();

    if (findUser) {
      result.success = false;
      result.message = '사용할 수 없는 아이디입니다.';
    }

    return result;
  }

  //회원가입
  async signUp(userInfo: SignOut, userCheck?: boolean) {
    const result = {
      success: false,
      message: '',
    };

    if (!userCheck) {
      result.message = '아이디 중복 확인을 해주세요.';
      return result;
    }

    const findUser = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.user_id = :id', { id: userInfo.user_id });

    const pwCheck = userInfo.password === userInfo.passwordCheck ? true : false;

    if (findUser && pwCheck) {
      try {
        const user = this.usersRepository.create(userInfo);
        console.log(user);
        const addUser = await this.usersRepository.save(user);
        console.log(addUser);
      } catch (error) {
        console.log('error:', error);
      }
    }

    return result;
  }
}
