import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  CACHE_MANAGER,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Cache } from 'cache-manager';
import { login } from './entities/login.entity';
import { LoginDTO } from './dto/login.dto';
import { SignOutDTO } from 'src/auth/dto/signout.DTO';
import { TokenCheckDTO } from './dto/tokenCheck.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly authService: AuthService,
  ) {}

  @Get('cache')
  async getCache(): Promise<string> {
    const savedTime = await this.cacheManager.get<number>('time');
    console.log(savedTime);
    if (savedTime) {
      return 'saved time : ' + savedTime;
    }
    const now = new Date().getTime();
    await this.cacheManager.set<number>('time', now, { ttl: 3 });
    return 'save new time : ' + now;
  }

  //로그인
  @Post('login')
  async login(@Body() loginInfo: LoginDTO): Promise<login | any> {
    return await this.authService.signIn(loginInfo);
  }

  // 회원가입
  @Post('signout')
  async signUp(
    @Body() userInfo: SignOutDTO,
    @Query('idCheck') idCheck: string,
  ) {
    const Check = idCheck === 'true' ? true : false;

    return await this.authService.signUp(userInfo, Check);
  }

  // 로그인 확인
  @Post()
  async tokenCheck(@Body() token: TokenCheckDTO) {
    return await this.authService.tokenCheck(
      token.accessToken,
      token.refreshToken,
    );
  }

  // 중복, 인증
  @Get()
  async validCheck(
    @Query('type') type: string,
    @Query('val') val: string,
    @Query('val2') val2: string,
  ) {
    return await this.authService.validCheck(type, val, val2);
  }
}
