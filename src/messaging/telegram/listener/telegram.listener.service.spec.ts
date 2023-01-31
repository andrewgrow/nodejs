import { Test, TestingModule } from '@nestjs/testing';
import { TelegramListenerService } from './telegram.listener.service';
import { TelegramService } from '../api';
import * as Telegram from '../api';
import { Observable } from 'rxjs';
import mongoose from 'mongoose';
import { TelegramListenerModule } from './telegram.listener.module';

describe('TelegramListenerService', () => {
    let module: TestingModule;
    let service: TelegramListenerService;
    let telegramService;
    let mockStoreNewRecord;
    let modelUpdate;

    // test instance of Update
    const testUpdateRecord: Telegram.Update = {
        update_id: 1,
        message: {
            message_id: 2,
            text: 'Test message',
            date: 0,
            chat: { id: 3, type: 'private' },
        },
    };

    // the test array to return as new Update
    const testUpdatesArray: Telegram.Update[] = [testUpdateRecord];

    // will return a test array to subscriber
    function getNewTestObservable() {
        return new Observable<Telegram.Update[]>((subscriber) => {
            subscriber.next(testUpdatesArray);
            subscriber.complete();
        });
    }

    beforeEach(async () => {
        // Prepare full working module except TelegramService.
        module = await Test.createTestingModule({
            imports: [TelegramListenerModule],
        }).compile();

        // watch on storing new records
        service = module.get<TelegramListenerService>(TelegramListenerService);
        service.isEndlessListening = false;
        mockStoreNewRecord = jest.spyOn(service, 'storeNewRecord');

        // real model for db working
        modelUpdate = service.modelUpdate;

        // TelegramService will mock.
        telegramService = module.get<TelegramService>(TelegramService);
        jest.spyOn(telegramService, 'getUpdates').mockReturnValue(
            getNewTestObservable(),
        );
    });

    afterEach(async () => {
        // clear mocks
        service.stopListening();
        jest.clearAllMocks();
    });

    afterAll(async () => {
        // close opened connections and delete test data
        await modelUpdate.deleteMany({ update_id: testUpdateRecord.update_id });
        await mongoose.disconnect();
    });

    describe('TelegramListenerModule get Updates and store their', () => {
        it('service should be defined after init', () => {
            module.init();
            expect(service).toBeDefined();
        });

        it('service should save new updateMessage', async () => {
            await service.startObserveTelegram(0);
            expect(mockStoreNewRecord).toBeCalledTimes(1);
            const lastStoredId = await service.findLastUpdateIdFromDb();
            expect(lastStoredId).toEqual(testUpdateRecord.update_id);
        });
    });
});
