import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileInfoDto } from './dto/fileInfo.dto';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async fileUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body() fileInfo: FileInfoDto,
  ) {
    return await this.uploadService.fileUpload(file, fileInfo);
  }
}
