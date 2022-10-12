/**
 * The root module of the application.
 */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from "@nestjs/config";
import { MongodbConfigService } from "./nest/config/mongodb.config.service";

@Module({
    imports: [MongooseModule.forRootAsync({
            imports: [ConfigModule.forRoot({
                envFilePath: ['./config/.env'],
                isGlobal: true,
                cache: true,
            }),],
            useClass: MongodbConfigService,
        })
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}