import { Module } from '@nestjs/common';
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

import { Users } from 'src/entities/Users.entity';
import { Directory } from 'src/entities/directory.entity';
import { Downloads } from 'src/entities/downloads.entity';
import { Files } from 'src/entities/files.entity';
import { Notice } from 'src/entities/notice.entity';
import { UserInfo } from 'src/entities/userinfo.entity';
import { Wait } from 'src/entities/wait.entity';
import { Inquires } from './entities/inquires.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        entities: [Users, Directory, Downloads, Files, Notice, UserInfo, Wait],
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
    // ClientsModule.register([
    //   {
    //     name: 'MATH_SERVICE',
    //     transport: Transport.REDIS,
    //     options: {
    //       url: 'redis://localhost:6379',
    //     },
    //   },
    // ]),
    AuthModule,
    UserModule,
    NoticeModule,
    FileModule,
    DownloadModule,
    UploadModule,
    Inquires,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
