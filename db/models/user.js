'use strict';

const db = require('../db_mysql');
const mysql = require("../db_mysql");

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
    const resultArray = await db.query(request, values);
    if (resultArray != null && resultArray.length > 0 && resultArray[0] != null) {
        return resultArray[0];
    }
}

async function findByPhone(value) {
    const request = "SELECT * FROM `users` AS `u` WHERE `u`.`phone` = ? ";
    const values = [ value ];
    const resultArray = await db.query(request, values);
    if (resultArray != null && resultArray.length > 0 && resultArray[0] != null) {
        return resultArray[0];
    }
    return null;
}

async function createRecord(userDao) {
    const request = "INSERT INTO users (`phone`, `name`) VALUES (?, ?);";
    const values = [ userDao.phone, userDao.name ];
    const result = await db.query(request, values);
    return result.insertId;
}

async function createRecordIfNotExists(userDao) {
    const user = await findByPhone(userDao.phone);
    if (user) {
        return null;
    } else {
        return createRecord(userDao);
    }
}

async function forceDeleteUser(id) {
    const user = await findById(id)
    if (user) {
        return await mysql.query('DELETE FROM `users` AS `user` WHERE `user`.`_id` = ?;', [ id ]);
    }
    return null;
}

module.exports = { UserDAO, findById, forceDeleteUser, createRecordIfNotExists }