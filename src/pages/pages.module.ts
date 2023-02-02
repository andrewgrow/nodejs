import { Module } from '@nestjs/common';
import { PagesController } from './pages.controller';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { NotFoundExceptionFilter } from './pages.not_found.exception.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '../../..', 'static'),
            serveStaticOptions: { index: false },
            serveRoot: '/',
        }),
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: NotFoundExceptionFilter,
        },
    ],
    controllers: [PagesController],
    exports: [],
})
export class PagesModule {}
