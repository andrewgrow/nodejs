'use strict';

const mysql = require('../../../db/db_mysql');
const transactionModel = require('../../../db/models/transaction');
const userFabric = require("../../factories/UserFabric");

describe('test ../db/models/transaction.js', function () {
    before('create test user', async function () {
        return await userFabric.createUserRecord();
    });
    describe('test function addRefill()', function () {
        it('should create new record with refill', function () {
            const insertId = transactionModel.addRefill(1, 1, 123.45);
            return assert.eventually.equal(insertId, 1);
        });
        it ('should be -12345', function () {
           const refillValue = mysql.getById(mysql.tables.ACCOUNT_TRANSACTIONS_TABLE, 1)
               .then((refillObject) => {
                   return refillObject.sum;
               });
           return assert.eventually.equal(refillValue, '-12345');
        });
    });
    describe('test function addDeposit()', function () {
        it('should create new record with deposit', function () {
            const insertId = transactionModel.addDeposit(1, 1, 123.45);
            return assert.eventually.equal(insertId, 2);
        });
        it('should be 12345', function () {
            const depositValue = mysql.getById(mysql.tables.ACCOUNT_TRANSACTIONS_TABLE, 2)
                .then((depositObject) => {
                    return depositObject.sum;
                });
            return assert.eventually.equal(depositValue, 12345);
        });
    });
});