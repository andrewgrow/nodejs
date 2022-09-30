'use strict';

import { assert } from "chai";

const mysql = require('../../src/db/db_mysql');

describe('test ../scripts/dbmigrate.ts', function () {
    describe('Test all tables migrations', function () {
        const tables = [
            {
                name: 'Migrations',
                sqlTableName: 'migrations',
                fields: ['_id', 'filename', 'created_at']
            },
            {
                name: 'Users',
                sqlTableName: 'users',
                fields: ['_id', 'phone', 'name', 'timestamps']
            },
            {
                name: "Request Tokens",
                sqlTableName: "request_tokens",
                fields: ['_id', 'user_id', 'value', 'expire_at', 'timestamps']
            },
            {
                name: "Telegram Users",
                sqlTableName: "telegram_users",
                fields: ['_id', 'user_id', 'chat_id', 'first_name', 'last_name', 'username', 'timestamps']
            },
            {
                name: 'Account Transactions',
                sqlTableName: 'account_transactions',
                fields: ['_id', 'contractor_id', 'author_id', 'sum', 'currency', 'type', 'timestamps']
            }
        ];
        tables.forEach(table => testTable(table));
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

function testTable(table) {
    describe(`Test the ${table.name} table`, function () {
        let tableFields;
        before(async () => {
            tableFields = await mysql.query(`DESCRIBE ${table.sqlTableName};`, null);
        });
        table.fields.forEach(field => {
            if (field === 'timestamps') {
                it('should exists timestamps', () => assert.isTrue(tableContainsTimestamps(tableFields)));
            } else {
                it(`should exists "${field}" field`, () => {
                    assert.isTrue(tableContainsField(tableFields, field));
                });
            }
        });
    });
}