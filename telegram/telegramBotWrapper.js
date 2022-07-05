'use strict';

const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_TOKEN || 'MOCK_TELEGRAM_BOT_TOKEN';
let bot;

function getBot() {
    return bot;
}

function getBotInfo() {
    return getBot().getMe();
}

function addMessageListener(event, listener) {
    getBot().on(event, listener);
}

function addTextListener(regexp, listener) {
    getBot().onText(regexp, listener);
}

function sendMessage(chatId, message, form) {
    return getBot().sendMessage(chatId, message, form);
}

function addReplyListener(chatId, messageId, listener) {
    getBot().onReplyToMessage(chatId, messageId, listener);
}

async function startTelegramBot() {
    bot = new TelegramBot(token, { polling: true });
    return await getBotInfo()
        .then((info) => {
            console.log(`TelegramBot started: ${JSON.stringify(info)}`)
            return info;
        }).catch((error) => {
            console.error(`=======================================================================`);
            console.log(`TelegramBot error!: ${JSON.stringify(error.message)}`);
            bot.stopPolling();
            initStubBot();
        });
}

function initStubBot() {
    bot = new LocalStubBot();
    console.error(`=======================================================================`);
    console.error(`Initiated LocalStubBot! Be aware with messaging, sending does not work!`);
    console.error(`=======================================================================`);
}

class LocalStubBot {
    onText() {};
    onReplyToMessage() {};
    getMe() {};
    on() {};
}


module.exports = { getBotInfo, addMessageListener, addTextListener, sendMessage, addReplyListener,
    startTelegramBot
}
