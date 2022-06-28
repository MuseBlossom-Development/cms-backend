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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Cache } from 'cache-manager';
import { login } from './entities/login.entity';
import { LoginDTO } from './dto/login.dto';
import { SignOut } from './dto/signOut.DTO';

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

  @Post('login')
  async login(@Body() loginInfo: LoginDTO): Promise<login | any> {
    return await this.authService.signIn(loginInfo);
  }

  // @Post('signup')
  // async signUp(@Body() userInfo: SignOut) {
  //   let idCheck: boolean;

  //   if (userInfo.idCheck) {
  //     idCheck = userInfo.idCheck === true ? true : false;
  //   }

  //   return await this.authService.signUp(userInfo, idCheck);
  // }
}
