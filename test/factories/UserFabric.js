'use strict';

const userModel = require('../../db/models/user');
const telegramModel = require('../../db/models/telegram');
const { UserDAO } = require('../../db/models/user');
const defaultPhone = '01234567890';
const defaultName = 'Test Name';
const defaultChatUid = '123456789AA';

function makeTestUser() {
    return new UserDAO(defaultPhone, defaultName);
}

function createUserRecord(user = makeTestUser()) {
    return userModel.createRecordIfPhoneNotExist(user);
}

function createTelegramChatForUser(userId, chatUid) {
    return new Promise((resolve, _) => {
       telegramModel.createTelegramUser(userId, chatUid)
           .then((telegramUserId) => {
               resolve(telegramModel.getChatByLocalId(telegramUserId));
           });
    });
}

module.exports = { makeTestUser, createUserRecord, createTelegramChatForUser, defaultChatUid }