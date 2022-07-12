'use strict';

const mysql = require('../../db/db_mysql');
const config = require('../../db/db_config');

describe('test ./db/db_config.js', function () {
    describe('test variables', function () {
        it('should exists dbName', function () {
            assert.isNotEmpty(config.name);
        });
        it('should exists dbUser', function () {
            assert.isNotEmpty(config.user);
        });
        it('should exists dbPassword', function () {
            assert.isNotEmpty(config.password);
        });
        it('should exists dbHost', function () {
            assert.isNotEmpty(config.host);
        });
        it('should exists dbPort', function () {
            assert.isNotEmpty(config.port);
        });
    });

    describe('test tables', function () {
        it('should be equal with the real table values', function () {
            return mysql.getTablesList().then((tables) => {
                for (let table of tables) {
                    const actual = table.TABLE_NAME;
                    const expected = `${table.TABLE_NAME}_table`.toUpperCase();
                    assert.equal(actual, config.tables[expected]);
                }
            })
        });
    });
});