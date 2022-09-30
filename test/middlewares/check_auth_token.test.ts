'use strict';

import { assert } from "chai";

const checkAuthToken = require('../../src/middlewares/check_auth_token');
const jwtUtils = require('../../src/utils/jsonwebtoken_utils');
const { createRequest, createResponse, nextWithTrue, nextWithError } = require("../factories/http_mock");

describe('test ../middlewares/check_auth_token.ts', function () {
    describe('test function authenticateToken()', function () {
        it('should call next function when request.url is /', function () {
            const request = createRequest({ url: '/' });
            const response = createResponse();
            return assert.eventually.equal(checkAuthToken.authenticateToken(request, response, nextWithTrue), true);
        });
        it('should call next function when request.url is double //', function () {
            const request = createRequest({ url: '//' });
            const response = createResponse();
            return assert.eventually.equal(checkAuthToken.authenticateToken(request, response, nextWithTrue), true);
        });
        it('should call next function when request.url is token generate/', function () {
            const request = createRequest({ url: "/token/generate?user=1", headers: { "authorization" : "not_existing_token" } });
            const response = createResponse();
            return assert.eventually.equal(checkAuthToken.authenticateToken(request, response, nextWithTrue), true);
        });
        it('should return error 401 when request.url is /test', async function () {
            const request = createRequest({ url: "/test", headers: { "header" : "" } });
            const response = createResponse();
            const resultResponse = await checkAuthToken.authenticateToken(request, response, nextWithError);
            assert.equal(resultResponse.statusCode, 401);
            assert.equal(resultResponse.message, 'Authorization Token does not exist.');
        });
        it('should return error 403 when auth token is not valid', async function () {
            const request = createRequest({ url: "/user/1", headers: { "authorization" : "not_existing_token" } });
            const response = createResponse();
            const resultResponse = await checkAuthToken.authenticateToken(request, response, nextWithError);
            assert.equal(resultResponse.statusCode, 403);
            assert.equal(resultResponse.message, 'Authorization Token is not valid.');
        });
        it('should call next() when authToken is valid', function () {
            const validToken = jwtUtils.generateToken('1');
            const  request = createRequest({ url: "/user/1", headers: { "authorization" : `${ validToken }` }});
            const response = createResponse();
            return assert.eventually.equal(checkAuthToken.authenticateToken(request, response, nextWithTrue), true);
        });
    });
});