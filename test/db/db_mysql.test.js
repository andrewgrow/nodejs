'use strict';

const mysql = require('../../db/db_mysql');
const userMock = require('../factories/user_mock');
const testUser = userMock.getSimpleTestUser();

describe('test ../db/db_mysql.js', function () {
    describe('test function query())', function () {
        it('should return a normal array when a query is correct', function () {
            const sqlQuery = 'SELECT 1;';
            const correctAnswer = JSON.stringify([ { '1': 1 } ]);
            return assert.eventually.equal(mysql.query(sqlQuery).then((result => {
                return JSON.stringify(result);
            })), correctAnswer);
        });
        it('should throw error if a query is wrong', function () {
            const sqlQuery = 'SELECT X;';
            const expectedErrorMessage = "Unknown column 'X' in 'field list'";
            return assert.isRejected(mysql.query(sqlQuery), expectedErrorMessage);
        });
    });

    describe('test functions with testUser', function () {
        let expectedUserId;
        before('create a test record', async function () {
            expectedUserId = await userMock.createUserRecordWithTestData().then((result) => { return result.user_id });
        });

        describe('test function getBy()', function () {
            it('should return a normal result if a query is correct', async function () {
                mysql.getBy('users', 'name', testUser.name)
                    .then((dbUser) => assertUser(dbUser, expectedUserId))
            });

            it('should be null if the table does not exist', function () {
                return assert.eventually.isNull(mysql.getBy('someTable', '_id', 1));
            });

            it('should be null if the field does not exist', function () {
                return assert.eventually.isNull(mysql.getBy('users', 'id', 1));
            });

            it('should be null if the value does not exist', function () {
                return assert.eventually.isNull(mysql.getBy('users', '_id', null));
            });
        });

        describe('test function getById()', function () {
           it('should return a user record', async function () {
               mysql.getBy('users', 'name', testUser.name)
                   .then((dbUser) => assertUser(dbUser))
           });
        });

        describe('test function getAll()', function () {
            it('should return all records from users table', function () {
                const allUsersCount = mysql.getAll(mysql.tables.USERS_TABLE)
                    .then((usersList) => { return usersList.length });
                return assert.eventually.equal(allUsersCount, 1);
            });

            it('should return 2 or more records from migrations table', function () {
                const allMigrationsCount = mysql.getAll(mysql.tables.MIGRATIONS_TABLE)
                    .then((migrationsList) => { return migrationsList.length });
                return assert.eventually.isAtLeast(allMigrationsCount, 2);
            });
        });
    });

    describe('test function getTablesList()', function () {
        it('should contains 5 or more tables', function () {
            const listLength = mysql.getTablesList().then((list => { return list.length; }));
            return assert.eventually.isAtLeast(listLength, 5);
        });
    });

    describe('test functions isDbConnected & isDbDisconnected() when docker-compose is up', function () {
        it('should be true', function () {
            return assert.eventually.equal(mysql.isDbConnected(), true);
        });

        it('should be false', function () {
            return assert.eventually.equal(mysql.isDbDisconnected(), false);
        });
    });

    describe('test function getLastRecord()', function () {
        let expectedElement;
        before('prepare list with known values and ids', async function () {
            expectedElement = await mysql.getAll(mysql.tables.MIGRATIONS_TABLE)
                .then((list) => {
                    return list.slice(-1)[0]; // get last element of the array
                }).then((obj) => {
                    return JSON.stringify(obj); // transform to json
                });
        });
        it ('should be equal', function () {
            const actualElement = mysql.getLastRecord(mysql.tables.MIGRATIONS_TABLE)
                .then((obj) => {
                    return JSON.stringify(obj); // transform to json
                });
            return assert.eventually.equal(actualElement, expectedElement);
        });
        it ('should be null if table is wrong', function () {
            return assert.eventually.isNull(mysql.getLastRecord('check_wrong_table'));
        });
    });
});

function assertUser(dbUser, expectedUserId) {
    assert.isNotNull(dbUser);
    assert.equal(dbUser.name, testUser.name);
    assert.equal(dbUser.phone, testUser.phone);
    assert.equal(dbUser._id, expectedUserId);
    assert.isTrue(dbUser.created_at > 0);
}

