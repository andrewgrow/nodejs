import { Injectable } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Injectable()
export class TelegramListenerService {
    private telegramService: TelegramService;

    startObserveTelegram(telegramService: TelegramService) {
        if (telegramService) {
            this.telegramService = telegramService;
            this.telegramService
                .getUpdates({})
                .subscribe(this.getDefaultObserver());
        }
    }

    getDefaultObserver() {
        return {
            next: (x) => {
                console.log('Observer got a next value: ' + JSON.stringify(x));
            },
            error: (err) => {
                console.error('Observer got an error: ' + err);
            },
            complete: () => {
                console.log('Observer got a complete notification');
            },
        };
    }
}
