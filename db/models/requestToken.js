'use strict';

const mysql = require("../db_mysql");

class RequestTokenDAO {
    expire_at
}

async function findByValue(value) {
    const dbTokensList = await mysql.query('SELECT * FROM `request_tokens` WHERE `value` = ? LIMIT 1;'
        , [value])
    if (dbTokensList != null && dbTokensList.length > 0 && dbTokensList[0] != null) {
        return dbTokensList[0];
    }
    return null;
}

async function forceDeleteToken(value) {
    const token = await findByValue(value);
    if (token === null || token === undefined) {
        return null;
    }
    const result = await mysql.query('DELETE FROM `request_tokens` AS `token` WHERE `token`.`value` = ? LIMIT 1;', [value]);
    return result;
}

module.exports = { RequestTokenDAO, findByValue, forceDeleteToken }

