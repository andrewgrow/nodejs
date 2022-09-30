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

function createRequest(req: any = { }) {
    if (req.url === undefined) { req.url = '/'; }
    if (req.headers === undefined) { req.headers = {'authorization' : ''}; }
    if (req.method === undefined) { req.method = 'GET'; }
    return req;
}

module.exports = { createRequest, createResponse, nextWithTrue, nextWithError }