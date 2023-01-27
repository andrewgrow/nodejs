import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class PagesController {
    @Get()
    @Render('index')
    mainPage() {
        return { message: 'Hello world!' };
    }
}
