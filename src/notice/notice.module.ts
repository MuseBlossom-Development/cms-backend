import { Module } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { NoticeGateway } from './notice.gateway';
import { NoticeController } from './notice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notice } from 'src/entities/notice.entity';
import { Users } from 'src/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notice, Users])],
  providers: [NoticeGateway, NoticeService],
  controllers: [NoticeController],
})
export class NoticeModule {}
