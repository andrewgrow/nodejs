import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
    catch(_exception: NotFoundException, host: ArgumentsHost) {
        console.log('NotFoundExceptionFilter', _exception.message);
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        response
            .status(404)
            .sendFile('index.html', { root: './views/pageNotFound' });
    }
}
