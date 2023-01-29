import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration, validationSchema } from './configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { TelegramModule } from '../messaging/telegram/api/telegram.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
            cache: true,
            validationSchema: validationSchema,
        }),
        MongooseModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                uri: configService.get<string>('database.uri'),
                dbName: configService.get<string>('database.name'),
                useNewUrlParser: true,
            }),
            inject: [ConfigService],
        }),
        ThrottlerModule.forRoot({
            ttl: 60, // the number of seconds that each request will last in storage
            limit: 10, // the maximum number of requests within the TTL limit
        }),
        TelegramModule.forRootAsync({
            useFactory: async (configService: ConfigService) => ({
                botKey: configService.get<string>('telegramBotKey'),
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
    exports: [ConfigModule, MongooseModule, ThrottlerModule, TelegramModule],
})
export class AppConfigModule {}
