import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { Files } from 'src/entities/files.entity';
import { Directory } from 'src/entities/directory.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Files, Directory])],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
