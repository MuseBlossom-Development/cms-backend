import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Directory } from 'src/entities/directory.entity';
import { Files } from 'src/entities/files.entity';
import { Repository } from 'typeorm';
import { ErrorResponse } from 'src/common/error/ErrorResponse';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(Files) private fileRepository: Repository<Files>,
    @InjectRepository(Directory)
    private directoryRepository: Repository<Directory>,
    private readonly errorResponse: ErrorResponse,
  ) {}

  async fileView(nowFile: string, nextFile?: string, src?: string[]) {
    const result = {
      status: 200,
      message: '',
      src: [],
      show: [],
    };

    if (nowFile === '1' && nextFile === undefined) {
      console.log('top dir');
      const findFile = await this.fileRepository
        .createQueryBuilder('file')
        .where('file.directory_id=:id', { id: 1 })
        .getMany();
      const findDir = await this.directoryRepository
        .createQueryBuilder('dir')
        .where('dir.top_dir_id=:id', { id: 1 })
        .getMany();

      // console.log('findFile', findFile);
      result.show.push(findDir);
      result.show.push(findFile);
    } else {
      // console.log('not top');
      const findFile = await this.fileRepository
        .createQueryBuilder('file')
        .where('file.directory_id=:id', { id: nextFile })
        .getMany();
      const findDir = await this.directoryRepository
        .createQueryBuilder('dir')
        .where('dir.top_dir_id=:id', { id: nextFile })
        .getMany();

      result.show.push(findDir);
      result.show.push(findFile);
      // src.push(nextFile); 보류
      // result.src = src;
    }
    return result;
  }
}
