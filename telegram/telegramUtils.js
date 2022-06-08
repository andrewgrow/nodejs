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

function isCommand(incoming) {
    if (incoming === null || incoming === undefined) {
        return false;
    }
    return incoming.entities &&
        incoming.entities.length > 0 &&
        incoming.entities[0].type === 'bot_command'
}

function isNotCommand(incoming) {
    return !isCommand(incoming);
}

function isCommandEquals(incoming, commandAsText) {
    if (isNotCommand(incoming) || utils.isEmpty(commandAsText)) {
        return false;
    }

    return incoming.text.includes(commandAsText, 0);
}

function getMessageWithoutCommand(incoming, commandAsString) {
    if (utils.isEmpty(commandAsString) || isNotCommand(incoming)) {
        return '';
    }
    const length = commandAsString.length;
     // remove command from a line
    return incoming.text.slice(length).trim();
}

module.exports = { sendMessageToAll, isCommand, isCommandEquals, getMessageWithoutCommand  }

