import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Directory } from 'src/entities/directory.entity';
import { Files } from 'src/entities/files.entity';
import { ErrorResponse } from 'src/common/error/ErrorResponse';

@Module({
  imports: [TypeOrmModule.forFeature([Directory, Files])],
  controllers: [FileController],
  providers: [FileService, ErrorResponse],
})
export class FileModule {}
