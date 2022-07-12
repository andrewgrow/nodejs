'use strict';

const mysql = require("../db_mysql");

class TelegramMessage {
    chat; reply_to_message;
}

function getChatBy(id) {
    return mysql.getBy(mysql.tables.TELEGRAM_USERS_TABLE, 'chat_id', id);
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

module.exports = { getChatBy, getChatsList, getChatsListByUser, isDbDisconnected }