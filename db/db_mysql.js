'use strict';

const mysql = require("mysql2");
const config = require('./db_config');
const tables = config.tables;

const pool = mysql.createPool({
        host: config.host,
        user: config.user,
        database: config.name,
        password: config.password,
        port: config.port
    }
);

function query (sql, values) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                connection.query(sql, values, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                    connection.release();
                })
            }
        });
    });
}

async function getById (table, value) {
    return await new Promise(async (resolve, reject) => {
        const request = `SELECT * FROM ${ table } WHERE _id = ?`;
        const resultArray = await query(request, [ value ]);
        if (resultArray != null && resultArray.length > 0 && resultArray[0] != null) {
            resolve(resultArray[0]);
        } else {
            reject(new Error('Not found'));
        }
    }).then((result) => {
        return result
    }).catch(() => {
        return null;
    });
}

async function getBy(table, field, value) {
    const request = `SELECT * FROM ${ table } WHERE ${ field } = ?`
    return await new Promise(async (resolve, reject) => {
        const resultArray = await query(request, [ value ]);
        if (resultArray != null && resultArray.length > 0 && resultArray[0] != null) {
            resolve(resultArray[0]);
        } else {
            reject(new Error('Not found'));
        }
    }).then((result) => {
        return result
    }).catch(() => {
        return null;
    });
}

async function getTablesList() {
    const request = `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ?`
    return await new Promise(async (resolve, reject) => {
        const resultArray = await query(request, [ config.name ]);
        if (resultArray != null && resultArray.length > 0 && resultArray[0] != null) {
            resolve(resultArray);
        } else {
            reject(new Error('No tables found'));
        }
    }).then((result) => {
        return result
    }).catch(() => {
        return null;
    });
}

function end() {
    return pool.end();
}

module.exports = { query, getById, tables, getBy, getTablesList, end };