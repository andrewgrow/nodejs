import { Test } from '@nestjs/testing';
import { TelegramListenerModule } from './telegram.listener.module';

describe('telegramModule', () => {
    it('should be defined', async () => {
        const module = await Test.createTestingModule({
            imports: [TelegramListenerModule],
        });
        expect(module).toBeDefined();
    });
});
