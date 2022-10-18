import { Module } from '@nestjs/common';
import { DownloadService } from './download.service';
import { DownloadController } from './download.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Files } from 'src/entities/files.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Wait } from 'src/entities/wait.entity';
import { Users } from 'src/entities/users.entity';
import { Downloads } from 'src/entities/downloads.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Files, Wait, Users, Downloads]),
    AuthModule,
  ],
  controllers: [DownloadController],
  providers: [DownloadService],
})
export class DownloadModule {}
