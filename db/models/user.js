'use strict';

const db = require('../db_mysql');

class User {
/*
    CREATE TABLE IF NOT EXISTS `users` (
    `_id` INT AUTO_INCREMENT PRIMARY KEY,
    `phone` TEXT,
    `name` TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
) ENGINE = InnoDB;
*/

    id = 0;
    phone = null;
    name = null;
    createdAt = null;
    updatedAt = null;
    deletedAt = null;

    constructor(id = 0, phone, name, createdAt, updatedAt, deletedAt) {
        this.id = id;
        this.phone = phone;
        this.name = name;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }
}

function findById(id) {
    const request = "SELECT * FROM users WHERE _id = ?";
    const values = [ id ];
    db.connection.query(request, values).then((result) => {
        // such as:
        // result = [{"_id":1,"phone":"+3800000001","name":"Dave",
        // "created_at":"2022-06-01T19:15:54.000Z",
        // "updated_at":null,"deleted_at":null}]
        console.log(`result = ${JSON.stringify(result)}`);
    }).catch((err) => {
        console.error(err);
    })
}

function createUserRecord(user) {
    const request = "INSERT INTO users (phone, name) VALUES (?, ?);";
    const values = [ user.phone, user.name ]

    db.connection.query(request, values).then().catch();
}

module.exports = { findById }