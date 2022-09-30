'use strict';

/**
 * Telegram Utils do actions with telegram bot. The Bot is represents as wrapper.
 */

const tgWrapper = require('./telegramBotWrapper');
const utils = require('../utils/utils');
const model = require('../db/models/telegram');
const userModel = require('../db/models/user');
const transactionModel = require('../db/models/transaction');
const tgModel = require('../db/models/telegram');
const emoji_ok_hand_sign = "\u{1F44C}";
const emoji_fuel_pump = "\u{26FD}";
const emoji_dollar_banknote = "\u{1F4B5}";

export function getBotInfo() {
    return tgWrapper.getBotInfo();
}

export async function sendMessageToAll(senderChatId, message) {
    if (utils.isEmpty(message) || message.trim() === '0') {
        return sendCancel(senderChatId);
    }
    const telegramUser = await model.getChatBy(senderChatId);
    const chatsList = await model.getChatsList();

    for (let chat of chatsList) {
        await utils.sleep(1000);
        if (chat.chat_id === telegramUser.chat_id) {
            console.log(`telegramUser! ${ JSON.stringify(telegramUser) } send next message : ${ message }`);
            await tgWrapper.sendMessage(chat.chat_id, `Отправлено всем ${emoji_ok_hand_sign}`);
        } else {
            await tgWrapper.sendMessage(chat.chat_id, `Всем от ${ telegramUser.first_name } @${telegramUser.username}: ${ message }`);
        }
    }
}

export function isCommand(incoming) {
    if (incoming === null || incoming === undefined) {
        return false;
    }
    return incoming.entities &&
        incoming.entities.length > 0 &&
        incoming.entities[0].type === 'bot_command'
}

export function isNotCommand(incoming) {
    return !isCommand(incoming);
}

export function getMessageWithoutCommand(incoming, commandAsString) {
    if (utils.isEmpty(commandAsString) || isNotCommand(incoming)) {
        return '';
    }
    const length = commandAsString.length;
     // remove command from a line
    return incoming.text.slice(length).trim();
}

export async function addTransaction(senderChatId, text, type) {
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
        await tgWrapper.sendMessage(senderChatId, `Не удалось добавить сумму транзакции. Произошла ошибка при определении пользователя.`);
    }
}

export function parseSum(text) {
    text = utils.replaceCommaToDot(text);

    // parse Int
    let sum: number = 0;
    try {
        sum = Number.parseFloat(Number.parseFloat(text.replace( /^\D|,+/g, '')).toFixed(2));
    } catch (err) {
        console.error(err);
        return NaN;
    }
    return sum;
}

export async function checkIfSumIsWrongAndNotifySender(senderChatId, sum) {
    // checking sum
    if (utils.isWrongInt(sum)) {
        await tgWrapper.sendMessage(senderChatId, `Не удалось понять сумму транзакции. Произошла ошибка при разборе введённого числа.`);
        return true;
    }

    // if 0 we will cancel the operation
    if (sum < 0.001) {
        await sendCancel(senderChatId);
        return true;
    }

    return false;
}

export async function sendMessageSuccessRefill(transactionId, sum, contractorUserId) {
    const text = `В ваш список транзакций добавлена заправка ${ emoji_fuel_pump } ` +
        `c id ${ transactionId } на сумму ${ sum } грн. `;
    return sendTransaction(contractorUserId, text);
}

export function sendMessageSuccessDeposit(transactionId, sum, contractorUserId) {
    const text = `В ваш список транзакций добавлен депозит ${ emoji_dollar_banknote } ` +
        `c id ${ transactionId } на сумму ${ sum } грн. `;
    return sendTransaction(contractorUserId, text);
}

export async function sendTransaction(contractorUserId, text) {
    const name = await userModel.getUserName(contractorUserId);
    if (name) {
        text = `Hi ${name}! ${text}`;
    }
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
        await tgWrapper.sendMessage(chat.chat_id, text);
    }
    return true;
}

export async function showUserAccountResult(senderChatId) {
    const user = await userModel.findUserByTelegramId(senderChatId);
    if (user == null) {
        return null;
    }
    return await sendTransaction(user._id, "");
}

export function sendCancel(senderChatId) {
    return tgWrapper.sendMessage(senderChatId, `Охрана, отмена! ${ emoji_ok_hand_sign } `);
}

export function addMessageListener(event, listener) {
    tgWrapper.addMessageListener(event, listener);
}

export function addTextListener(regexp, listener) {
    tgWrapper.addTextListener(regexp, listener);
}

export function sendMessage(chatId, message, form) {
    return tgWrapper.sendMessage(chatId, message, form);
}

export function addReplyListener(chatId, messageId, listener) {
    return tgWrapper.addReplyListener(chatId, messageId, listener);
}

export async function startTelegramBot() {
    return await tgWrapper.startTelegramBot();
}
