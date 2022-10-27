import { Module } from '@nestjs/common';
import { MySqlConfigService } from './MySqlConfig.service';
import { MongoConfigService } from './MongoConfig.service';

@Module({
  providers: [MySqlConfigService, MongoConfigService],
})
export class DbConfigModule {}
