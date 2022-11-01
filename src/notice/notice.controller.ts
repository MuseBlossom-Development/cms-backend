import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { NoticeService } from './notice.service';

@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Get('get-ls/:id')
  async getNoticeLs(@Param('id') id: string) {
    console.log('id', id);
    return await this.noticeService.getNoticeLs(id);
  }

  @Post()
  async createNoticeLs(@Body() body) {
    return await this.noticeService.createNoticeLs();
  }
}
