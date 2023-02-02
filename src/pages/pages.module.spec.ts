import { Test, TestingModule } from '@nestjs/testing';
import { PagesController } from './pages.controller';
import { PagesModule } from './pages.module';
import { NotFoundExceptionFilter } from './pages.not_found.exception.filter';
import { NotFoundException, HttpStatus } from '@nestjs/common';

describe('PagesModule', () => {
    let module: TestingModule; // wrap real module
    let controller: PagesController; // real controller
    let filter: NotFoundExceptionFilter; // real filter

    const mockPage = jest.fn();
    const mockStatus = jest.fn().mockImplementation(() => ({
        sendFile: mockPage,
    }));
    const mockGetResponse = jest.fn().mockImplementation(() => ({
        status: mockStatus,
    }));
    const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
        getResponse: mockGetResponse,
        getRequest: jest.fn(),
    }));

    const mockArgumentsHost = {
        switchToHttp: mockHttpArgumentsHost,
        getArgByIndex: jest.fn(),
        getArgs: jest.fn(),
        getType: jest.fn(),
        switchToRpc: jest.fn(),
        switchToWs: jest.fn(),
    };

    beforeEach(async () => {
        // prepare module
        module = await Test.createTestingModule({
            providers: [NotFoundExceptionFilter],
            imports: [PagesModule],
        }).compile();

        // prepare controller and filter
        controller = module.get<PagesController>(PagesController);
        filter = module.get<NotFoundExceptionFilter>(NotFoundExceptionFilter);
    });

    afterEach(async () => {
        jest.clearAllMocks();
        await module.close();
    });

    it('should be defined module, service and filter', () => {
        expect(module).toBeDefined();
        expect(controller).toBeDefined();
        expect(filter).toBeDefined();
    });

    it('should return main page message', async () => {
        expect(controller.mainPage()).toEqual({
            message: `This is students demo app.`,
        });
    });

    it('should return page 404 when exception called', () => {
        filter.catch(new NotFoundException('test error'), mockArgumentsHost);
        expect(mockHttpArgumentsHost).toBeCalledTimes(1);
        expect(mockHttpArgumentsHost).toBeCalledWith();
        expect(mockGetResponse).toBeCalledTimes(1);
        expect(mockGetResponse).toBeCalledWith();
        expect(mockStatus).toBeCalledTimes(1);
        expect(mockStatus).toBeCalledWith(HttpStatus.NOT_FOUND);
        expect(mockPage).toBeCalledTimes(1);
        expect(mockPage).toBeCalledWith('index.html', {
            root: './views/pageNotFound',
        });
    });
});
