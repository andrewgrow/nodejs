import { Test, TestingModule } from '@nestjs/testing';
import { TelegramListenerService } from './telegram.listener.service';
import { TelegramService } from '../api';
import * as Telegram from '../api';
import { createMock } from '@golevelup/ts-jest';
import { Observable } from 'rxjs';
import {
    TelegramUpdate,
    TelegramUpdateDocument,
    TelegramUpdateSchema,
} from '../models/telegram.model.update';
import mongoose, { Model } from 'mongoose';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { AppConfigModule } from '../../../config/app.config.module';

describe('TelegramListenerService', () => {
    let module: TestingModule;
    let service: TelegramListenerService;
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
        const mockTelegramService = createMock<TelegramService>();
        mockTelegramService.getUpdates.mockReturnValue(getNewTestObservable());

        module = await Test.createTestingModule({
            imports: [
                AppConfigModule,
                MongooseModule.forFeature([
                    {
                        name: TelegramUpdate.name,
                        schema: TelegramUpdateSchema,
                    },
                ]),
            ],
            providers: [
                {
                    inject: [getModelToken(TelegramUpdate.name)],
                    provide: TelegramListenerService,
                    useFactory: (model: Model<TelegramUpdateDocument>) => {
                        return new TelegramListenerService(
                            mockTelegramService,
                            model,
                        );
                    },
                },
            ],
        }).compile();

        service = module.get<TelegramListenerService>(TelegramListenerService);
        service.isEndlessListening = false;

        modelUpdate = service.modelUpdate;

        mockStoreNewRecord = jest.spyOn(service, 'storeNewRecord');
    });

    afterEach(async () => {
        service.stopListening();
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await modelUpdate.deleteMany({ update_id: testUpdateRecord.update_id });
        await mongoose.disconnect();
    });

    describe('TelegramListenerModule initialization', () => {
        it('should still be defined after init', () => {
            module.init();
            expect(service).toBeDefined();
        });

        it('should store new updateMessage', async () => {
            await service.startObserveTelegram(0);
            expect(mockStoreNewRecord).toBeCalledTimes(1);
            const lastStoredId = await service.findLastUpdateIdFromDb();
            expect(lastStoredId).toEqual(testUpdateRecord.update_id);
        });
    });
});
