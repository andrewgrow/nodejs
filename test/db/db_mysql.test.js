'use strict';

require("chai").use(require('chai-as-promised'));
const assert = require("chai").assert;
const mysql = require('../../db/db_mysql');

const dbMigrate = require('../../scripts/dbmigrate');

const testUser = { phone: '1234567890', name: 'TestUserName' }

describe('test ../db/db_mysql.js', function () {

    before('Check if migrations exists', async function () {
        await dbMigrate.runMigration();
    });

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
        before('create a test record', async function () {
            const result = await createTestUserIfDoesNotExist();
            console.log(`result1: ${JSON.stringify(result)}`)
        });

        describe('test function getBy()', function () {
            it('should return a normal result if a query is correct', async function () {
                const dbUser = await mysql.getBy('users', 'name', testUser.name);
                assert.equal(dbUser.name, testUser.name);
                assert.equal(dbUser.phone, testUser.phone);
                assert.equal(dbUser._id, 1);
                assert.isTrue(dbUser.created_at > 0);
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
           it('shoul return a user record', async function () {
               const dbUser = await mysql.getById('users', 1);
               assert.equal(dbUser.name, testUser.name);
               assert.equal(dbUser.phone, testUser.phone);
               assert.equal(dbUser._id, 1);
               assert.isTrue(dbUser.created_at > 0);
           });
        });
    });
});

function createTestUserIfDoesNotExist() {
    return new Promise((resolve, reject) => {
        mysql.getBy('users', 'name', testUser.name)
            .then((result) => {
                if (result === null) {
                    const request = "INSERT INTO users (`phone`, `name`) VALUES (?, ?);";
                    const values = [ testUser.phone, testUser.name ];
                    mysql.query(request, values)
                        .then((result) => {
                            resolve(result);
                        });
                } else {
                    resolve(null);
                }
            })
            .catch((err) => {
                console.error(err);
                reject(err);
        })
    });
}

