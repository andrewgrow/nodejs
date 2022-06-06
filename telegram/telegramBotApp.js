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
        console.log("---------------------------------------");
        console.log("Command /all: from: " + JSON.stringify(msg));

        if (utils.isEmpty(msg.text)) {
            return bot.sendMessage(chatId, `Received your command, but not recognized it.`);
        }

        const isRestricted = await isRestrictedToWrite(chatId)
        if (isRestricted) {
            return bot.sendMessage(chatId, `Вам нельзя отправлять команды в этот бот.`);
        }

        const messageToAll = msg.text.slice(4).trim(); // remove from 0 to 4 characters

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
            tgUtils.sendMessageToAll(chatId, messageToAll);
        }
        console.log(`Received Command: chatId ${chatId}; message: ${JSON.stringify(msg)}; `)
    });

// Listen for any kind of message. There are different kinds of
// messages.
    bot.on('message', (msg) => {
        if (msg.entities && msg.entities.length > 0 && msg.entities[0].type === 'bot_command') {
            // ignore command;
            return;
        }

        if (msg.reply_to_message) {
            // ignore replies;
            return;
        }

        const chatId = msg.chat.id;
        console.log('-------------------------------------------------------------')
        console.log(`Received 2: chatId ${chatId}; message: ${JSON.stringify(msg)}; `)
        // send a message to the chat acknowledging receipt of their message
        bot.sendMessage(chatId, 'Введите команду для выполнения действия. Список доступных команд смотрите в меню чата/');
    });
}

async function isRestrictedToWrite(id) {
    if (utils.isWrongInt(id)) {
        return true;
    }
    // try find telegram_chat in database
    const chatInDb = await model.getChatBy(id);
    return chatInDb === null;
}

module.exports = { startTelegramBot }