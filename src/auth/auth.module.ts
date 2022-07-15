import { CacheModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { Users } from 'src/entities/users.entity';
import { ErrorResponse } from 'src/common/error/ErrorResponse';
import { MailModule } from 'src/mail/mail.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Email, EmailSchema } from 'src/schemas/email.schema';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    MongooseModule.forFeature([{ name: Email.name, schema: EmailSchema }]),
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME },
    }),
    HttpModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, ErrorResponse],
  exports: [AuthService],
})
export class AuthModule {}
