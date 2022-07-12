'use strict';

const userModel = require('../../db/models/user');
const telegramModel = require('../../db/models/telegram');
const { UserDAO } = require('../../db/models/user');
const defaultPhone = '01234567890';
const defaultName = 'Test Name';

function makeTestUser() {
    return new UserDAO(defaultPhone, defaultName);
}

function createUserRecord(user = makeTestUser()) {
    return userModel.createRecordIfNameNotExist(user);
}

function createTelegramChatForUser(user, chat) {
    return new Promise((resolve, _) => {
       telegramModel.createTelegramUser(user, chat)
           .then((telegramUserId) => {
               resolve(telegramModel.getChatByLocalId(telegramUserId));
           });
    });
}

module.exports = { makeTestUser, createUserRecord, createTelegramChatForUser }