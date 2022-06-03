'use strict';

const mysql = require("mysql2");
const config = require('./db_config')

const pool = mysql.createPool({
        host: config.host,
        user: config.user,
        database: config.name,
        password: config.password,
        port: config.port
    }
);

const query = function (sql, values) {
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

module.exports = { query };