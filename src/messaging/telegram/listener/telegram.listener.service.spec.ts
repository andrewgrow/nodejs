import { Test, TestingModule } from '@nestjs/testing';
import { TelegramListenerService } from './telegram.listener.service';
import { TelegramService } from '../api';
import * as Telegram from '../api';
import { createMock } from '@golevelup/ts-jest';
import { Observable } from 'rxjs';
import { TelegramUpdateDocument } from '../models/telegram.model.update';
import { Model } from 'mongoose';

describe('TelegramListenerService', () => {
    let module: TestingModule;
    let service: TelegramListenerService;

    const testUpdatesArray: Telegram.Update[] = [
        {
            update_id: 1,
            message: {
                message_id: 2,
                text: 'Test message',
                date: 0,
                chat: { id: 3, type: 'private' },
            },
        },
    ];

    const mockTelegramService = createMock<TelegramService>();
    mockTelegramService.getUpdates
        .mockReturnValueOnce(
            new Observable<Telegram.Update[]>((subscriber) => {
                subscriber.next(testUpdatesArray);
                subscriber.complete();
            }),
        )
        .mockReturnValueOnce(
            new Observable<Telegram.Update[]>((subscriber) => {
                subscriber.next([]);
            }),
        );

    const mockModel = createMock<Model<TelegramUpdateDocument>>();

    beforeEach(async () => {
        module = await Test.createTestingModule({
            providers: [
                {
                    provide: TelegramListenerService,
                    useFactory: () => {
                        return new TelegramListenerService(
                            mockTelegramService,
                            mockModel,
                        );
                    },
                },
            ],
        }).compile();

        service = module.get<TelegramListenerService>(TelegramListenerService);

        jest.spyOn(service, 'findLastUpdateIdFromDb').mockImplementation(() => {
            return Promise.resolve(testUpdatesArray[0].update_id);
        });
        jest.spyOn(service, 'storeNewRecord').mockImplementation(() => {
            return true;
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('TelegramListenerModule initialization', () => {
        beforeEach(() => {
            module.init();
        });

        it('should still be defined', () => {
            expect(service).toBeDefined();
        });
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
