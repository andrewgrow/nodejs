'use strict';

const mysql = require("../db_mysql");

class TelegramMessage {
    chat; reply_to_message;
}

function getChatByLocalId(localId) {
    return mysql.getById(mysql.tables.TELEGRAM_USERS_TABLE, localId);
}

function getChatBy(chat_id) {
    return mysql.getBy(mysql.tables.TELEGRAM_USERS_TABLE, 'chat_id', chat_id);
}

function getChatsList() {
    return mysql.getAll(mysql.tables.TELEGRAM_USERS_TABLE);
}

function getChatsListByUser(userId) {
    const query = 'SELECT * FROM `telegram_users` WHERE `user_id` = ? LIMIT 1000;'
    return mysql.query(query, [userId]);
}

async function isDbDisconnected() {
    return await mysql.isDbDisconnected();
}

function createTelegramUser(userId, chatId) {
    if (userId === null || userId === undefined || chatId === null || chatId === undefined) {
        throw new Error('Cannot create a telegram chat with an user invalid data.');
    }
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM `telegram_users` WHERE user_id = ? AND chat_id = ?';
        mysql.query(sql, [userId, chatId]) // try to find exist chat
            .then((result) => {
                if (result.length === 0) { // if it does not exist, make new. First try to find user
                    return mysql.getById(mysql.tables.USERS_TABLE, userId);
                } else {
                    resolve(result[0]._id);
                    return null;
                }
            })
            .then((dbUser) => { // if user exist, we will create chat
                if (dbUser !== null && dbUser !== undefined) {
                    const sql = "INSERT INTO telegram_users (`user_id`, `chat_id`) VALUES (?, ?);";
                    return mysql.query(sql, [userId, chatId]);
                } else {
                    reject(new Error('Cannot create a telegram chat when user does not exist.'));
                }
            }).then((result) => {
                resolve(result.insertId);
            });
    });
}

module.exports = { getChatBy, getChatsList, getChatsListByUser, isDbDisconnected, createTelegramUser,
    getChatByLocalId
}