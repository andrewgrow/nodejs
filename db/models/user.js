'use strict';

const mysql = require("../db_mysql");

class UserDAO {
    id = 0;
    phone = null;
    name = null;
}

async function findUserById(id) {
    return await mysql.getById(mysql.tables.USERS_TABLE, id);
}

async function findByPhone(value) {
    const request = "SELECT * FROM `users` AS `u` WHERE `u`.`phone` = ? ";
    const values = [ value ];
    const resultArray = await mysql.query(request, values);
    if (resultArray != null && resultArray.length > 0 && resultArray[0] != null) {
        return resultArray[0];
    }
    return null;
}

async function createRecord(user) {
    const request = "INSERT INTO users (`phone`, `name`) VALUES (?, ?);";
    const values = [ user.phone, user.name ];
    const result = await mysql.query(request, values);
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
    const user = await mysql.getById(mysql.tables.USERS_TABLE, id);
    if (user) {
        return await mysql.query('DELETE FROM `users` AS `user` WHERE `user`.`_id` = ?;', [ id ]);
    }
    return null;
}

module.exports = { UserDAO, findUserById, forceDeleteUser, createRecordIfNotExists }