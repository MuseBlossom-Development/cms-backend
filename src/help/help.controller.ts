import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { HelpDTO } from './dto/help.dto';
import { HelpService } from './help.service';

@Controller('help')
export class HelpController {
  constructor(private readonly helpService: HelpService) {}

  @Post()
  async postHelp(@Body() helpDto: HelpDTO) {
    return await this.helpService.help(helpDto);
  }

  @Get()
  async getHelp(@Query('name') name: string) {
    return await this.helpService.helpList(name);
  }
}
