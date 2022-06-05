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
const UserDAO = require('./db/models/user').UserDAO;

const app = express();
app.use(require('sanitize').middleware);
app.use(require('./middlewares/check_auth_token').authenticateToken);
app.use(require('./middlewares/check_request_token').requestToken);

app.get('/user/:id', async (request, response) => {
    const id = request.paramInt('id');
    if (id && typeof id === 'number') {
        const userDao = await User.findById(id);
        response.json(userDao);
    } else {
        response.status(400);
        response.json({ error: 'Bad Request' });
    }
});

app.post('user/create', async (request, response) => {
    const newUser = new UserDAO("+1234567890", "testName");
    const id = await User.createRecord(newUser);
    response.status(201).send(`USER was CREATED successful with id = ${ id }`);
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