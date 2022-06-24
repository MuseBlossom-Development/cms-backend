import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users.entity';
import { UserInfo } from 'src/entities/userinfo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, UserInfo])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
