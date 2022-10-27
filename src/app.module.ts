import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { NoticeModule } from './notice/notice.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModule } from './file/file.module';
import { DownloadModule } from './download/download.module';
import { UploadModule } from './upload/upload.module';
import { ConfigModule } from '@nestjs/config';
import { Help } from 'src/entities/help.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { AdminModule } from './admin/admin.module';
import { HelpModule } from './help/help.module';
import { MailModule } from './mail/mail.module';
import mongoose from 'mongoose';
import dbConfig from './config/db.config';
import { MySqlConfigService } from './config/databases/MySqlConfig.service';
import { MongoConfigService } from './config/databases/MongoConfig.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_MOD === 'dev' ? '.env.dev' : '.env.prod',
      load: [dbConfig],
    }),
    TypeOrmModule.forRootAsync({
      useClass: MySqlConfigService,
    }),
    MongooseModule.forRootAsync({
      useClass: MongoConfigService,
    }),
    AuthModule,
    UserModule,
    NoticeModule,
    FileModule,
    DownloadModule,
    UploadModule,
    Help,
    AdminModule,
    HelpModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  private readonly isDev: boolean = process.env.MODE === 'dev' ? true : false;

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    mongoose.set('debug', this.isDev);
  }
}
