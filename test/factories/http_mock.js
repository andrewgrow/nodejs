'use strict';

function createResponse() {
    return {
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
}

function nextWithTrue() {
    return true;
}

function nextWithError() {
    throw new Error('This Mocked Object not allowed to call.')
}

module.exports = { createResponse, nextWithTrue, nextWithError }