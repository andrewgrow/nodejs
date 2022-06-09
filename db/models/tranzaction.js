'use strict';

const mysql = require('../../db/db_mysql');

async function addRefill(contractorUserId, authorUserId, sum) {
    const request = "INSERT INTO " +
        "`account_transactions` (`contractor_id`, `author_id`, `sum`, `currency`) " +
        "VALUES (?, ?, ?, ?);";
    const amount = sum * -100; // minus because it is a refill, that subtract this amount from account. Multiply will transform from 123.45 to 12345 UAH.
    const values = [ contractorUserId, authorUserId, amount, 'UAH' ];
    const result = await mysql.query(request, values);
    if (result) {
        return result.insertId;
    }
    return null;
}

module.exports = { addRefill }