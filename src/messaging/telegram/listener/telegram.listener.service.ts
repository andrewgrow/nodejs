import { Injectable, OnModuleInit } from '@nestjs/common';
import { TelegramService } from '../api';
import { Observer } from 'rxjs';
import * as Telegram from '../api';
import {
    TelegramUpdate,
    TelegramUpdateDocument,
} from '../models/telegram.model.update';
import { Model } from 'mongoose';

const TAG = 'TelegramListenerService: ';

@Injectable()
export class TelegramListenerService implements OnModuleInit {
    constructor(
        tgService: TelegramService,
        model: Model<TelegramUpdateDocument>,
    ) {
        this.telegramService = tgService;
        this.modelUpdate = model;
    }

    private readonly telegramService: TelegramService;

    private readonly modelUpdate: Model<TelegramUpdateDocument>;

    storeNewRecord(newDbRecord: { update_id: number; data: string }): void {
        console.log(TAG, 'new updateRecord!', newDbRecord.data);
        const instance = new this.modelUpdate(newDbRecord);
        instance.save().then();
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

        promiseGetLastUpdateId.then((lastUpdateId) => {
            const observer = new UpdateObserver(this);

            const offset = lastUpdateId + 1;

            this.telegramService
                .getUpdates({
                    offset: offset,
                    timeout: 60,
                })
                .subscribe(observer);
        });
    }

    async findLastUpdateIdFromDb(): Promise<number> {
        const documents: TelegramUpdate[] = await this.modelUpdate
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
    constructor(
        private readonly service: TelegramListenerService,
        private lastUpdateId: number = 0,
    ) {}

    complete(): void {
        this.service.startObserveTelegram(this.lastUpdateId); // reload observing
    }

    error(err: any): void {
        console.error(TAG, 'error() call!', err);
    }

    next(data: Telegram.Update[]): void {
        data.forEach((dataRecord) => {
            this.service.storeNewRecord({
                update_id: dataRecord.update_id,
                data: JSON.stringify(dataRecord),
            });
            this.lastUpdateId = dataRecord.update_id;
        });
    }
}
