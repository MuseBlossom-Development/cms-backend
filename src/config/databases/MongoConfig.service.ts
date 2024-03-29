import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

@Injectable()
export class MongoConfigService {
  constructor(private configService: ConfigService) {}
  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.configService.get('mongo.uri'),
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ignoreUndefined: true,
      dbName: this.configService.get('mongo.dbName'),
    };
  }
}
