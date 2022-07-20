'use strict';

const mysql = require("../db_mysql");
const crypto = require("crypto");
const userModel = require('../models/user');

function createRecord(userId) {
    return new Promise((resolve, reject) => {
        userModel.findUserById(userId)
            .then((user) => {
                if (user === null) {
                    reject(new Error('userId is incorrect'));
                } else {
                    const requestToken = {};
                    requestToken.user_id = user._id;
                    requestToken.value = crypto.randomBytes(16).toString('hex');
                    const sql = "INSERT INTO request_tokens (`user_id`, `value`) VALUES (?, ?);";
                    return mysql.query(sql, [requestToken.user_id, requestToken.value])
                }
            })
            .then((result) => {
                resolve(result.insertId);
            })
    });
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
        return 0;
    }
    const result = await mysql.query('DELETE FROM `request_tokens` AS `token` WHERE `token`.`value` = ? LIMIT 1;', [value]);
    return result.affectedRows;
}

function getById(id) {
    return mysql.getById(mysql.tables.REQUEST_TOKENS_TABLE, id);
}

function setExpireData(expireData, id) {
    const sql = 'UPDATE request_tokens SET expire_at = ? WHERE _id = ?;';
    return mysql.query(sql, [expireData, id]);
}

module.exports = { findByValue, forceDeleteToken, createRecord, getById, setExpireData }

