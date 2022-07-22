'use strict';

const checkRequestToken = require('../../middlewares/check_request_token');
const tokenModel = require('../../db/models/requestToken');
const userMock = require('../factories/user_mock');
const dateUtils = require('../../utils/date_utils');
const { createRequest, createResponse, nextWithTrue, nextWithError } = require("../factories/http_mock");

describe('test ../middlewares/check_request_token.js', function () {
    describe('test function requestToken()', function () {
        it('should be call next if url is /', function () {
            const request = createRequest();
            const response = createResponse();
            return assert.eventually.equal(checkRequestToken.requestToken(request, response, nextWithTrue), true);
        });
        it('should be call next if url is double //', function () {
            const request = createRequest({ url: '//' });
            const response = createResponse();
            return assert.eventually.equal(checkRequestToken.requestToken(request, response, nextWithTrue), true);
        });
        it('should throw an error if the token is absent', async function () {
            const request = createRequest({ url: '/testPage' });
            const response = createResponse();
            const responseResult = await checkRequestToken.requestToken(request, response, nextWithError);
            assert.equal(responseResult.statusCode, 400);
            assert.equal(responseResult.message, 'Request Token does not exist.');
        });
        it('should return an error if the token exists but it\'s wrong', async function () {
            const request = createRequest({ url: '/testPage' });
            request.headers['request-token'] = 'token_does_not_exist';
            const response = createResponse();
            const responseResult = await checkRequestToken.requestToken(request, response, nextWithError);
            assert.equal(responseResult.statusCode, 400);
            assert.equal(responseResult.message, 'Request Token not found.');
        });
        it('should return true if the token exists', async function () {
            const request = createRequest({ url: '/testPage' });
            const userId = await userMock.createUserRecordWithTestData().then((result) => { return result.user_id })
            const requestTokenId = await tokenModel.createRecord(userId);
            const validRequestToken = await tokenModel.getById(requestTokenId);
            request.headers['request-token'] = `${ validRequestToken.value }`;
            const response = createResponse();
            return assert.eventually.equal(checkRequestToken.requestToken(request, response, nextWithTrue), true);
        });
        it('should return an error if the token expired', async function () {
            const request = createRequest({ url: '/testPage' });
            const response = createResponse();
            const userId = await userMock.createUserRecordWithTestData().then((result) => { return result.user_id })
            const requestTokenId = await tokenModel.createRecord(userId);
            const validRequestToken = await tokenModel.getById(requestTokenId);
            await tokenModel.setExpireData(1, requestTokenId);
            request.headers['request-token'] = `${ validRequestToken.value }`;
            const responseResult = await checkRequestToken.requestToken(request, response, nextWithTrue);
            assert.equal(responseResult.statusCode, 400);
            assert.equal(responseResult.message, 'Request Token is expired.');
        });
        it('should return true if the token has a date of expire but correct yet', async function () {
            const request = createRequest({ url: '/testPage' });
            const response = createResponse();
            const userId = await userMock.createUserRecordWithTestData().then((result) => { return result.user_id })
            const requestTokenId = await tokenModel.createRecord(userId);
            const validRequestToken = await tokenModel.getById(requestTokenId);
            await tokenModel.setExpireData(dateUtils.currentDateAsUnixTimestamp() + 1000, requestTokenId);
            request.headers['request-token'] = `${ validRequestToken.value }`;
            return assert.eventually.equal(checkRequestToken.requestToken(request, response, nextWithTrue), true);
        });
    });
});
