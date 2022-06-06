'use strict';

const express = require('express');
const tokenModel = require("../db/models/requestToken");
const crypto = require("crypto");
const jwtUtils = require("../utils/jsonwebtoken_utils");
const router = express.Router();

router.use(express.json());

router.delete('/', async (request, response) => {
    const value = request.paramString('value');
    const result = await tokenModel.forceDeleteToken(value);
    if (result != null) {
        response.status(204).send('Token deleted successfully.');
    } else {
        response.status(400).send('Bad. request. Token does not deleted.');
    }
});

router.get('/generate', async (request, response) => {
    const length = parseInt(request.queryInt('length')) || 64;
    const userId = parseInt(request.queryInt('id')) || null;
    const randomToken = crypto.randomBytes(length).toString('hex');
    const userToken = jwtUtils.generateToken(userId) || null;
    const result = {
        "randomToken": randomToken,
        "userToken": userToken
    }
    response.status(201).send(result);
})

module.exports = router;