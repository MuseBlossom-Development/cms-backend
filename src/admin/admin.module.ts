import { Module } from '@nestjs/common';
import { ErrorResponse } from 'src/common/error/ErrorResponse';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserView } from 'src/entities/userView.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserView])],
  controllers: [AdminController],
  providers: [AdminService, ErrorResponse],
})
export class AdminModule {}
