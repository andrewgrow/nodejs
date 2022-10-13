import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    MongooseModuleOptions,
    MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { DB_CONFIGURATION_TOKEN } from './mongodb.constants';

/**
 * Create the configuration object via 'db_mongo_config' token.
 * @see also ./mongodb.config.ts
 */
@Injectable()
export class MongodbConfigService implements MongooseOptionsFactory {
    constructor(private readonly configService: ConfigService) {}

    public createMongooseOptions(): MongooseModuleOptions {
        return this.configService.get<MongooseModuleOptions>(
            DB_CONFIGURATION_TOKEN
        ) as MongooseModuleOptions;
    }
}
