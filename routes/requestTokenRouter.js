'use strict';

const express = require('express');
const tokenModel = require("../db/models/requestToken");
const jwtUtils = require("../utils/jsonwebtoken_utils");
const router = express.Router();

router.use(express.json());

router.delete('/:value', async (request, response) => {
    const value = request.paramString('value');
    const affectedRows= await tokenModel.forceDeleteToken(value);
    if (affectedRows > 0) {
        response.setHeader('system-message', 'Token deleted successfully.');
        response.status(204).send('Token deleted successfully.');
    } else {
        response.status(404).send('Token is not found.');
    }
});

router.get('/generate', async (request, response) => {
    // const length = parseInt(request.queryInt('length')) || 64;
    const userId = parseInt(request.query['id']) || null;
    const randomToken = await tokenModel.createRecord(userId)
        .then((tokenId) => {
            return tokenModel.getById(tokenId)
                .then((token) => {
                    return token.value;
                });
        });
    const userToken = jwtUtils.generateToken(userId) || null;
    const result = {
        "randomToken": randomToken,
        "userToken": userToken
    }
    response.status(201).send(result);
})

module.exports = router;