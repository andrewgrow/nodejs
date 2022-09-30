'use strict';

initDotEnvConfigIfExists();

const port = process.env.APP_PORT || 8090;
const host = process.env.APP_HOST || '0.0.0.0';
const protocol = process.env.APP_PROTOCOL || 'http';

// Server
const express = require('express');
const app = express();
app.use(express.json())
app.use(require('./src/middlewares/logger'));
app.use(require('./src/middlewares/check_auth_token').authenticateToken);
app.use(require('./src/middlewares/check_request_token').requestToken);

app.use('/user', require('./src/routes/userRouter'));
app.use('/token', require('./src/routes/requestTokenRouter'));
app.use('/transaction', require('./src/routes/transactionRouter'));

app.get('/', async (request, response) => {
    response.status(200).send('Node.js® test app');
});

app.get('*', async (request, response) => {
    response.status(404).send('Page not found. Try again.');
});

app.listen(port, host);

/**
 * In normal case we have .env file in the config folder
 */
function initDotEnvConfigIfExists() {
    // const filePath = `${__dirname}/config/.env`;
    const filePath = require('path').join(__dirname, '..', 'config', '.env');
    if (require('fs').existsSync(filePath)) {
        //file exists
        require('dotenv').config({ path: filePath });
    }
}

/**
 * Init Telegram after start this application
 */
require('./src/telegram/telegramController').startTelegramBot().then();

console.log(`Server successful running on ${protocol}://${host}:${port}`);
export {};