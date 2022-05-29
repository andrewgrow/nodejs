'use strict';
require('dotenv').config({ path: `${__dirname}/config/.env` });

const express = require('express');
const port = process.env.APP_PORT || 8090;
const host = process.env.APP_HOST || '0.0.0.0';
const protocol = process.env.APP_PROTOCOL || 'http';
const botApp = require('./telegram/botApp'); // make Telegram bot

const db = require('./db/db_sequelize')

// приложение
const app = express();
app.get('/', (request, response) => {
    response.send('Node.js® test app');
});
app.listen(port, host);

// start polling Telegram bot
botApp();

console.log(`Server successful running on ${protocol}://${host}:${port}`);

db.testConnection().then((result) => {
    console.log(`DB connection ${result}`)
})