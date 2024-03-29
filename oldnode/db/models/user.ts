'use strict';

const mysql = require('../db_mysql');
const telegramModel = require('./telegram');

class UserDAO {
    _id; phone; name; created_at;

    constructor(phoneArg, nameArg) {
        this.phone = phoneArg;
        this.name = nameArg;
    }
}

function findUserById(id) {
    return mysql.getById(mysql.tables.USERS_TABLE, id);
}

async function findByPhone(phone) {
    return mysql.getBy(mysql.tables.USERS_TABLE, 'phone', phone);
}

function findByName(name) {
    return mysql.getBy(mysql.tables.USERS_TABLE, 'name', name);
}

async function createRecord(user) {
    const request = "INSERT INTO users (`phone`, `name`) VALUES (?, ?);";
    const values = [ user.phone, user.name ];
    const result = await mysql.query(request, values);
    return result.insertId;
}

async function createRecordIfPhoneNotExist(userDao) {
    const result = {
        isNewUser: false,
        user_id: 0,
    };
    const user = await findByPhone(userDao.phone);
    if (user) {
        result.isNewUser = false;
        result.user_id = user._id;
    } else {
        result.isNewUser = true;
        result.user_id = await createRecord(userDao);
    }
    return result;
}

/* use this function for tests only */
function createRecordIfNameNotExist(userDao) {
    const result = {
        isNewUser: false,
        user_id: 0,
    };
    return new Promise((resolve, reject) => {
        findByName(userDao.name)
            .then(async (dbUser) => {
                if (dbUser) {
                    result.isNewUser = false;
                    result.user_id = dbUser._id;
                } else {
                    result.isNewUser = true;
                    result.user_id = await createRecord(userDao);
                }
                resolve(result);
            })
            .catch((err) => {
                console.error(err);
                reject(err);
            });
    });
}

async function forceDeleteUser(id) {
    const user = await mysql.getById(mysql.tables.USERS_TABLE, id);
    if (user) {
        return await mysql.query('DELETE FROM `users` AS `user` WHERE `user`.`_id` = ?;', [ id ]);
    }
    return null;
}

async function findUserByTelegramId(chatUid) {
    const chat = await telegramModel.getChatBy(chatUid);
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
        return (resultArray[0].user_account_result * 0.01).toFixed(2) ;
    }
    return '0.00';
}

async function getCommonAccountResult() {
    const request = 'SELECT SUM(t.sum) AS "common_account_result" FROM account_transactions t';
    const resultArray = await mysql.query(request, null);
    if (resultArray != null && resultArray.length > 0 && resultArray[0] != null) {
        return (resultArray[0].common_account_result * 0.01).toFixed(2);
    }
    return '0.00';
}

async function getUserName(userId) {
    const user = await findUserById(userId);
    if (user == null) {
        return null;
    }
    return user.name;
}

module.exports = { findUserById, forceDeleteUser, createRecordIfPhoneNotExist, findUserByTelegramId,
    getUserAccountResult, getCommonAccountResult, getUserName, createRecord, findByPhone,
    createRecordIfNameNotExist, UserDAO
};
export {};