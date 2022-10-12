import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';

@Injectable()
export class MongodbConfigService implements MongooseOptionsFactory {

    constructor(private readonly configService: ConfigService) {}

    public createMongooseOptions(): MongooseModuleOptions {
        //MONGODB_URL is in .env file
        const mongoUri = this.configService.get<string>('MONGO_URI');
        if (!mongoUri) throw new Error('Check your ./config/.env file! ' +
            'It should contains ~ MONGO_URI="mongodb://mongouser:mongopassword@localhost:27017"'
        );

        return {
            uri: mongoUri,
        };
    }
}