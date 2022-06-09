'use strict';

const express = require('express');
const transactionModel = require("../db/models/tranzaction");
const utils = require('../utils/utils');
const router = express.Router();

router.use(express.json());

router.use((request, response, next) => {
    console.log(`------------------------------------------------------------------`)
    console.log(`Request: ${request.method} ${JSON.stringify(request.originalUrl)}`);
    console.log(`Headers: ${JSON.stringify(request.headers)}`);
    console.log(`Body: ${JSON.stringify(request.body)}`);
    next();
});

router.post('/', async (request, response) => {
    if (request.body === null || request.body === undefined) {
        return response.status(400).send('Bad request. Transaction cannot be created.');
    }

    const transaction = {
        type: request.bodyString('type'),
        amount: request.bodyString('amount'),
        contractorId: request.bodyString('contractorId'),
        authorId: request.userIdFromTokenData
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
        case 'refill': resultId = await transactionModel.addRefill(
            transaction.contractorId,
            transaction.authorId,
            transaction.amount
            ).catch((err) => {
            console.error(err);
        });
        break;
    }
    if (resultId === undefined || resultId <= 0) {
        return response.status(400).send('Bad request. Transaction has errors.');
    } else {
        response.status(201).send(`TRANSACTION was CREATED successful with id = ${ resultId }`);
    }
});

module.exports = router;