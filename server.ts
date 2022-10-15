// Server
// const express = require('express');
// const app = express();
// app.use(express.json())
// app.use(require('./src/middlewares/logger'));
// app.use(require('./src/middlewares/check_auth_token').authenticateToken);
// app.use(require('./src/middlewares/check_request_token').requestToken);
//
// app.use('/user', require('./src/routes/userRouter'));
// app.use('/token', require('./src/routes/requestTokenRouter'));
// app.use('/transaction', require('./src/routes/transactionRouter'));
//
// app.get('/', async (request, response) => {
//     response.status(200).send('Node.js® test app');
// });
//
// app.get('*', async (request, response) => {
//     response.status(404).send('Page not found. Try again.');
// });
//
// app.listen(port, host);
//

/**
 * Migrate to NestJS.
 */
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './src/app.module';
import * as TelegramController from './src/oldnode/telegram/telegramController';

let host: string, port: string, protocol: string;

async function bootstrap(): Promise<void> {
    return await NestFactory.create<NestExpressApplication>(AppModule)
        .then(async (app) => {
            port = process.env.APP_PORT ?? '8090';
            host = process.env.APP_HOST ?? '0.0.0.0';
            protocol = process.env.APP_PROTOCOL ?? 'http';
            return await app.listen(port, host);
        })
        .then(async () => {
            return await TelegramController.startTelegramBot();
        })
        .then(() => {
            console.log(
                `Server successful running on ${protocol}://${host}:${port}`
            );
        });
}
void bootstrap();
