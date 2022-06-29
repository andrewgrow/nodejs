'use strict';

const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(token, {polling: true});

function getBotInfo() {
    return bot.getMe();
}

function addMessageListener(event, listener) {
    bot.on(event, listener);
}

function addTextListener(regexp, listener) {
    bot.onText(regexp, listener);
}

function sendMessage(chatId, message, form) {
    return bot.sendMessage(chatId, message, form);
}

function addReplyListener(chatId, messageId, listener) {
    bot.onReplyToMessage(chatId, messageId, listener);
}


module.exports = { getBotInfo, addMessageListener, addTextListener, sendMessage, addReplyListener }
