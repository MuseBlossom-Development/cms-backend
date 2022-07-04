import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ContractInfoDTO } from './dto/contractInfo.dto';
import { UserInfoUpdateDTO } from './dto/userInfoUpdata.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('accept')
  async acceptContract(@Body() contractInfo: ContractInfoDTO) {
    return await this.userService.acceptContract(contractInfo);
  }

  @Patch('update')
  async userInfoUpDate(
    @Query('id') id: string,
    @Body() update: UserInfoUpdateDTO,
  ) {
    // console.log(id, updata);
    return await this.userService.userInfoUpDate(id, update);
  }

  @Get()
  async getUsers(@Query('grade') tier: string) {
    return await this.userService.getUsers(+tier);
  }
}
