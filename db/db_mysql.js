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
    });

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
                reject(new Error('No tables found. Did you run migrations before?'));
            }
        });
    });
}

function getAll(table) {
    return new Promise((resolve, reject) => {
        if (config.isTableExists(table)) {
            const sql = `SELECT * FROM ${ table } LIMIT 1000;`
            resolve(query(sql, null));
        } else {
            reject(new Error(`table ${table} does not exist.`))
        }
    });
}

function end() {
    return pool !== null && pool !== undefined && pool.end();
}

function isDbConnected() {
    console.log('check if Database is connected');
    return new Promise((resolve, _) => {
        query('SELECT 1;', null)
            .then((_) => {
                resolve(true);
            })
            .catch((_) => {
                resolve(false);
            })
    });
}

async function isDbDisconnected() {
    return !await isDbConnected(); // opposite value
}

module.exports = { query, getById, tables, getBy, getTablesList, end, isDbConnected, isDbDisconnected,
    getAll
};