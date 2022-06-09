'use strict';

const name = process.env.DB_NAME;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;

const tables = {
    USERS_TABLE: 'users',
    TELEGRAM_USERS_TABLE: 'telegram_users',
    ACCOUNT_TRANSACTIONS_TABLE: 'account_transactions'
}

module.exports = { name, user, password, host, port, tables };