'use strict';

const db = require('../db_mysql');

class UserDAO {
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

async function createRecord(userDao) {
    const request = "INSERT INTO users (phone, name) VALUES (?, ?);";
    const values = [ userDao.phone, userDao.name ];
    const result = await db.query(request, values);
    return result.insertId;
}

module.exports = { UserDAO, findById, createRecord }