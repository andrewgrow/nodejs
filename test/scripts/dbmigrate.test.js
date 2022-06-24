'use strict';

const chai = require("chai");
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const assert = require('chai').assert;

const mysql = require('../../db/db_mysql');

describe.only('test ../scripts/dbmigrate.js', function () {
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

    describe('', function () {
        it('', function () {
            console.log('run test dbmigrate! block 1');

        });

        it('', function () {
            console.log('run test dbmigrate! block 2');
        });
    });
});