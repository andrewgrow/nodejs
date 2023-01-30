import { Module } from '@nestjs/common';
import { TelegramListenerService } from './telegram.listener.service';
import { AppConfigModule } from '../../../config/app.config.module';
import { TelegramService } from '../api';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import {
    TelegramUpdate,
    TelegramUpdateDocument,
    TelegramUpdateSchema,
} from '../models/telegram.model.update';
import { Model } from 'mongoose';

@Module({
    imports: [
        AppConfigModule,
        MongooseModule.forFeature([
            {
                name: TelegramUpdate.name,
                schema: TelegramUpdateSchema,
            },
        ]),
    ],
    providers: [
        {
            provide: TelegramListenerService,
            inject: [TelegramService, getModelToken(TelegramUpdate.name)],
            useFactory: (
                tgService: TelegramService,
                model: Model<TelegramUpdateDocument>,
            ) => {
                return new TelegramListenerService(tgService, model);
            },
        },
    ],
})
export class TelegramListenerModule {}
