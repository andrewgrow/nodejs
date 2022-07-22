'use strict';

const wrapper = require('../../telegram/telegramBotWrapper');
const controller = require('../../telegram/telegramController');
const userMock = require('../factories/user_mock');

function createSendListener(resultObject) {
    return function (chatId, message, form) {
        resultObject.chat_id = chatId;
        resultObject.message = message;
        resultObject.form = form;
    };
}

describe('test ../telegram/telegramController.js', function () {
    describe('test function startTelegramBot()', function () {
        it('should return true when started correct', function () {
            const isStarted = controller.startTelegramBot()
                .then((isStarted) => { return isStarted; })
            return assert.eventually.equal(isStarted, true);
        });
    });

    describe('test function listenerStartMessage()', function () {
        it('should send error message when incoming text is empty', function () {
            const resultObject = {};
            const senderListener = createSendListener(resultObject);
            wrapper.addSenderListener(senderListener);
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
            const resultObject = {};
            const senderListener = createSendListener(resultObject);
            wrapper.addSenderListener(senderListener);
            const userResult = await userMock.createUserRecordWithTestData();
            const tgChat = await userMock.createTestTelegramUser(userResult.user_id, userMock.defaultChatUid);
            const msg = { chat: { id : tgChat.chat_id }, text: 'test message', form: null };
            await controller.listenerStartMessage(msg, null);
            assert.equal(resultObject.chat_id, tgChat.chat_id);
            assert.equal(resultObject.message, 'Hi Test Name!  Личный счёт 0.00 грн. Общий счёт 0.00 грн.');
        });
    });
    describe('test function listenerDepositMessage()', function () {
        it('should be return error message if user is wrong', function () {
            const msg = { chat: { id : 99999 }, text: 'test message', form: null };
            return assert.eventually.equal(controller.listenerDepositMessage(msg, null), "user not able to write to this chat");
        });
    });
});