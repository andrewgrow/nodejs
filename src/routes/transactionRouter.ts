'use strict';

const express = require('express');
const transactionModel = require("../db/models/transaction");
const utils = require('../utils/utils');
const tgUtils = require('../telegram/telegramUtils');
const router = express.Router();

router.use(express.json());

router.post('/', async (request, response) => {
    if (request.body === null || request.body === undefined) {
        return response.status(400).send('Bad request. Transaction cannot be created.');
    }

    const transaction = {
        type: request.body['type'],
        amount: request.body['amount'],
        contractorId: request.body['contractorId'],
        authorId: request.userIdFromTokenData,
    };
    if (utils.isEmpty(transaction.type)) {
        return response.status(400).send('Bad request. Transaction must have type.');
    }
    if (utils.isEmpty(transaction.amount)) {
        return response.status(400).send('Bad request. Transaction must have amount.');
    }
    if (utils.isEmpty(transaction.contractorId)) {
        return response.status(400).send('Bad request. Transaction must have contractorId.');
    }
    if (utils.isEmpty(transaction.authorId)) {
        return response.status(400).send('Bad request. Transaction must have authorId.');
    }

    let resultId = 0;
    switch (transaction.type) {
        case 'refill': resultId = await transactionModel.addRefill(transaction.contractorId, transaction.authorId,
            transaction.amount
            ).catch((err) => {
            console.error(err);
        });
        break;

        case 'deposit': resultId = await transactionModel.addDeposit(transaction.contractorId, transaction.authorId,
            transaction.amount
        ).catch((err) => {
            console.error(err);
        });
        break;
    }



    if (resultId === undefined || resultId <= 0) {
        return response.status(400).send('Bad request. Transaction has errors. Check contractorId and other fields.');
    } else {
        switch (transaction.type) {
            case 'refill': await tgUtils.sendMessageSuccessRefill(resultId, transaction.amount, transaction.contractorId); break;
            case 'deposit': await tgUtils.sendMessageSuccessDeposit(resultId, transaction.amount, transaction.contractorId); break;
        }
        return response.status(201).send(`TRANSACTION was CREATED successful with id = ${ resultId }`);
    }
});

module.exports = router;

export {};