'use strict';

const mysql = require("mysql2");
const config = require('./db_config')
let isConnected = false

const connection = mysql.createConnection({
    host: config.host,
    user: config.user,
    database: config.name,
    password: config.password,
    port: config.port
    }).promise();

function connect() {
    if (isConnected) {
        return "DBConnection already established!";
    }
    connection
        .connect()
        .then((success) => {
            isConnected = true;
            console.log(`DBConnection established successful. DBObject : ${JSON.stringify(success)}`);
        })
        .catch(error => {
            console.error("DBConnection error: " + error.message);
        });
}

module.exports = { connect, connection };