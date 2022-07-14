'use strict';

const mysql = require('../../../db/db_mysql');
const userFabric = require('../../factories/UserFabric');
const userModel = require('../../../db/models/user');
let testUser;

describe.only('test ../db/models/user.js', function () {
    before('create test user', async function () {
        const record = await userFabric.createUserRecord();
        testUser = await mysql.getById(mysql.tables.USERS_TABLE, record.user_id);
    });
    describe('test function findUserById()', function () {
        let user;
        before('find user', async function () {
            user = await userModel.findUserById(1);
        });
        it('should be a correct name', function () {
            assert.equal(user.name, testUser.name);
        });
        it('should be a correct phone', function () {
            assert.equal(user.phone, testUser.phone);
        });
        it('should be a correct id', function () {
            assert.equal(user._id, 1);
        });
        it('should be null if id does not exist', function () {
            return assert.eventually.isNull(userModel.findUserById(123456789));
        });
        it('should be null if id is null', function () {
            return assert.eventually.isNull(userModel.findUserById(null));
        });
    });
});