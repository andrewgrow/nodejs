'use strict';

const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(token, {polling: true});
const utils = require('../utils/utils');
const model = require('../db/models/telegram');
const tgUtils = require('./telegramUtils');

let isRunning = false;

function startTelegramBot() {
    if (isRunning) {
        return;
    }
    isRunning = true;

    bot.getMe().then((info) => {
        console.log(`TelegramBot started: ${JSON.stringify(info)}`)
    })

    // Matches /all [whatever]
    bot.onText(/\/all/, async function (msg, match) {
        const chatId = msg.chat.id;
        console.log("-/all --------------------------------------------------------");

        if (utils.isEmpty(msg.text)) {
            return bot.sendMessage(chatId, `Received your command, but not recognized it.`);
        }

        if (await isRestrictedToWrite(chatId)) {
            return;
        }

        const messageToAll = tgUtils.getMessageWithoutCommand(msg, '/all');

        if (utils.isEmpty(messageToAll)) {
            const question = await bot.sendMessage(chatId,
                'Окей, что отправляем всем? Введите текст для отправки или цифру 0 для отмены.',
                {
                    reply_markup: {
                        force_reply: true,
                    }
                },
            );
            bot.onReplyToMessage(chatId, question.message_id, (message) => {
                console.log('reply: ' + JSON.stringify(chatId) + " " + JSON.stringify(message));
                tgUtils.sendMessageToAll(chatId, message.text);
            });

        } else {
            await tgUtils.sendMessageToAll(chatId, messageToAll);
        }
    });

    bot.onText(/\/refill/, async function (msg, match) {
        const chatId = msg.chat.id;
        console.log("-/refill --------------------------------------------------------");

        if (utils.isEmpty(msg.text)) {
            return bot.sendMessage(chatId, `Received your command, but not recognized it.`);
        }

        if (await isRestrictedToWrite(chatId)) {
            return;
        }

        const message = tgUtils.getMessageWithoutCommand(msg, '/refill');

        if (utils.isEmpty(message)) {
            const question = await bot.sendMessage(chatId,
                'Введите сумму заправки в гривнах, например 123,44. Или введите ноль для отмены.',
                {
                    reply_markup: {
                        force_reply: true,
                    }
                },
            );
            bot.onReplyToMessage(chatId, question.message_id, async (msg) => {
                console.log('reply REFILL: ' + JSON.stringify(chatId) + " " + JSON.stringify(msg));
                await tgUtils.addTransaction(chatId, msg.text, 'refill');
            });

        } else {
            await tgUtils.addTransaction(chatId, message, 'refill');
        }
    });

    bot.onText(/\/deposit/, async function (msg, match) {
        const chatId = msg.chat.id;
        console.log("-/deposit --------------------------------------------------------");

        if (utils.isEmpty(msg.text)) {
            return bot.sendMessage(chatId, `Received your command, but not recognized it.`);
        }

        if (await isRestrictedToWrite(chatId)) {
            return;
        }

        const message = tgUtils.getMessageWithoutCommand(msg, '/deposit');

        if (utils.isEmpty(message)) {
            const question = await bot.sendMessage(chatId,
                'Введите сумму пополнения в гривнах, например 123,44. Или введите ноль для отмены.',
                {
                    reply_markup: {
                        force_reply: true,
                    }
                },
            );
            bot.onReplyToMessage(chatId, question.message_id, async (msg) => {
                console.log('reply DEPOSIT: ' + JSON.stringify(chatId) + " " + JSON.stringify(msg));
                await tgUtils.addTransaction(chatId, msg.text, 'deposit');
            });

        } else {
            await tgUtils.addTransaction(chatId, message, 'deposit');
        }
    });

// Listen for any kind of message. There are different kinds of
// messages.
    bot.on('message', async (msg) => {
        // ignore replies;
        if (msg.reply_to_message) {
            return;
        }

        const chatId = msg.chat.id;

        const isRestricted = await isRestrictedToWrite(chatId)
        if (isRestricted) {
            console.log('-------------------------------------------------------------')
            console.log(`MESSAGE listener (RESTRICTED AREA): chatId ${chatId}; message: ${JSON.stringify(msg)}; `)
            return bot.sendMessage(chatId, `Вам нельзя отправлять команды в этот бот.`);
        }

        if (tgUtils.isCommand(msg)) {
            if (tgUtils.isCommandEquals(msg, '/start')) {
                console.log(`command /START`) ;
            } else {
                // ignore all commands exclude /START;
                console.log('-------------------------------------------------------------')
                console.log(`RECEIVED COMMAND: chatId ${chatId}; message: ${JSON.stringify(msg)}; `)
                return;
            }
        }

        console.log('-------------------------------------------------------------')
        console.log(`MESSAGE listener: chatId ${chatId}; message: ${JSON.stringify(msg)}; `)
        // send a message to the chat acknowledging receipt of their message
        await bot.sendMessage(chatId, 'Введите команду для выполнения действия. Список доступных команд смотрите в меню чата/');
    });
}

async function isRestrictedToWrite(id) {
    if (utils.isWrongInt(id)) {
        return true;
    }
    // try to find telegram_chat in database
    const chatInDb = await model.getChatBy(id);
    return chatInDb === null;
}

module.exports = { startTelegramBot }