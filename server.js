'use strict';

require('dotenv').config({ path: `${__dirname}/config/.env` });

const port = process.env.APP_PORT || 8090;
const host = process.env.APP_HOST || '0.0.0.0';
const protocol = process.env.APP_PROTOCOL || 'http';

const express = require('express');
const crypto = require('crypto');
const jwtUtils = require('./utils/jsonwebtoken_utils');
const telegramBot = require('./telegram/botApp');
const User = require('./db/models/user');
const requestTokenModel = require('./db/models/requestToken');
const {response} = require("express");

const app = express();
app.use(express.json())
app.use(require('sanitize').middleware);
app.use(require('./middlewares/check_auth_token').authenticateToken);
app.use(require('./middlewares/check_request_token').requestToken);

app.get('/user/:id', async (request, response) => {
    const id = request.paramInt('id');
    if (id && typeof id === 'number') {
        const user = await User.findById(id);
        response.json(user);
    } else {
        response.status(400);
        response.json({ error: 'Bad Request' });
    }
});

app.post('/user', async (request, response) => {
    if (request.body === null || request.body === undefined) {
        return response.status(400).send('Bad request. User cannot be created.');
    }
    const user = {
        phone: request.bodyString('phone'),
        name: request.bodyString('name')
    };
    if (user.phone === null || user.phone === undefined || user.name === null || user.name === undefined) {
      return response.status(400).send('Bad request. User cannot be created.');
    }
    const id = await User.createRecordIfNotExists(user);
    if ( id === null) {
        return response.status(200).send('User with this phone already exists.');
    }
    response.status(201).send(`USER was CREATED successful with id = ${ id }`);
});

app.delete('/user/:id', async (req, res) => {
    const id = req.paramInt('id');
    if (id === null || id === undefined || id < 1) {
        return res.status(304).send('User with this id does not exist.');
    }
    const result = await User.forceDeleteUser(id);
    if (result == null) {
        res.status(204).send('User with this id does not exist.');
    } else {
        res.status(200).send('User was deleted successfully.');
    }
});

app.delete('/token', async (req, res) => {
   const value = req.paramString('value');
   const result = await requestTokenModel.forceDeleteToken(value);
   if (result != null) {
       response.status(204).send('Token deleted successfully.');
   } else {
       response.status(400).send('Bad. request. Token does not deleted.');
   }
});

app.get('/randomToken', async (req, res) => {
    const length = parseInt(req.queryInt('length')) || 64;
    const userId = parseInt(req.queryInt('id')) || null;
    const randomToken = crypto.randomBytes(length).toString('hex');
    const userToken = jwtUtils.generateToken(userId) || null;
    const result = {
        "randomToken": randomToken,
        "userToken": userToken
    }
    res.status(201).send(result);
})

app.get('/', async (request, response) => {
    response.status(200).send('Node.js® test app');
});
app.listen(port, host);

telegramBot(); // start polling Telegram bot

console.log(`Server successful running on ${protocol}://${host}:${port}`);