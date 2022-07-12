'use strict';

const express = require('express');
const userModel = require("../db/models/user");
const router = express.Router();

router.use(express.json());

router.use((request, response, next) => {
    console.log(`------------------------------------------------------------------`)
    console.log(`Request: ${request.method} ${JSON.stringify(request.originalUrl)}`);
    console.log(`Headers: ${JSON.stringify(request.headers)}`);
    console.log(`Body: ${JSON.stringify(request.body)}`);
    next();
});

router.get('/:id', async (request, response) => {
    const id = request.paramInt('id');
    if (id === null || id === undefined || isNaN(id)) {
        return response.status(400).send('Bad Request');
    }

    const user = await userModel.findUserById(id);
    if (user) {
        response.status(200).json(user);
    } else {
        response.status(404).send('User not found');
    }
});

router.post('/', async (request, response) => {
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
    const userCreatingResult = await userModel.createRecordIfPhoneNotExist(user);
    if (userCreatingResult.isNewUser) {
        response.status(201).send(`USER was CREATED successful with id = ${ userCreatingResult.user_id }`);
    } else {
        return response.status(200).send('User with this phone already exists.');
    }
});

router.delete('/:id', async (request, response) => {
    const id = request.paramInt('id');
    if (id === null || id === undefined || isNaN(id) || id < 1) {
        return response.status(304).send('User with this id does not exist.');
    }
    const result = await userModel.forceDeleteUser(id);
    if (result == null) {
        response.status(204).send('User with this id does not exist.');
    } else {
        response.status(200).send('User was deleted successfully.');
    }
});

router.get('/', (request, response, next) => {
    response.status(404).send('User not found');
});

module.exports = router;

