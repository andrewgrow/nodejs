'use strict';

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function generateToken(data) {
    if (data === null) return null;
    return jwt.sign(data, JWT_SECRET);
}

function verify(data) {
    return new Promise((resolve, reject) => {
        jwt.verify(data, JWT_SECRET, null,(error, tokenData) => {
            if (error) {
                reject(error);
            } else {
                resolve(tokenData);
            }
        })
    });
}

module.exports = { generateToken, verify }