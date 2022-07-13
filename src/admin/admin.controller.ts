import { Controller, Get, Query } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // 유저 목록
  @Get('user-list')
  async getUsers(@Query('grade') tier: string) {
    return await this.adminService.getUsers(+tier);
  }
}
