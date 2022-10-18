import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('view/:nowFile')
  async fileView(
    @Param('nowFile') nowFile: string,
    @Query('next') nextFile: string,
  ) {
    if (nextFile) {
      return await this.fileService.fileView(nowFile, nextFile);
    }
    return await this.fileService.fileView(nowFile);
  }
}
