'use strict';

const mysql = require("../db_mysql");

async function getChatBy(id) {
    return await mysql.getBy(mysql.tables.TELEGRAM_USERS_TABLE, 'chat_id', id);
}

function getChatsList() {
    const query = 'SELECT * FROM `telegram_users` LIMIT 1000;'
    return mysql.query(query, null);
}

module.exports = { getChatBy, getChatsList }