import { Injectable, OnModuleInit } from '@nestjs/common';
import { TelegramService } from '../api';
import { Observer } from 'rxjs';
import * as Telegram from '../api';
import { TelegramModelUpdate } from '../models/telegram.model.update';
import { Model } from 'mongoose';

const TAG = 'TelegramListenerService: ';

@Injectable()
export class TelegramListenerService implements OnModuleInit {
    constructor(tgService: TelegramService, model: Model<TelegramModelUpdate>) {
        this.telegramService = tgService;
        this.modelUpdate = model;
    }

    private readonly telegramService: TelegramService;

    private readonly modelUpdate: Model<TelegramModelUpdate>;

    onModuleInit(): any {
        this.startObserveTelegram();
    }

    startObserveTelegram() {
        console.log(TAG, 'has been started to observe updates.');

        this.findLastUpdateIdFromDb().then((lastUpdateId) => {
            if (this.telegramService) {
                const observer = this.getNewObserver(this);
                const offset = lastUpdateId + 1;
                console.log('getUpdates', 'offset', offset);
                this.telegramService
                    .getUpdates({ offset: offset, timeout: 60 })
                    .subscribe(observer);
            }
        });
    }

    private async findLastUpdateIdFromDb(): Promise<number> {
        const documents: TelegramModelUpdate[] = await this.modelUpdate
            .find()
            .sort({ _id: -1 }) // get latest
            .limit(1)
            .select('update_id')
            .exec();

        let lastUpdateId = 0;

        if (documents.length > 0) {
            lastUpdateId = documents[0].update_id;
        }

        console.log(TAG, 'findLastUpdateIdFromDb()', lastUpdateId);

        return lastUpdateId;
    }

    getNewObserver(
        service: TelegramListenerService,
    ): Observer<Telegram.Update[]> {
        return {
            complete(): void {
                console.log(TAG, 'complete() call!');
                service.startObserveTelegram(); // reload observing when complete was reached
            },

            error(err: any): void {
                console.error(TAG, 'error() call!', err);
            },

            next(data: Telegram.Update[]): void {
                console.error(TAG, 'next() call!', JSON.stringify(data));
                data.forEach(async (dataRecord) => {
                    const dbRecordUpdate = new service.modelUpdate();
                    dbRecordUpdate.update_id = dataRecord.update_id;
                    dbRecordUpdate.data = JSON.stringify(dataRecord);
                    await dbRecordUpdate.save();
                });
            },
        };
    }
}
