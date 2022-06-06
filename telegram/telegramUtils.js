'use strict';

const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(token);

function sendMessageToAll(message) {
    bot.sendMessage(235679972, `to: ALL, from: Will, msg: ${ message }`);
    bot.sendMessage(1389991755, `to: ALL, from: Will, msg: ${ message }`);
}

module.exports = { sendMessageToAll }

