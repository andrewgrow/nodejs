'use strict';

function log(req, res, next) {
    console.log(`------------------------------------`);
    console.log(`${new Date()} Request: ${req.method} ${req.url}`)
    console.log(`${new Date()} Request headers: ${JSON.stringify(req.headers)}`)
    console.log(`${new Date()} Request body: ${JSON.stringify(req.body)}`)
    next();
}

module.exports = log;