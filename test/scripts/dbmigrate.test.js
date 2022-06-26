'use strict';

const chai = require("chai");
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const assert = require('chai').assert;

const mysql = require('../../db/db_mysql');

describe.only('test ../scripts/dbmigrate.js', function () {
    before('run all migrations', async function () {
        const dbMigrate = require('../../scripts/dbmigrate');
        await dbMigrate.runMigration();
    });

    after('drop all test tables and close connection', async function () {
        const tables = await mysql.getTablesList();
        for (let table of tables) {
            await mysql.query(`DROP TABLE IF EXISTS ${table.TABLE_NAME};`, null);
        }
        mysql.end();
    });

    describe('Test all tables migrations', function () {
        describe('Test the Migrations table', function () {
            let tableFields;
            before(async () => {
                tableFields = await mysql.query('DESCRIBE migrations;', null);
            })
            it('should exists "_id" field', () => {
                assert.isTrue(tableContainsField(tableFields, '_id'));
            });
            it('should exists "created_at" field', () => {
                assert.isTrue(tableContainsField(tableFields, 'created_at'));
            });
            it('should exists "filename" field', () => {
                assert.isTrue(tableContainsField(tableFields, 'filename'));
            });
        });
        describe('Test the Users table', function () {
            let tableFields;
            before(async () => {
                tableFields = await mysql.query('DESCRIBE users;', null);
            });
            it('should exists "_id" field', () => {
                assert.isTrue(tableContainsField(tableFields, '_id'));
            });
            it('should exists "phone" field', () => {
                assert.isTrue(tableContainsField(tableFields, 'phone'));
            });
            it('should exists "name" field', () => {
                assert.isTrue(tableContainsField(tableFields, 'name'));
            });
            it('should exists timestamps', () => assert.isTrue(tableContainsTimestamps(tableFields)));
        });
        describe('Test the Request Tokens table', function () {
            let tableFields;
            before(async () => {
                tableFields = await mysql.query('DESCRIBE request_tokens;', null);
            });
            it('should exists "_id" field', () => {
                assert.isTrue(tableContainsField(tableFields, '_id'));
            });
            it('should exists "user_id" field', () => {
                assert.isTrue(tableContainsField(tableFields, 'user_id'));
            });
            it('should exists "value" field', () => {
                assert.isTrue(tableContainsField(tableFields, 'value'));
            });
            it('should exists "expire_at" field', () => {
                assert.isTrue(tableContainsField(tableFields, 'expire_at'));
            });
            it('should exists timestamps', () => assert.isTrue(tableContainsTimestamps(tableFields)));
        });
        describe('Test the Telegram Users table', function () {
            let tableFields;
            before(async () => {
                tableFields = await mysql.query('DESCRIBE telegram_users;', null);
            });
            it('should exists "_id" field', () => {
                assert.isTrue(tableContainsField(tableFields, '_id'));
            });
            it('should exists "user_id" field', () => {
                assert.isTrue(tableContainsField(tableFields, 'user_id'));
            });
            it('should exists "chat_id" field', () => {
                assert.isTrue(tableContainsField(tableFields, 'chat_id'));
            });
            it('should exists "first_name" field', () => {
                assert.isTrue(tableContainsField(tableFields, 'first_name'));
            });
            it('should exists "last_name" field', () => {
                assert.isTrue(tableContainsField(tableFields, 'last_name'));
            });
            it('should exists "username" field', () => {
                assert.isTrue(tableContainsField(tableFields, 'username'));
            });
            it('should exists timestamps', () => assert.isTrue(tableContainsTimestamps(tableFields)));
        });
        describe('Test the Account Transactions table', function () {
            let tableFields;
            before(async () => {
                tableFields = await mysql.query('DESCRIBE account_transactions;', null);
            });
            it('should exists "_id" field', () => {
                assert.isTrue(tableContainsField(tableFields, '_id'));
            });
            it('should exists "contractor_id" field', () => {
                assert.isTrue(tableContainsField(tableFields, 'contractor_id'));
            });
            it('should exists "author_id" field', () => {
                assert.isTrue(tableContainsField(tableFields, 'author_id'));
            });
            it('should exists "sum" field', () => {
                assert.isTrue(tableContainsField(tableFields, 'sum'));
            });
            it('should exists "currency" field', () => {
                assert.isTrue(tableContainsField(tableFields, 'currency'));
            });
            it('should exists "type" field', () => {
                assert.isTrue(tableContainsField(tableFields, 'type'));
            });
            it('should exists timestamps', () => assert.isTrue(tableContainsTimestamps(tableFields)));
        });
    });
});

function tableContainsField(tableFields, fieldName) {
    return tableFields.some(iterationObject => {
        return iterationObject.Field === fieldName;
    });
}

function tableContainsTimestamps(tableFields) {
    return tableContainsField(tableFields, 'created_at') &&
        tableContainsField(tableFields, 'updated_at') &&
        tableContainsField(tableFields, 'deleted_at');
}