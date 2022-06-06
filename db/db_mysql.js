'use strict';

const mysql = require("mysql2");
const config = require('./db_config')

const tables = {
    USERS_TABLE: 'users'
}

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

module.exports = { query, getById, tables };