import { CacheModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { Users } from './../entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    CacheModule.register(),
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
  exports: [AuthService],
})
export class AuthModule {}
