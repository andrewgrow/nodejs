'use strict';

const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(token, {polling: true});

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

        if (msg.text) {
            const command = msg.text.slice(4).trim(); // remove from 0 to 4 characters

            if (!command || command.length === 0) {
                // bot.sendMessage(chatId, `Что-бы отправить сообщение, после комады /all должен идти какой-нибудь текст. Сделайте лонг-клик на команде, чтобы вставить её в поле для набора текста.`);
                const question = await bot.sendMessage(chatId,
                    'Окей, что отправляем всем? Введите текст для отправки или цифру 0 для отмены.',
                    {
                        reply_markup: {
                                force_reply: true,
                            }
                        },
                    );
                bot.onReplyToMessage(chatId, question.message_id, (message) => {
                    // bot.sendMessage(msg.chat.id, `Ok, your text is ${message.text}!`);
                    require('./telegramUtils').sendMessageToAll(message.text);
                });

            } else {
                bot.sendMessage(chatId, `Received your command: ${ command } `);
            }
            console.log(`Received Command: chatId ${chatId}; message: ${JSON.stringify(msg)}; `)

        } else {
            bot.sendMessage(chatId, `Received your command, but not recognized it.`);
        }
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
        bot.sendMessage(chatId, 'Received your message');
    });
}

module.exports = { startTelegramBot }