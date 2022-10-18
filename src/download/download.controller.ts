import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Header,
  Res,
} from '@nestjs/common';
import { DownloadService } from './download.service';
import { DownloadFilesDto } from './dto/downloadFiles.dto';

@Controller('download')
export class DownloadController {
  constructor(private readonly downloadService: DownloadService) {}

  @Header('Content-Disposition', 'attachment;')
  @Get()
  downloadFileS3(@Body() downloadFils: DownloadFilesDto) {
    console.log(downloadFils);
    return this.downloadService.downloadFileS3(
      downloadFils.num,
      downloadFils.id,
    );
  }
}
