import { Module } from '@nestjs/common';
import { HelpController } from './help.controller';
import { HelpService } from './help.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Help } from 'src/entities/help.entity';
import { ErrorResponse } from 'src/common/error/ErrorResponse';

@Module({
  imports: [TypeOrmModule.forFeature([Help])],
  controllers: [HelpController],
  providers: [HelpService, ErrorResponse],
})
export class HelpModule {}
