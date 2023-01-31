import { Test, TestingModule } from '@nestjs/testing';
import { TelegramListenerModule } from './telegram.listener.module';
import { TelegramListenerService } from './telegram.listener.service';

describe('telegramModule', () => {
    let service: TelegramListenerService; // real service
    let module: TestingModule; // wrap real module

    afterEach(async () => {
        // close opened connections
        await service.stopListening();
        await module.close();
        jest.clearAllMocks();
    });

    it('should be defined module and service', async () => {
        // prepare module
        module = await Test.createTestingModule({
            imports: [TelegramListenerModule],
        }).compile();

        // prepare service
        service = module.get<TelegramListenerService>(TelegramListenerService);
        service.isEndlessListening = false;

        // mock db request
        service.findLastUpdateIdFromDb = jest.fn(() => {
            return Promise.resolve(0);
        });

        // start testing
        service.onModuleInit();

        // check results
        expect(module).toBeDefined();
        expect(service).toBeDefined();
    });
});
