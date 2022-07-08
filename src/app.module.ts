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
import { Users } from 'src/entities/users.entity';
import { Directory } from 'src/entities/directory.entity';
import { Downloads } from 'src/entities/downloads.entity';
import { Files } from 'src/entities/files.entity';
import { Notice } from 'src/entities/notice.entity';
import { UserInfo } from 'src/entities/userinfo.entity';
import { Wait } from 'src/entities/wait.entity';
import { Inquires } from './entities/inquires.entity';
import { UserView } from 'src/entities/userView.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { AdminModule } from './admin/admin.module';
import mongoose from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        entities: [
          Users,
          Directory,
          Downloads,
          Files,
          Notice,
          UserInfo,
          Wait,
          UserView,
        ],
        synchronize: true,
      }),
    }),
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGO_ID}:${process.env.MONGO_PW}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ignoreUndefined: true,
        dbName: process.env.MONGO_DB,
      },
    ),
    AuthModule,
    UserModule,
    NoticeModule,
    FileModule,
    DownloadModule,
    UploadModule,
    Inquires,
    AdminModule,
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
