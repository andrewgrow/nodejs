import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class PagesController {
    @Get()
    @Render('mainPage')
    mainPage() {
        return { message: 'Hello world!' };
    }
}
