import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Directory } from 'src/entities/directory.entity';
import { Files } from 'src/entities/files.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Directory, Files])],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
