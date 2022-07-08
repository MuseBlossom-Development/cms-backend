import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { UserInfo } from 'src/entities/userinfo.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserView } from 'src/entities/userView.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, UserInfo, UserView]), AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
