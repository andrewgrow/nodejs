'use strict';

const mysql = require('../db_mysql');
const telegramModel = require('./telegram');

class UserDAO {
    _id; phone; name;
}

async function findUserById(id) {
    return await mysql.getById(mysql.tables.USERS_TABLE, id);
}

async function findByPhone(value) {
    const request = "SELECT * FROM `users` AS `u` WHERE `u`.`phone` = ? ";
    const values = [ value ];
    const resultArray = await mysql.query(request, values);
    if (resultArray != null && resultArray.length > 0 && resultArray[0] != null) {
        return resultArray[0];
    }
    return null;
}

async function createRecord(user) {
    const request = "INSERT INTO users (`phone`, `name`) VALUES (?, ?);";
    const values = [ user.phone, user.name ];
    const result = await mysql.query(request, values);
    return result.insertId;
}

async function createRecordIfNotExists(userDao) {
    const user = await findByPhone(userDao.phone);
    if (user) {
        return null;
    } else {
        return createRecord(userDao);
    }
}

async function forceDeleteUser(id) {
    const user = await mysql.getById(mysql.tables.USERS_TABLE, id);
    if (user) {
        return await mysql.query('DELETE FROM `users` AS `user` WHERE `user`.`_id` = ?;', [ id ]);
    }
    return null;
}

async function findUserByTelegramId(chatId) {
    const chat = await telegramModel.getChatBy(chatId);
    if (chat == null) {
        return null;
    }

    const user = await findUserById(chat.user_id);
    if (user == null) {
        return null;
    }

    return user;
}

async function getUserAccountResult(userId) {
    const request = 'SELECT SUM(t.sum) AS "user_account_result" FROM account_transactions t WHERE contractor_id = ?';
    const values = [ userId ];
    const resultArray = await mysql.query(request, values);
    if (resultArray != null && resultArray.length > 0 && resultArray[0] != null) {
        return resultArray[0].user_account_result * 0.01;
    }
    return null;
}

async function getCommonAccountResult() {
    const request = 'SELECT SUM(t.sum) AS "common_account_result" FROM account_transactions t';
    const resultArray = await mysql.query(request, null);
    if (resultArray != null && resultArray.length > 0 && resultArray[0] != null) {
        return resultArray[0].common_account_result * 0.01;
    }
    return null;
}

module.exports = { findUserById, forceDeleteUser, createRecordIfNotExists, findUserByTelegramId,
    getUserAccountResult, getCommonAccountResult
}