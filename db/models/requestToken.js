'use strict';

const mysql = require("../db_mysql");

class RequestTokenDAO {
    expire_at
}

async function findByValue(value) {
    const dbTokensList = await mysql.query('SELECT * FROM `request_tokens` WHERE `token` = ? LIMIT 1;'
        , [value])
    if (dbTokensList != null && dbTokensList.length > 0 && dbTokensList[0] != null) {
        return dbTokensList[0];
    }
    return null;
}

module.exports = { RequestTokenDAO, findByValue }

