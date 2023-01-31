import { Test } from '@nestjs/testing';
import { TelegramListenerModule } from './telegram.listener.module';
import { TelegramListenerService } from './telegram.listener.service';

describe('telegramModule', () => {
    it('should be defined module and service', async () => {
        const module = await Test.createTestingModule({
            imports: [TelegramListenerModule],
        }).compile();

        const service = module.get<TelegramListenerService>(
            TelegramListenerService,
        );

        await module.init();

        expect(module).toBeDefined();
        expect(service).toBeDefined();
    });
});
