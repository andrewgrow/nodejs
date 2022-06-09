'use strict';

const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(token);
const utils = require('../utils/utils');
const model = require('../db/models/telegram');
const userModel = require('../db/models/user');
const transactionModel = require('../db/models/tranzaction');
const ok_hand_sign = "\u{1F44C}";
const fuel_pump = "\u{26FD}";

async function sendMessageToAll(senderChatId, message) {
    if (utils.isEmpty(message) || message.trim() === '0') {
        return sendCancel(senderChatId);
    }
    const telegramUser = await model.getChatBy(senderChatId);
    const chatsList = await model.getChatsList();

    for (let chat of chatsList) {
        await utils.sleep(1000);
        if (chat.chat_id === telegramUser.chat_id) {
            console.log(`telegramUser! ${ JSON.stringify(telegramUser) } send next message : ${ message }`);
            await bot.sendMessage(chat.chat_id, `Отправлено всем ${ok_hand_sign}`);
        } else {
            await bot.sendMessage(chat.chat_id, `Всем от ${ telegramUser.first_name } @${telegramUser.username}: ${ message }`);
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

async function addRefill(senderChatId, text) {
    text = utils.getNumberFromTextWithoutComma(text);

    // parse Int
    let sum = 0;
    try {
        sum = Number.parseFloat(text.replace( /^\D|,+/g, '')).toFixed(2);
    } catch (err) {
        console.error(err);
    }

    // processing
    if (utils.isWrongInt(sum)) {
        await bot.sendMessage(senderChatId, `Не удалось добавить сумму заправки. Произошла ошибка при разборе введённого числа.`);
        return;
    }

    if (sum < 0.001) {
        await sendCancel(senderChatId);
        return;
    }

    const contractorUser = await userModel.findUserByTelegramId(senderChatId);
    if (contractorUser) {
        const transactionId = await transactionModel.addRefill(contractorUser._id, contractorUser._id, sum).then();
        const result = `В ваш список транзакций добавлена заправка ${ fuel_pump } ` +
            `c id ${ transactionId } на сумму ${ sum } грн. `;
        await bot.sendMessage(senderChatId, result);
    } else {
        await bot.sendMessage(senderChatId, `Не удалось добавить сумму заправки. Произошла ошибка при определении пользователя.`);
    }
}

function sendCancel(senderChatId) {
    return bot.sendMessage(senderChatId, `Охрана, отмена! ${ ok_hand_sign } `);
}

module.exports = {
    isNotCommand, sendMessageToAll, isCommand, addRefill, getMessageWithoutCommand, isCommandEquals
}

