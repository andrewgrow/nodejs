import { Injectable, OnModuleInit } from '@nestjs/common';
import { TelegramService, Update } from '../api';
import { Observer } from 'rxjs';
import { _ } from 'lodash';

const TAG = 'TelegramListenerService: ';

@Injectable()
export class TelegramListenerService implements OnModuleInit {
    constructor(private readonly telegramService: TelegramService) {}

    private lastUpdateId = 563427309;

    onModuleInit(): any {
        this.startObserveTelegram();
    }

    startObserveTelegram() {
        console.log(TAG, 'has been started to observe updates.');
        if (this.telegramService) {
            const observer = this.getNewObserver(this);
            this.telegramService
                .getUpdates({ offset: this.lastUpdateId + 1, timeout: 60 })
                .subscribe(observer);
        }
    }

    getNewObserver(service: TelegramListenerService): Observer<Update[]> {
        return {
            complete(): void {
                console.log(TAG, 'complete() call!');
                service.startObserveTelegram(); // reload observing when complete was reached
            },

            error(err: any): void {
                console.error(TAG, 'error() call!', err);
            },

            next(data: Update[]): void {
                console.error(TAG, 'next() call!', JSON.stringify(data));
                const lastUpdate: Update = _.last(data);
                if (lastUpdate) {
                    service.lastUpdateId = lastUpdate.update_id;
                }
            },
        };
    }
}
