'use strict';

const mysql = require('../db/db_mysql');
const dbMigrate = require('../scripts/dbmigrate');
require("chai").use(require('chai-as-promised'));
global.assert = require("chai").assert;

// global handlers
before('Before all tests', async function () {
    console.log('Before all tests');
    await dropAllTables();
    await runMigrations();
});

after('After all tests', async function () {
    console.log('After all tests');
    await closeConnection();
});

async function dropAllTables() {
    // drop all tables if exists
    console.log('Drop all tables if exists');
    try {
        const tables = await mysql.getTablesList();
        for (let table of tables) {
            await mysql.query(`DROP TABLE IF EXISTS ${table.TABLE_NAME};`, null);
        }
    } catch (err) {
        // already cleared
    }
}

async function runMigrations() {
    await mysql.query('USE divotest;');
    await dbMigrate.runMigration();
}

function closeConnection() {
    return mysql.end();
}