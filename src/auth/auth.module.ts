import { CacheModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { Users } from 'src/entities/users.entity';
import { ErrorResponse } from 'src/common/error/ErrorResponse';
import { MailService } from 'src/mail/mail.service';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    CacheModule.register(),
    HttpModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, ErrorResponse],
  exports: [AuthService],
})
export class AuthModule {}
