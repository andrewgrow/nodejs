'use strict';

require('dotenv').config({ path: `${__dirname}/config/.env` });

const port = process.env.APP_PORT || 8090;
const host = process.env.APP_HOST || '0.0.0.0';
const protocol = process.env.APP_PROTOCOL || 'http';

const express = require('express');
const telegramBot = require('./telegram/botApp');

const app = express();
app.use(express.json())
app.use(require('sanitize').middleware);
app.use(require('./middlewares/check_auth_token').authenticateToken);
app.use(require('./middlewares/check_request_token').requestToken);

app.use('/user', require('./routes/userRouter'));
app.use('/token', require('./routes/requestTokenRouter'));

app.get('/', async (request, response) => {
    response.status(200).send('Node.js® test app');
});

app.get('*', async (request, response) => {
    response.status(404).send('Page not found. Try again.');
});

app.listen(port, host);

telegramBot(); // start polling Telegram bot

console.log(`Server successful running on ${protocol}://${host}:${port}`);