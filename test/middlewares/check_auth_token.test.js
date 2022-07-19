'use strict';

const checkAuthToken = require('../../middlewares/check_auth_token');
const { createResponse, next } = require("../factories/http_mock");

describe('test ../middlewares/check_auth_token.js', function () {
    describe('test function authenticateToken()', function () {
        const response = createResponse();

        it('should call next function when request.url is /', function () {
            const  request = { url: "/" }
            return assert.eventually.equal(checkAuthToken.authenticateToken(request, response, next), true);
        });
        it('should reject when request.url is /test', async function () {
            const  request = { url: "/test", headers: { "header" : "" } }
            const resultResponse = await checkAuthToken.authenticateToken(request, response, next);
            assert.equal(resultResponse.statusCode, 401);
            assert.equal(resultResponse.message, 'Authorization Token does not exist.');
        });
    });
});