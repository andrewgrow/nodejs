'use strict';

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const mysql = require('../db/db_mysql');
const dateUtils = require('../utils/date_utilities')

/**
 * see @url(https://github.com/auth0/node-jsonwebtoken#readme)
 * and see @url(https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs)
 * @param request
 * @param response
 * @param next
 * @returns {*}
 */
async function authenticateToken(request, response, next) {
    if (isPageNoNeedAnyToken(request)) {
        return next();
    }

    // each page must have the Request token and the Auth Token
    // for the start we will check the Request token
    await isRequestTokenValid(request).catch((err) => { return response.status(400).send(err) });
    // if after awaiting it has returned status 400 we will return this response
    if (response.statusCode === 400) {
        return response;
    }

    // now we look if this page does not need in auth token
    if (isPageOnlyRequestToken(request)) { return next() }

    // and in the end we will check the Auth token
    await isAuthTokenValid(request)
        .catch((err) => {
            switch (err) {
                case '401': return response.status(401).send('Authorization Token does not exist.');
                case '403': return response.status(403).send('Authorization Token is not valid.');
                default: break;
            }
        })

    // if all ok go next
    if (response.statusCode >= 401) {
        return response;
    } else {
        return next();
    }
}

/**
 * Check if a page no need to pass any token.
 * @param request
 * @returns 'true' if page free from any token
 */
function isPageNoNeedAnyToken(request) {
    return request.url === '/'
        || request.url === '//'
}

/**
 * Check if a page need to pass request token only (without Authorization).
 * @param request
 * @returns 'true' if page uses request token only.
 */
function isPageOnlyRequestToken(request) {
    return request.url.includes('/randomToken');
}

function isRequestTokenValid(request) {
    return new Promise(async (resolve, reject) => {
        // try to find in headers
        const requestToken = request.headerString('request_token');
        if (requestToken === null || requestToken === undefined) {
            reject('Request Token does not exist.');
        }
        // try to find in database
        const dbTokensList = await mysql.query('SELECT * FROM `request_tokens` WHERE `token` = ? LIMIT 1;'
            , [requestToken])
        // try to check expire
        if (dbTokensList != null && dbTokensList.length > 0 && dbTokensList[0] != null) {
            const token = dbTokensList[0];
            if (token.expire_at) {
                if (dateUtils.isDateAfterNow(token.expire_at)) {
                    resolve(true);
                } else {
                    reject('Request Token is expired.');
                }
            } else {
                resolve(true);
            }
        } else {
            // database does not contain this token
            reject('Request Token not found.');
        }
    });
}

function isAuthTokenValid(request) {
    return new Promise(async (resolve, reject) => {
        const authHeaderToken = request.headerString('authorization');
        if (authHeaderToken == null || !authHeaderToken) {
            reject('401')
        }

        jwt.verify(authHeaderToken, JWT_SECRET, null,(error, tokenData) => {
            if (error) {
                reject('403');
            }
            request.userIdFromTokenData = tokenData;
            resolve(request);
        })
    })
}

function generateToken(data) {
    if (data === null) return null;
    return jwt.sign(data, JWT_SECRET);
}


module.exports = { authenticateToken, generateToken }