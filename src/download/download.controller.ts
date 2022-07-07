import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DownloadService } from './download.service';
import { CreateDownloadDto } from './dto/create-download.dto';
import { UpdateDownloadDto } from './dto/update-download.dto';

@Controller('download')
export class DownloadController {
  constructor(private readonly downloadService: DownloadService) {}
}
