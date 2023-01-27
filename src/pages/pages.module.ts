import { Module } from '@nestjs/common';
import { PagesController } from './pages.controller';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '../../..', 'static'),
        }),
    ],
    controllers: [PagesController],
    exports: [],
})
export class PagesModule {}
