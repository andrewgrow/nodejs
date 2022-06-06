'use strict';

const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(token);
const utils = require('../utils/utils');
const model = require('../db/models/telegram');

async function sendMessageToAll(senderChatId, message) {
    const ok_hand_sign = "\u{1F44C}";
    if (utils.isEmpty(message) || message.trim() === '0') {
        return bot.sendMessage(senderChatId, `Охрана, отмена! ${ ok_hand_sign } `);
    }
    const telegramUser = await model.getChatBy(senderChatId);
    const chatsList = await model.getChatsList();

    for (let chat of chatsList) {
        await utils.sleep(1000);
        if (chat.chat_id === telegramUser.chat_id) {
            console.log(`telegramUser! ${ JSON.stringify(telegramUser) } send next message : ${ message }`);
            bot.sendMessage(chat.chat_id, `Отправлено всем ${ok_hand_sign}`);
        } else {
            bot.sendMessage(chat.chat_id, `Всем от ${ telegramUser.first_name } @${telegramUser.username}: ${ message }`);
        }
    }
}

module.exports = { sendMessageToAll }

