'use strict';

const checkAuthToken = require('../../middlewares/check_auth_token');
const jwtUtils = require('../../utils/jsonwebtoken_utils');
const { createResponse, nextWithTrue, nextWithError } = require("../factories/http_mock");

describe('test ../middlewares/check_auth_token.js', function () {
    describe('test function authenticateToken()', function () {
        it('should call next function when request.url is /', function () {
            const  request = { url: "/" };
            const response = createResponse();
            return assert.eventually.equal(checkAuthToken.authenticateToken(request, response, nextWithTrue), true);
        });
        it('should call next function when request.url is double //', function () {
            const  request = { url: "//" };
            const response = createResponse();
            return assert.eventually.equal(checkAuthToken.authenticateToken(request, response, nextWithTrue), true);
        });
        it('should call next function when request.url is token generate/', function () {
            const  request = { url: "/token/generate?user=1", headers: { "authorization" : "not_existing_token" } };
            const response = createResponse();
            return assert.eventually.equal(checkAuthToken.authenticateToken(request, response, nextWithTrue), true);
        });
        it('should return error 401 when request.url is /test', async function () {
            const  request = { url: "/test", headers: { "header" : "" } };
            const response = createResponse();
            const resultResponse = await checkAuthToken.authenticateToken(request, response, nextWithError);
            assert.equal(resultResponse.statusCode, 401);
            assert.equal(resultResponse.message, 'Authorization Token does not exist.');
        });
        it('should return error 403 when auth token is not valid', async function () {
            const response = createResponse();
            const  request = { url: "/user/1", headers: { "authorization" : "not_existing_token" } };
            const resultResponse = await checkAuthToken.authenticateToken(request, response, nextWithError);
            assert.equal(resultResponse.statusCode, 403);
            assert.equal(resultResponse.message, 'Authorization Token is not valid.');
        });
        it('should call next() when authToken is valid', function () {
            const response = createResponse();
            const validToken = jwtUtils.generateToken('1');
            const  request = { url: "/user/1", headers: { "authorization" : `${validToken}` } }
            return assert.eventually.equal(checkAuthToken.authenticateToken(request, response, nextWithTrue), true);
        });
    });
});