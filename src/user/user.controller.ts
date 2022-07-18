import {
  Controller,
  Post,
  Body,
  Patch,
  Query,
  HttpCode,
  Get,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ContractInfoDTO } from './dto/contractInfo.dto';
import { UserInfoUpdateDTO } from './dto/userInfoUpdata.dto';
import { LoginDTO } from './dto/login.dto';
import { SignOutDTO } from './dto/signout.DTO';
import { login } from './entities/login.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //로그인
  @Post('login')
  @HttpCode(200)
  async login(@Body() loginInfo: LoginDTO): Promise<login | any> {
    return await this.userService.signIn(loginInfo);
  }

  // 회원가입
  @Post('signup')
  async signUp(
    @Body() userInfo: SignOutDTO,
    @Query('idCheck') idCheck: string,
  ) {
    const Check = idCheck === 'true' ? true : false;
    console.log(userInfo);
    return await this.userService.signUp(userInfo, Check);
  }

  // 계약
  @Post('accept')
  async acceptContract(@Body() contractInfo: ContractInfoDTO) {
    return await this.userService.acceptContract(contractInfo);
  }

  // 유저 정보 업데이트
  @Patch('update')
  async userInfoUpDate(
    @Query('id') id: string,
    @Body() update: UserInfoUpdateDTO,
  ) {
    // console.log(id, updata);
    return await this.userService.userInfoUpDate(id, update);
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Headers() req: any) {
    return this.userService.logout(req.refreshtoken);
  }
}
