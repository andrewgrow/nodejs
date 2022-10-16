/**
 * The root module of the application.
 */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { MongodbConfigService } from './nest/databases/mongo/config/mongodb.config.service';
import dbMongoConfig from './nest/databases/mongo/config/mongodb.config';
import { UsersModule } from './nest/users/users.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['./config/.env'],
            isGlobal: true,
            cache: true,
            load: [dbMongoConfig],
        }),
        MongooseModule.forRootAsync({
            useClass: MongodbConfigService,
        }),
        UsersModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
