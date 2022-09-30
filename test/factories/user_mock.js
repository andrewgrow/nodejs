'use strict';

const userModel = require('../../src/db/models/user');
const telegramModel = require('../../src/db/models/telegram');
const { UserDAO } = require('../../src/db/models/user');
const defaultPhone = '01234567890';
const defaultName = 'Test Name';
const defaultChatUid = '1234567890';

function getSimpleTestUser() {
    return new UserDAO(defaultPhone, defaultName);
}

function createUserRecordWithTestData(user = getSimpleTestUser()) {
    return userModel.createRecordIfPhoneNotExist(user);
}

function createTestTelegramUser(userId, chatUid) {
    return new Promise((resolve, _) => {
       telegramModel.createTelegramUser(userId, chatUid)
           .then((telegramUserId) => {
               resolve(telegramModel.getChatByLocalId(telegramUserId));
           });
    });
}

module.exports = { getSimpleTestUser, createUserRecordWithTestData, createTestTelegramUser, defaultChatUid }