import { Module } from '@nestjs/common';
import { TelegramListenerService } from './telegram.listener.service';
import { AppConfigModule } from '../../../config/app.config.module';
import { TelegramService } from '../api';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import {
    TelegramModelUpdate,
    TelegramModelUpdateDocument,
    TelegramModelUpdateSchema,
} from '../models/telegram.model.update';
import { Model } from 'mongoose';

@Module({
    imports: [
        AppConfigModule,
        MongooseModule.forFeature([
            {
                name: TelegramModelUpdate.name,
                schema: TelegramModelUpdateSchema,
            },
        ]),
    ],
    providers: [
        {
            provide: TelegramListenerService,
            inject: [TelegramService, getModelToken(TelegramModelUpdate.name)],
            useFactory: (
                tgService: TelegramService,
                model: Model<TelegramModelUpdateDocument>,
            ) => {
                return new TelegramListenerService(tgService, model);
            },
        },
    ],
})
export class TelegramListenerModule {}
