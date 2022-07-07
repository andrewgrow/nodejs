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

function getById (table, value) {
    return getBy(table, '_id', value);
}

function getBy(table, field, value) {
    const request = `SELECT * FROM ${ table } WHERE ${ field } = ?`;
    return new Promise((resolve, _) => {
        query(request, [ value ])
            .then((resultArray) => {
                if (resultArray != null && resultArray.length > 0 && resultArray[0] != null) {
                    resolve(resultArray[0]);
                } else {
                    resolve(null);
                }
            }).catch((_) => {
                resolve(null);
            });
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
    return await query('SELECT 1;', null).then(true).catch((_) => { return false });
}

async function isDbDisconnected() {
    return !await isDbConnected(); // opposite value
}

module.exports = { query, getById, tables, getBy, getTablesList, end, isDbDisconnected };