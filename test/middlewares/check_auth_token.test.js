'use strict';

const checkAuthToken = require('../../middlewares/check_auth_token');

describe.only('test ../middlewares/check_auth_token.js', function () {
    const next = function () { return true };
    const response = {
        message: "", statusCode: "",
        status: function (code){
            this.statusCode = code;
            return this;
        },
        send: function (text) {
            this.message = text;
            return this;
        }
    }

    describe('test function authenticateToken()', function () {
        it('should call next function when request.url is /', function () {
            const  request = { url: "/" }
            return assert.eventually.equal(checkAuthToken.authenticateToken(request, response, next), true);
        });
        it('should reject when request.url is /test', function () {
            const  request = { url: "/test", headers: { "header" : "" } }
            return assert.eventually.equal(checkAuthToken.authenticateToken(request, response, next), true);
        });
    });
});