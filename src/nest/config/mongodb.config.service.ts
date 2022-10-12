import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';

@Injectable()
export class MongodbConfigService implements MongooseOptionsFactory {

    constructor(private readonly configService: ConfigService) {}

    public createMongooseOptions(): MongooseModuleOptions {
        return this.configService.get<MongooseModuleOptions>('db_mongo_config') as MongooseModuleOptions;
    }
}