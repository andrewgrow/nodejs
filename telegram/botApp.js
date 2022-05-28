'use strict';

const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(token, {polling: true});
let isRunning = false;

function StartBot() {
    if (isRunning) {
        return;
    }
    isRunning = true;

    bot.getMe().then((info) => {
        console.log(`TelegramBot started: ${JSON.stringify(info)}`)
    })

// Matches "/lovetextmessage [whatever]"
    bot.onText(/\/lovetextmessage (.+)/, (msg, match) => {
        // 'msg' is the received Message from Telegram
        // 'match' is the result of executing the regexp above on the text content
        // of the message

        const chatId = msg.chat.id;
        const request_text = match[1]; // the captured "whatever"

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
}

module.exports = StartBot