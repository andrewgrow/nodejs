'use strict';

const mysql = require('../db_mysql');

const types = {
    refill: `refill`,
    deposit: `deposit`
}

async function addRefill(contractorUserId, authorUserId, sum) {
    if (sum < 0) { sum = sum * -1; } // have to be a positive number, but later will rotate to negative
    const amount = sum * -100; // minus because it is a refill, that subtract this amount from account. Multiply will transform from 123.45 to 12345 UAH.
    const values = { contractorUserId: contractorUserId, authorUserId: authorUserId, amount: amount, type: types.refill }
    return await createRecord(values);
}

async function addDeposit(contractorUserId, authorUserId, sum) {
    if (sum < 0) { sum = sum * -1; } // have to be a positive number
    const amount = sum * 100; // that subtract this amount from account. Multiply will transform from 123.45 to 12345 UAH.
    const values = { contractorUserId: contractorUserId, authorUserId: authorUserId, amount: amount, type: types.deposit }
    return await createRecord(values);
}

async function createRecord(values: any = {
    contractorUserId: null, authorUserId: null, amount: 0, currency: 'UAH' ,type: null }) {
    const request = "INSERT INTO " +
        "`account_transactions` (`contractor_id`, `author_id`, `sum`, `currency`, `type`) " +
        "VALUES (?, ?, ?, ?, ?);";
    const valuesList = [ values.contractorUserId, values.authorUserId, values.amount, 'UAH', values.type ];
    const result = await mysql.query(request, valuesList);
    if (result) {
        return result.insertId;
    }
    return null;
}

module.exports = { addRefill, addDeposit, types };
export {};
