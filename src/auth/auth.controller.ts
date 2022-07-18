import {
  Controller,
  Get,
  Post,
  Body,
  Inject,
  CACHE_MANAGER,
  HttpCode,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Cache } from 'cache-manager';
import { TokenCheckDTO } from './dto/tokenCheck.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

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

  // 중복, 인증
  @Post()
  @HttpCode(200)
  async validCheck(@Body() auth: any) {
    console.log('body', auth);
    return await this.authService.validCheck(auth.type, auth.val);
  }

  // 이메일 인증번호 생성, 전송
  @Post('create-auth')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async createMailAuth(@Body() value: any) {
    return await this.authService.createMailAuth(value.email, value.name);
  }

  @Post('check-auth')
  @HttpCode(200)
  async emailAuthCheck(@Body() value: any) {
    return await this.authService.emailAuthCheck(value.email, value.num);
  }

  // 토큰 Guard Test API
  @Get('token')
  @UseGuards(JwtAuthGuard)
  async tokenCheck(@Headers() header: TokenCheckDTO) {
    console.log('Guard pass');
    return this.authService.createNewToken(header.accesstoken);
  }
}
