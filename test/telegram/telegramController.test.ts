'use strict';

import { assert } from "chai";

const wrapper = require('../../oldnode/telegram/telegramBotWrapper');
const controller = require('../../oldnode/telegram/telegramController');
const userMock = require('../factories/user_mock');

let userResult, tgChat;

function createSendListener(resultObject) {
    return function (chatId, message, form) {
        resultObject.chat_id = chatId;
        resultObject.message = message;
        resultObject.form = form;
    };
}

function prepareResultObject() {
    const resultObject = {}; // this object will get messages from telegram wrapper (as remote recipient)
    const senderListener = createSendListener(resultObject); // listen messages from tg and transfer their to result object
    wrapper.addSenderListener(senderListener); // set listener to wrapper
    return resultObject; // done
}

describe('test ../telegram/telegramController.ts', function () {
    before('create test user and tg chat', async function () {
        userResult = await userMock.createUserRecordWithTestData();
        tgChat = await userMock.createTestTelegramUser(userResult.user_id, userMock.defaultChatUid);
    });

    describe('test function startTelegramBot()', function () {
        it('should return true when started correct', function () {
            const isStarted = controller.startTelegramBot()
                .then((isStarted) => { return isStarted; })
            return assert.eventually.equal(isStarted, true);
        });
    });

    describe('test function listenerStartMessage()', function () {
        it('should send error message when incoming text is empty', function () {
            const resultObject: any = prepareResultObject();
            controller.listenerStartMessage({ chat: { id : 1 }, text: null, form: null }, null);
            assert.equal(resultObject.chat_id, 1);
            assert.equal(resultObject.message, 'Received your command, but not recognized it.');
        });
        it('should return error message when user is unknown for system', function () {
            const msg = { chat: { id : 99999 }, text: 'test message', form: null };
            const methodCall = controller.listenerStartMessage(msg, null);
            return assert.eventually.equal(methodCall, 'user not able to write to this chat');
        });
        it('should send correct message to user', async function () {
            const resultObject: any = prepareResultObject();
            const msg = { chat: { id : tgChat.chat_id }, text: 'test message', form: null };
            await controller.listenerStartMessage(msg, null);
            assert.equal(resultObject.chat_id, tgChat.chat_id);
            assert.equal(resultObject.message, 'Hi Test Name!  Личный счёт 0.00 грн. Общий счёт 0.00 грн.');
        });
    });
    describe('test function listenerDepositMessage()', function () {
        it('should be return error if user not able to write to this chat', function () {
            const msg = { chat: { id : 99999 }, text: 'test message', form: null };
            return assert.eventually.equal(controller.listenerDepositMessage(msg, null), "user not able to write to this chat");
        });
        it('should send answer if command is unrecognized', async function () {
            const resultObject: any = prepareResultObject();
            const msg = { chat: { id : tgChat.chat_id }, text: '', form: null };
            await controller.listenerDepositMessage(msg, null);
            assert.equal(resultObject.chat_id, tgChat.chat_id);
            assert.equal(resultObject.message, 'Received your command, but not recognized it.');
        });
        it('should send error if command contains wrong sum', async function () {
            const resultObject: any = prepareResultObject();
            const msg = { chat: { id : tgChat.chat_id }, text: 'test text', form: null,
                entities: [{"type": "bot_command"}]};
            await controller.listenerDepositMessage(msg, null);
            assert.equal(resultObject.chat_id, tgChat.chat_id);
            assert.equal(resultObject.message, 'Не удалось понять сумму транзакции. Произошла ошибка при разборе введённого числа.');
        });
        it('should send request to next command when only deposit got', async function () {
            const resultObject: any = prepareResultObject();
            const msg = { chat: { id : tgChat.chat_id }, text: '/deposit', form: null,
                entities: [{"type": "bot_command"}]};
            await controller.listenerDepositMessage(msg, null);
            assert.equal(resultObject.chat_id, tgChat.chat_id);
            assert.equal(resultObject.message, 'Введите сумму пополнения в гривнах, например 123,44. ' +
                'Или введите ноль для отмены.');
        });
        it('should add deposit 100 UAH', async function () {
            const resultObject: any = prepareResultObject();
            const msg = { chat: { id : tgChat.chat_id }, text: '/deposit 100', form: null,
                entities: [{"type": "bot_command"}]};
            await controller.listenerDepositMessage(msg, null);
            assert.equal(resultObject.chat_id, tgChat.chat_id);
            assert.isTrue(resultObject.message.startsWith('Hi Test Name! В ваш список транзакций добавлен депозит'));
        });
        it('should add deposit 100 UAH via reply', async function () {
            let resultObject: any = prepareResultObject();
            const msg = { chat: { id : tgChat.chat_id }, text: '/deposit', form: null,
                entities: [{"type": "bot_command"}]};
            const replyListener = await controller.listenerDepositMessage(msg, null);
            msg['text'] = '100';
            await replyListener(msg);
            assert.equal(resultObject.chat_id, tgChat.chat_id);
            assert.isTrue(resultObject.message.startsWith('Hi Test Name! В ваш список транзакций добавлен депозит'));
        });
    });
});