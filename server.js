'use strict';
// этот код работает в современном режиме
// файл server.js определяет веб-приложение на основе фреймворка Express.js


const express = require('express');

// константы
const port = 3000;
const host = '0.0.0.0';
const protocol = 'http';

// приложение
const app = express();
app.get('/', (request, response) => {
    response.send('Node.js® test app');
});

app.listen(port, host);
console.log(`running on ${protocol}://${host}:${port}`);