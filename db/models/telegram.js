'use strict';

const mysql = require("../db_mysql");

class TelegramMessage {
    chat; reply_to_message;
}

async function getChatBy(id) {
    return await mysql.getBy(mysql.tables.TELEGRAM_USERS_TABLE, 'chat_id', id);
}

function getChatsList() {
    const query = 'SELECT * FROM `telegram_users` LIMIT 1000;'
    return mysql.query(query, null);
}

function getChatsListByUser(userId) {
    const query = 'SELECT * FROM `telegram_users` WHERE `user_id` = ? LIMIT 1000;'
    return mysql.query(query, [userId]);
}

module.exports = { getChatBy, getChatsList, getChatsListByUser }