import { Module } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { NoticeGateway } from './notice.gateway';
import { NoticeController } from './notice.controller';

@Module({
  providers: [NoticeGateway, NoticeService],
  controllers: [NoticeController],
})
export class NoticeModule {}
