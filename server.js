'use strict';
// этот код работает в современном режиме
// файл server.js определяет веб-приложение на основе фреймворка Express.js


const express = require('express');

// константы
const port = process.env.APP_PORT || 3000;
const host = process.env.APP_HOST || '0.0.0.0';
const protocol = process.env.APP_PROTOCOL || 'http';

// приложение
const app = express();
app.get('/', (request, response) => {
    response.send('Node.js® test app');
});

app.listen(port, host);

console.log(`running on ${protocol}://${host}:${port}`);

const TelegramBot = require('node-telegram-bot-api');
// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/love [whatever]"
bot.onText(/\/love (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;
    const response_text = match[1]; // the captured "whatever"

    console.log(`Echo: chatId ${chatId}; message: ${JSON.stringify(msg)}; `)

    const opts = {
        reply_to_message_id: msg.message_id,
        reply_markup: JSON.stringify({
            keyboard: [
                ['Yes, you are the bot of my life ❤'],
                ['No, sorry there is another one...']
            ]
        })
    };
    bot.sendMessage(chatId, 'Do you love me?', opts);

});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    console.log(`Received 2: chatId ${chatId}; message: ${JSON.stringify(msg)}; `)

    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, 'Received your message');
});