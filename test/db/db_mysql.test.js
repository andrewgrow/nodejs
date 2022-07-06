'use strict';

require("chai").use(require('chai-as-promised'));
const assert = require("chai").assert;
const mysql = require('../../db/db_mysql');

const dbMigrate = require('../../scripts/dbmigrate');

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
});

