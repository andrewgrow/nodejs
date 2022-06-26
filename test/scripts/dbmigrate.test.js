'use strict';

const chai = require("chai");
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const assert = require('chai').assert;

const mysql = require('../../db/db_mysql');

describe('test ../scripts/dbmigrate.js', function () {
    before('run all migrations', async function () {
        console.log('start test dbmigrate!');
        const dbMigrate = require('../../scripts/dbmigrate');
        await dbMigrate.runMigration();
    });

    after('drop all test tables and close connection', async function () {
        const tables = await mysql.getTablesList();
        console.log(`tables of db! ${JSON.stringify(tables)}`);
        for (let table of tables) {
            console.log(`try drop table ${ table.TABLE_NAME }`);
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
            it('should exists "created_at" field', () => {
                assert.isTrue(tableContainsField(tableFields, 'created_at'));
            });
            it('should exists "updated_at" field', () => {
                assert.isTrue(tableContainsField(tableFields, 'updated_at'));
            });
            it('should exists "deleted_at" field', () => {
                assert.isTrue(tableContainsField(tableFields, 'deleted_at'));
            });
            it('should exists "phone" field', () => {
                assert.isTrue(tableContainsField(tableFields, 'phone'));
            });
            it('should exists "name" field', () => {
                assert.isTrue(tableContainsField(tableFields, 'name'));
            });
        })
    });
});

function tableContainsField(tableFields, fieldName) {
    return tableFields.some(iterationObject => {
        return iterationObject.Field === fieldName;
    });
}