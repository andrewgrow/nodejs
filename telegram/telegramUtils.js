'use strict';

const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(token);
const utils = require('../utils/utils');
const model = require('../db/models/telegram');

async function sendMessageToAll(senderChatId, message) {
    if (utils.isEmpty(message) || message.trim() === '0') {
        const ok_hand_sign = "\u{1F44C}";
        return bot.sendMessage(senderChatId, `Охрана, отмена! ${ ok_hand_sign } `);
    }
    const chatsList = await model.getChatsList();
    for (let chat of chatsList) {
        await utils.sleep(5000);
        console.log(new Date());
    }

    // bot.sendMessage(235679972, `to: ALL, from: Will, msg: ${ message }`);
    // bot.sendMessage(1389991755, `to: ALL, from: Will, msg: ${ message }`);
}

module.exports = { sendMessageToAll }

