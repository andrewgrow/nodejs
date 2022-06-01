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
});

async function connect() {
    return new Promise((resolve, reject) => {
        connection.connect(function(err){
            if (err) {
                // return console.error("DBConnection error: " + err.message);
                isConnected = false;
                reject(err);
            }
            else{
                // console.log("DBConnection established successful");
                isConnected = true;
                resolve("DBConnection established successful");
            }
        });
    })
}

module.exports = { connect };