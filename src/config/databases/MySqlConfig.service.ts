import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Directory } from 'src/entities/directory.entity';
import { Downloads } from 'src/entities/downloads.entity';
import { Files } from 'src/entities/files.entity';
import { Help } from 'src/entities/help.entity';
import { Notice } from 'src/entities/notice.entity';
import { UserInfo } from 'src/entities/userinfo.entity';
import { Users } from 'src/entities/users.entity';
import { UserView } from 'src/entities/userView.entity';
import { Wait } from 'src/entities/wait.entity';

@Injectable()
export class MySqlConfigService {
  constructor(private configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get<string>('database.host'),
      port: +this.configService.get<number>('database.port'),
      username: this.configService.get<string>('database.username'),
      password: this.configService.get<string>('database.password'),
      database: this.configService.get<string>('database.database'),
      entities: [
        Users,
        Directory,
        Downloads,
        Files,
        Notice,
        UserInfo,
        Wait,
        UserView,
        Help,
      ],
      synchronize: true,
    };
  }
}
