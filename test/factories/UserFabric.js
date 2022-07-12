'use strict';

const userModel = require('../../db/models/user');
const mysql = require('../../db/db_mysql');

class User {
    constructor(name = 'Test Name', phone = '01234567890') {
        this.name = name;
        this.phone = phone;
    }
}

function makeTestUser() {
    return new User();
}

function createUserRecord(user = new User()) {
    return userModel.createRecordIfNameNotExist(user);
}

module.exports = { makeTestUser, createUserRecord }