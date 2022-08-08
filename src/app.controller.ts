import { Controller, Get, Redirect } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Redirect(
    'http://museblosson-asp-test.s3-website.ap-northeast-2.amazonaws.com/',
    301,
  )
  getHello(): string {
    return;
  }
}
