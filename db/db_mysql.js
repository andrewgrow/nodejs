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

function getBy(table, field, value) {
    const request = `SELECT * FROM ${ table } WHERE ${ field } = ?`;
    return query(request, [ value ])
        .then((resultArray) => {
            if (resultArray != null && resultArray.length > 0 && resultArray[0] != null) {
                return (resultArray[0]);
            } else {
                return null;
            }
        }).catch((err) => {
            return null;
        });
}

function getTablesList() {
    return new Promise((resolve, reject) => {
        const request = `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ?`;
        query(request, [ config.name ]).then((resultArray) => {
            if (resultArray != null && resultArray.length > 0 && resultArray[0] != null) {
                resolve(resultArray);
            } else {
                reject(new Error('No tables found'));
            }
        });
    });
}

function end() {
    return pool.end();
}

async function isDbConnected() {
    console.log('check if Database is connected');
    return await query('SELECT 1;', null).then(true).catch((err) => { return false });
}

async function isDbDisconnected() {
    return !await isDbConnected(); // opposite value
}

module.exports = { query, getById, tables, getBy, getTablesList, end, isDbDisconnected };