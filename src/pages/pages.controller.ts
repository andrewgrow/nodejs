import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class PagesController {
    @Get()
    @Render('page_main')
    mainPage() {
        return { message: 'This is students demo app.' };
    }
}
