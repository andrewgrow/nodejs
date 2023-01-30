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

    storeNewRecord(
        newDbRecord: TelegramModelUpdate,
    ): Promise<TelegramModelUpdate> {
        const instance = new this.modelUpdate(newDbRecord);
        return instance.save();
    }

    onModuleInit(): any {
        this.startObserveTelegram(0);
    }

    startObserveTelegram(lastUpdateId: number) {
        let promiseGetLastUpdateId: Promise<number>;
        if (lastUpdateId == 0) {
            promiseGetLastUpdateId = this.findLastUpdateIdFromDb();
        } else {
            promiseGetLastUpdateId = Promise.resolve(lastUpdateId);
        }

        if (this.telegramService) {
            promiseGetLastUpdateId.then((lastUpdateId) => {
                console.log(TAG, 'startObserveTelegram', lastUpdateId);
                const observer = new UpdateObserver(this);

                const offset = lastUpdateId + 1;

                this.telegramService
                    .getUpdates({ offset: offset, timeout: 60 })
                    .subscribe(observer);
            });
        }
    }

    async findLastUpdateIdFromDb(): Promise<number> {
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

        return lastUpdateId;
    }
}

class UpdateObserver implements Observer<Telegram.Update[]> {
    constructor(private readonly service: TelegramListenerService) {}

    complete(): void {
        console.log(TAG, 'complete() call!');
    }

    error(err: any): void {
        console.error(TAG, 'error() call!', err);
    }

    next(data: Telegram.Update[]): void {
        console.log(TAG, 'next() call!', JSON.stringify(data));

        let lastUpdateId = 0;

        data.forEach((dataRecord) => {
            const newDbRecord = {
                update_id: dataRecord.update_id,
                data: JSON.stringify(dataRecord),
            };
            this.service.storeNewRecord(newDbRecord).then();

            lastUpdateId = dataRecord.update_id;
        });

        this.service.startObserveTelegram(lastUpdateId); // reload observing when complete was reached
    }
}
