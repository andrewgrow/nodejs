'use strict';

/**
 * Telegram Controller is handle requests from incoming messages of bot and prepare answers.
 */

const utils = require('../utils/utils');
const model = require('../db/models/telegram');
const tgUtils = require('./telegramUtils');

let isStarted = false;

const form = {
    reply_markup: {
        force_reply: true,
    }
};

async function startTelegramBot() {
    if (isStarted) {
        return isStarted;
    }

    if (await model.isDbDisconnected()) {
        throw new Error('DB is disconnected. Cannot start working.')
    }

    return tgUtils.startTelegramBot()
        .then(addListenersToTelegramBot)
        .then(() => {
            isStarted = true;
            return isStarted;
        });
}

function addListenersToTelegramBot() {
    tgUtils.addTextListener(/\/start/, listenerStartMessage);
    tgUtils.addTextListener(/\/deposit/, listenerDepositMessage);
    tgUtils.addTextListener(/\/refill/, listenerRefillMessage);
    tgUtils.addTextListener(/\/all/, listenerSendToAllMessage);
    tgUtils.addMessageListener('message', listenerForAnyKindOfMessages);
}

/**
 * Listen an incoming message with command /start
 * @param msg
 * @param match Matches /start [whatever]
 */
async function listenerStartMessage(msg, match) {
    const chatId = msg.chat.id;
    console.log("-/start --------------------------------------------------------");

    if (utils.isEmpty(msg.text)) {
        return tgUtils.sendMessage(chatId, `Received your command, but not recognized it.`);
    }

    if (await isRestrictedToWrite(chatId)) {
        return 'user not able to write to this chat';
    }

    await tgUtils.showUserAccountResult(chatId);
}

/**
 * Listen an incoming message with command /deposit
 * @param msg
 * @param match Matches /deposit [whatever]
 */
async function listenerDepositMessage(msg, match) {
    const chatId = msg.chat.id;
    console.log("-/deposit --------------------------------------------------------");

    if (utils.isEmpty(msg.text)) {
        return tgUtils.sendMessage(chatId, `Received your command, but not recognized it.`);
    }

    if (await isRestrictedToWrite(chatId)) {
        return 'user not able to write to this chat';
    }

    const message = tgUtils.getMessageWithoutCommand(msg, '/deposit');

    if (utils.isEmpty(message)) {
        const text = 'Введите сумму пополнения в гривнах, например 123,44. Или введите ноль для отмены.';
        const question = await tgUtils.sendMessage(chatId, text, form,);
        tgUtils.addReplyListener(chatId, question.message_id, async (msg) => {
            console.log('reply DEPOSIT: ' + JSON.stringify(chatId) + " " + JSON.stringify(msg));
            await tgUtils.addTransaction(chatId, msg.text, 'deposit');
        });

    } else {
        await tgUtils.addTransaction(chatId, message, 'deposit');
    }
}

/**
 * Listen an incoming message with command /refill
 * @param msg
 * @param match Matches /refill [whatever]
 */
async function listenerRefillMessage(msg, match) {
    const chatId = msg.chat.id;
    console.log("-/refill --------------------------------------------------------");

    if (utils.isEmpty(msg.text)) {
        return tgUtils.sendMessage(chatId, `Received your command, but not recognized it.`);
    }

    if (await isRestrictedToWrite(chatId)) {
        return 'user not able to write to this chat';
    }

    const message = tgUtils.getMessageWithoutCommand(msg, '/refill');

    if (utils.isEmpty(message)) {
        const text = 'Введите сумму заправки в гривнах, например 123,44. Или введите ноль для отмены.';
        const question = await tgUtils.sendMessage(chatId, text, form,);
        tgUtils.addReplyListener(chatId, question.message_id, async (msg) => {
            console.log('reply REFILL: ' + JSON.stringify(chatId) + " " + JSON.stringify(msg));
            await tgUtils.addTransaction(chatId, msg.text, 'refill');
        });
    } else {
        await tgUtils.addTransaction(chatId, message, 'refill');
    }
}

/**
 * Listen an incoming message with command /all
 * @param msg
 * @param match Matches /all [whatever]
 */
async function listenerSendToAllMessage(msg, match) {
    const chatId = msg.chat.id;
    console.log("-/all --------------------------------------------------------");

    if (utils.isEmpty(msg.text)) {
        return tgUtils.sendMessage(chatId, `Received your command, but not recognized it.`);
    }

    if (await isRestrictedToWrite(chatId)) {
        return 'user not able to write to this chat';
    }

    const messageToAll = tgUtils.getMessageWithoutCommand(msg, '/all');

    if (utils.isEmpty(messageToAll)) {
        const message = 'Окей, что отправляем всем? Введите текст для отправки или цифру 0 для отмены.';
        const question = await tgUtils.sendMessage(chatId, message, form,);
        tgUtils.addReplyListener(chatId, question.message_id, (message) => {
            console.log('reply: ' + JSON.stringify(chatId) + " " + JSON.stringify(message));
            tgUtils.sendMessageToAll(chatId, message.text);
        });
    } else {
        await tgUtils.sendMessageToAll(chatId, messageToAll);
    }
}

async function listenerForAnyKindOfMessages(msg) {
    // ignore replies;
    if (msg.reply_to_message) {
        return;
    }

    const chatId = msg.chat.id;

    const isRestricted = await isRestrictedToWrite(chatId)
    if (isRestricted) {
        console.log('-------------------------------------------------------------')
        console.log(`MESSAGE listener (RESTRICTED AREA): chatId ${chatId}; message: ${JSON.stringify(msg)}; `)
        return tgUtils.sendMessage(chatId, `Вам нельзя отправлять команды в этот бот.`);
    }

    if (tgUtils.isCommand(msg)) {
        // ignore all commands
        console.log('-------------------------------------------------------------')
        console.log(`RECEIVED COMMAND: chatId ${chatId}; message: ${JSON.stringify(msg)}; `)
        return;
    }

    console.log('-------------------------------------------------------------')
    console.log(`MESSAGE listener: chatId ${chatId}; message: ${JSON.stringify(msg)}; `)
    // send a message to the chat acknowledging receipt of their message
    await tgUtils.sendMessage(chatId, 'Введите команду для выполнения действия. Список доступных команд смотрите в меню чата/');
}

async function isRestrictedToWrite(id) {
    if (utils.isWrongInt(id)) {
        return true;
    }
    // try to find telegram_chat in database
    const chatInDb = await model.getChatBy(id);
    return chatInDb === null;
}

module.exports = { startTelegramBot, listenerStartMessage, listenerDepositMessage }