'use strict';

const mysql = require('../../../db/db_mysql');
const tokenModel = require('../../../db/models/requestToken');
const userModel = require('../../../db/models/user');

const userDao = require('../../factories/UserFabric').makeTestUser();

describe('test ../db/models/requestToken.js', function () {
    let testToken = null;

    describe('test function findByValue()', function () {
        it('should be rejected if userId is null', function () {
            return assert.isRejected(tokenModel.createRecord(null));
        });

        it('should be rejected if userId does not exist', function () {
            return assert.isRejected(tokenModel.createRecord(1234567890));
        });

        it('should be created when user phone is correct', function () {
            return userModel.createRecordIfPhoneNotExist(userDao)
                .then((userCreatingResult) => {
                    const userId = userCreatingResult.user_id;
                    return assert.eventually.equal(tokenModel.createRecord(userId), 1);
                });
        });

        it('should be created when user name is correct', function () {
            return userModel.createRecordIfNameNotExist(userDao)
                .then((userCreatingResult) => {
                    const userId = userCreatingResult.user_id;
                    return assert.eventually.equal(tokenModel.createRecord(userId), 2);
                });
        });
    });

    describe('test function forceDeleteToken()', function () {
        let token;

        before('get last created token', async function () {
            token = await mysql.query('SELECT * FROM `request_tokens` WHERE value IS NOT NULL ORDER BY _id LIMIT 1;')
                .then((selectResult) => {
                    if (selectResult !== null && selectResult[0] !== null) {
                        return Promise.resolve(selectResult[0]);
                    } else {
                        return Promise.reject('Select Result is null');
                    }
                });
        })

        it('should be 1 affected row after correct delete', function () {
            return assert.eventually.equal(tokenModel.forceDeleteToken(token.value), 1);
        });

        it('should be 0 affected rows if the value does not exist', function () {
            return assert.eventually.equal(tokenModel.forceDeleteToken('test'), 0);
        });
    });
});