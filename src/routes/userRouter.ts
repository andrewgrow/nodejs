'use strict';

const userModel = require("../db/models/user");
const router = require('express').Router();

router.get('/:id', async (request, response) => {
    const id = request.params['id'];
    if (id === null || id === undefined || isNaN(id)) {
        return response.status(400).send('Bad Request');
    }

    let user = await userModel.findUserById(id).catch(e => { console.error(e); user = null;});
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
        phone: request.body['phone'],
        name: request.body['name']
    };
    if (user.phone === null || user.phone === undefined || user.name === null || user.name === undefined) {
        return response.status(400).send('Bad request. User cannot be created.');
    }
    let userCreatingResult = await userModel.createRecordIfPhoneNotExist(user).catch(e => { console.error(e); userCreatingResult = null;});
    if (userCreatingResult.isNewUser) {
        response.status(201).send(`USER was CREATED successful with id = ${ userCreatingResult.user_id }`);
    } else {
        return response.status(200).send('User with this phone already exists.');
    }
});

router.delete('/:id', async (request, response) => {
    const id = request.params['id'];
    if (id === null || id === undefined || isNaN(id) || id < 1) {
        return response.status(304).send('User with this id does not exist.');
    }
    let result = await userModel.forceDeleteUser(id).catch(e => { console.error(e); result = null;});
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
export {};

