/**
 * The root module of the application.
 */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './nest/users/users.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['./config/.env'],
            isGlobal: true,
            cache: true,
        }),
        MongooseModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                uri: configService.get<string>('MONGO_URI'),
                dbName: 'divo',
            }),
            inject: [ConfigService],
        }),
        UsersModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
