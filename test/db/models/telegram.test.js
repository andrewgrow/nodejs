'use strict';

const telegramModel = require('../../../db/models/telegram');
const userFabric = require('../../factories/UserFabric');
const chatUid = userFabric.defaultChatUid;
let testUser, testTgChat;

describe('test ../db/models/telegram.js', function () {
    before('create test user', async function () {
        testUser = await userFabric.createUserRecord();
        testTgChat = await userFabric.createTelegramChatForUser(testUser.user_id, chatUid);
    });

    describe('test function getChatBy()', function () {
        it('should be found by value', function () {
            const dbTgUser = telegramModel.getChatBy(chatUid)
                .then((tgUser) => { return JSON.stringify(tgUser) });
            return assert.eventually.equal(dbTgUser, JSON.stringify(testTgChat));
        });
        it('should be null when chatId is wrong', function () {
            const dbTgUser = telegramModel.getChatBy('test');
            return assert.eventually.isNull(dbTgUser);
        });
        it('should be null when chatId is null', function () {
            const dbTgUser = telegramModel.getChatBy(null);
            return assert.eventually.isNull(dbTgUser);
        });
    });

    describe('test function getChatByLocalId()', function () {
        it('should be created', function () {
            const id = testTgChat._id;
            const dbTgUser = telegramModel.getChatByLocalId(id)
                .then((tgUser) => { return tgUser._id });
            return assert.eventually.equal(dbTgUser, id);
        });
    });

    describe('test function getChatsList()', function () {
        it('should be 1 or more', function () {
            const tgUsersList = telegramModel.getChatsList()
                .then((list) => { return list.length });
            return assert.eventually.isAtLeast(tgUsersList, 1);
        });
    });

    describe('test function getChatsListByUser()', function () {
        it('should be 1 or more', function () {
            const tgUsersList = telegramModel.getChatsListByUser(1)
                .then((list) => { return list.length });
            return assert.eventually.isAtLeast(tgUsersList, 1);
        });
        it('should be 0', function () {
            const tgUsersList = telegramModel.getChatsListByUser(123465789)
                .then((list) => { return list.length });
            return assert.eventually.equal(tgUsersList, 0);
        });
    });

    describe('test function isDbDisconnected()', function() {
        it('should be false', function() {
            return assert.eventually.equal(telegramModel.isDbDisconnected(), false);
        });
    })

    describe('test createTelegramUser()', function () {
       it('should be rejected if user is null', function () {
           return assert.isRejected(telegramModel.createTelegramUser(null, chatUid));
       });
       it('should be rejected if chatUid is null', function () {
           return assert.isRejected(telegramModel.createTelegramUser(1, null));
       });
       it('should be return the same telegramUser._id if this tgUser exists', function () {
           const beforeCreatedId = 1;
           return assert.eventually.equal(
               telegramModel.createTelegramUser(1, chatUid), beforeCreatedId
           );
       });
        it('should be return new telegramUser._id if chatUid is new', function () {
            const expectCreatedId = 2;
            const testChatUid = 'testChatUid';
            return assert.eventually.equal(
                telegramModel.createTelegramUser(1, testChatUid), expectCreatedId
            );
        });
    });
});