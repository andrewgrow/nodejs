import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';

/**
 * Create the configuration object via 'db_mongo_config' token.
 * @see ./db.mongo.config.ts
 */
@Injectable()
export class MongodbConfigService implements MongooseOptionsFactory {

    constructor(private readonly configService: ConfigService) {}

    public createMongooseOptions(): MongooseModuleOptions {
        return this.configService.get<MongooseModuleOptions>('db_mongo_config') as MongooseModuleOptions;
    }
}