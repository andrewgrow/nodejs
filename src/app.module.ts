/**
 * The root module of the application.
 */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from "@nestjs/config";
import { MongodbConfigService } from "./nest/config/mongodb.config.service";
import dbMongoConfig from "./nest/config/db.mongo.config";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['./config/.env'],
            isGlobal: true,
            cache: true,
            load:[dbMongoConfig]
        }),
        MongooseModule.forRootAsync({
            useClass: MongodbConfigService,
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}