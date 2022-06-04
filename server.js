'use strict';

require('dotenv').config({ path: `${__dirname}/config/.env` });

const express = require('express');
const crypto = require('crypto');

const port = process.env.APP_PORT || 8090;
const host = process.env.APP_HOST || '0.0.0.0';
const protocol = process.env.APP_PROTOCOL || 'http';

const botApp = require('./telegram/botApp'); // make Telegram bot
const UserModel = require('./db/models/user');
const User = require('./db/models/user').User;

const app = express();
app.use(require('sanitize').middleware);
app.use(require('./middlewares/authorization'));

app.get('/user/:id', async (request, response) => {
    const id = request.paramInt('id');
    if (id && typeof id === 'number') {
        const userModel = await UserModel.findById(id);
        response.json(userModel);
    } else {
        response.status(400);
        response.json({ error: 'Bad Request' });
    }
});

app.post('user/create', async (request, response) => {
    const newUser = new User("+1234567890", "testName");
    const id = await UserModel.createUserRecord(newUser);
    console.log(`CREATE1 id = ${id}`);
    response.status(201).send(`Successful created with id = ${id}`);
});

app.get('/randomToken', async (req, res) => {
    const length = parseInt(req.queryInt('length')) || 64;
    const randomToken = crypto.randomBytes(length).toString('hex');
    res.status(201).send(`randomToken: ${ randomToken }`);
})

app.get('/', async (request, response) => {
    response.status(200).send('Node.js® test app');
});
app.listen(port, host);

// start polling Telegram bot
botApp();

console.log(`Server successful running on ${protocol}://${host}:${port}`);