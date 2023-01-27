import { Module } from '@nestjs/common';
import { PagesController } from './pages.controller';

@Module({
    controllers: [PagesController],
    exports: [],
})
export class PagesModule {}
