'use strict';

const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(token);
const utils = require('../utils/utils');
const model = require('../db/models/telegram');
const userModel = require('../db/models/user');
const transactionModel = require('../db/models/tranzaction');
const tgModel = require('../db/models/telegram');
const emoji_ok_hand_sign = "\u{1F44C}";
const emoji_fuel_pump = "\u{26FD}";
const emoji_dollar_banknote = "\u{1F4B5}";

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
            await bot.sendMessage(chat.chat_id, `Отправлено всем ${emoji_ok_hand_sign}`);
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

async function addTransaction(senderChatId, text, type) {
    const sum = parseSum(text);
    if (await checkIfSumIsWrongAndNotifySender(senderChatId, sum)) {
        return;
    }

    const contractorUser = await userModel.findUserByTelegramId(senderChatId);
    if (contractorUser) {
        switch (type) {
            case 'refill' : {
                const transactionId = await transactionModel.addRefill(contractorUser._id, contractorUser._id, sum).then();
                await sendMessageSuccessRefill(transactionId, sum, contractorUser._id);
                break;
            }
            case 'deposit' : {
                const transactionId = await transactionModel.addDeposit(contractorUser._id, contractorUser._id, sum).then();
                await sendMessageSuccessDeposit(transactionId, sum, contractorUser._id);
                break;
            }
        }
    } else {
        await bot.sendMessage(senderChatId, `Не удалось добавить сумму транзакции. Произошла ошибка при определении пользователя.`);
    }
}

function parseSum(text) {
    text = utils.getNumberFromTextWithoutComma(text);

    // parse Int
    let sum = 0;
    try {
        sum = Number.parseFloat(text.replace( /^\D|,+/g, '')).toFixed(2);
    } catch (err) {
        console.error(err);
        return NaN;
    }
    return sum;
}

async function checkIfSumIsWrongAndNotifySender(senderChatId, sum) {
    // checking sum
    if (utils.isWrongInt(sum)) {
        await bot.sendMessage(senderChatId, `Не удалось понять сумму транзакции. Произошла ошибка при разборе введённого числа.`);
        return true;
    }

    // if 0 we will cancel the operation
    if (sum < 0.001) {
        await sendCancel(senderChatId);
        return true;
    }

    return false;
}

async function sendMessageSuccessRefill(transactionId, sum, contractorUserId) {
    const text = `В ваш список транзакций добавлена заправка ${ emoji_fuel_pump } ` +
        `c id ${ transactionId } на сумму ${ sum } грн. `;
    return sendTransaction(contractorUserId, text);
}

function sendMessageSuccessDeposit(transactionId, sum, contractorUserId) {
    const text = `В ваш список транзакций добавлен депозит ${ emoji_dollar_banknote } ` +
        `c id ${ transactionId } на сумму ${ sum } грн. `;
    return sendTransaction(contractorUserId, text);
}

async function sendTransaction(contractorUserId, text) {
    const chatsList = await tgModel.getChatsListByUser(contractorUserId);
    const userAccountResult = await userModel.getUserAccountResult(contractorUserId);
    const commonAccountResult = await userModel.getCommonAccountResult();
    if (userAccountResult) {
        text = `${text} Личный счёт ${userAccountResult} грн.`
    }
    if (commonAccountResult) {
        text = `${text} Общий счёт ${commonAccountResult} грн.`
    }
    for (let chat of chatsList) {
        await utils.sleep(1000);
        await bot.sendMessage(chat.chat_id, text);
    }
}

function sendCancel(senderChatId) {
    return bot.sendMessage(senderChatId, `Охрана, отмена! ${ emoji_ok_hand_sign } `);
}

module.exports = { sendMessageToAll, isCommand, addTransaction, getMessageWithoutCommand, isCommandEquals,
    sendMessageSuccessRefill, sendMessageSuccessDeposit }

