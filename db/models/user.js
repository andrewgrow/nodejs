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

    constructor(phone, name, createdAt, updatedAt, deletedAt) {
        this.phone = phone;
        this.name = name;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }
}

async function findById(id) {
    const request = "SELECT * FROM users WHERE _id = ?";
    const values = [ id ];
    return await db.query(request, values);
}

async function createUserRecord(user) {
    const request = "INSERT INTO users (phone, name) VALUES (?, ?);";
    const values = [ user.phone, user.name, "aaa", "sss" ];

    const result = await db.query(request, values);
    console.log(`createUserRecord! ${JSON.stringify(result)}`)
    return result.insertId;
}



module.exports = { User, findById, createUserRecord }