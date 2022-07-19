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

function next() {
    return true;
}

module.exports = { createResponse, next }