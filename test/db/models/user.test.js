'use strict';

const mysql = require('../../../db/db_mysql');
const userFabric = require('../../factories/UserFabric');
const userModel = require('../../../db/models/user');
const utils = require('../../../utils/utils');
let testUser;

describe('test ../db/models/user.js', function () {
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
    describe('test function findByPhone()', function () {
        it('should be found', function () {
            const expectedUser = JSON.stringify(testUser);
            const actualUser = userModel.findByPhone(testUser.phone)
                .then((user) => { return JSON.stringify(user) });
            return assert.eventually.equal(actualUser, expectedUser);
        });
        it('should be null if phone is null', function () {
            return assert.eventually.isNull(userModel.findByPhone(null));
        });
        it('should be null if phone is incorrect', function () {
            return assert.eventually.isNull(userModel.findByPhone('1'));
        });
    });
    describe('test create and delete functions()', function () {
        let lastTestUserId;
        before('find last id of test users', async function () {
           lastTestUserId = await mysql.getLastRecord(mysql.tables.USERS_TABLE).then((user) => { return user._id });
        });
        it('should be more next id after create new user', function () {
            const newUserId = userModel.createRecord(testUser);
            return assert.eventually.isAbove(newUserId, lastTestUserId);
        });
        it('should be deleted and result returned', function () {
            return assert.eventually.isNotNull(userModel.forceDeleteUser(lastTestUserId + 1));
        });
        it('should be null when id is already deleted', function () {
            return assert.eventually.isNull(userModel.forceDeleteUser(lastTestUserId + 1));
        });
    });
    describe('test function createRecordIfPhoneNotExist()', function () {
        const randomPhone = utils.getRandomInt(380000000000, 380999999999);

        it('should be created and more then last user', async function () {
            const lastTestUserId = await mysql.getLastRecord(mysql.tables.USERS_TABLE)
                .then((user) => { return user._id });
            const newUserId = userModel.createRecordIfPhoneNotExist({ phone: randomPhone, name: 'Test Name' })
                .then((result) => { return result.user_id; })
            return assert.eventually.isAbove(newUserId, lastTestUserId);
        });
        it('should cannot be created if phone already exists', async function () {
            const lastTestUserId = await mysql.getLastRecord(mysql.tables.USERS_TABLE)
                .then((user) => { return user._id });
            const newUserId = userModel.createRecordIfPhoneNotExist({ phone: randomPhone, name: 'Test Name' })
                .then((result) => { return result.user_id; })
            return assert.eventually.equal(newUserId, lastTestUserId);
        });
    });

    describe('test function findUserByTelegramId()', function () {
        before('make tgChat for testUser if it did not create', async function() {
            await userFabric.createTelegramChatForUser(testUser._id, userFabric.defaultChatUid);
        });
        it ('should be the same user as testUser from the chat', function () {
            const foundUser = userModel.findUserByTelegramId(userFabric.defaultChatUid)
                .then((user) => {
                    return JSON.stringify(user);
                });
            return assert.eventually.equal(foundUser, JSON.stringify(testUser));
        });
        it('should be null if chatUid does not exist', function () {
            return assert.eventually.isNull(userModel.findUserByTelegramId('test'));
        });
        it('should be null if chatUid is null', function () {
            return assert.eventually.isNull(userModel.findUserByTelegramId(null));
        });
    });
});