import { Injectable, OnModuleInit } from '@nestjs/common';
import { TelegramService } from '../api';
import { Observer, Subscription } from 'rxjs';
import * as Telegram from '../api';
import {
    TelegramUpdate,
    TelegramUpdateDocument,
} from '../models/telegram.model.update';
import { Model } from 'mongoose';

const TAG = 'TelegramListenerService: ';

@Injectable()
export class TelegramListenerService implements OnModuleInit {
    private readonly telegramService: TelegramService;
    public readonly modelUpdate: Model<TelegramUpdateDocument>;
    public isEndlessListening = true;
    private subscription: Subscription;
    constructor(
        tgService: TelegramService,
        model: Model<TelegramUpdateDocument>,
    ) {
        this.telegramService = tgService;
        this.modelUpdate = model;
    }

    storeNewRecord(newDbRecord: { update_id: number; data: string }): void {
        console.log(TAG, 'new record:', newDbRecord.data);
        const instance = new this.modelUpdate(newDbRecord);
        instance.save().then();
    }

    onModuleInit(): any {
        this.startObserveTelegram(0).then();
    }

    async startObserveTelegram(updateId: number) {
        let promiseGetLastUpdateId: Promise<number>;
        if (updateId == 0) {
            promiseGetLastUpdateId = this.findLastUpdateIdFromDb();
        } else {
            promiseGetLastUpdateId = Promise.resolve(updateId);
        }

        const lastUpdateId = await promiseGetLastUpdateId;
        const observer = new UpdateObserver(this, updateId);

        const offset = lastUpdateId + 1;

        this.subscription = this.telegramService
            .getUpdates({
                offset: offset,
                timeout: 60,
            })
            .subscribe(observer);
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

    stopListening() {
        if (this.subscription && !this.subscription.closed) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
    }
}

export class UpdateObserver implements Observer<Telegram.Update[]> {
    constructor(
        private readonly service: TelegramListenerService,
        private lastUpdateId: number = 0,
    ) {
        this.isEndlessListening = service.isEndlessListening;
    }

    private readonly isEndlessListening;

    complete(): void {
        // restart after complete
        this.reloadObserver();
    }

    error(err: any): void {
        if (process.env.NODE_ENV === 'test') {
            return; // test protection
        }
        console.error(TAG, 'error() call!', err);

        // restart after error
        this.reloadObserver();
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

    private reloadObserver() {
        if (this.isEndlessListening) {
            this.service.startObserveTelegram(this.lastUpdateId).then();
        }
    }
}
