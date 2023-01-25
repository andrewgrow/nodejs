import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration, validationSchema } from './configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

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
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
    exports: [ConfigModule, MongooseModule, ThrottlerModule],
})
export class AppConfigModule {}
