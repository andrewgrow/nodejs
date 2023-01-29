import { Module } from '@nestjs/common';
import { TelegramListenerService } from './telegram.listener.service';
import { AppConfigModule } from '../../../config/app.config.module';
import { TelegramService } from '../api';

@Module({
    imports: [AppConfigModule],
    providers: [
        {
            provide: TelegramListenerService,
            inject: [TelegramService],
            useFactory: (telegramService: TelegramService) => {
                return new TelegramListenerService(telegramService);
            },
        },
    ],
})
export class TelegramListenerModule {}
