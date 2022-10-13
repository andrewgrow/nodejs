'use strict';

const jwtUtils = require('../utils/jsonwebtoken_utils');

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

    // now we look if this page does not need in auth token
    if (isPageOnlyRequestToken(request)) { return next() }

    // and in the end we will check the Auth token
    await isAuthTokenValid(request)
        .catch((err) => {
            switch (err) {
                case '401': response.status(401).send('Authorization Token does not exist.'); break;
                case '403': response.status(403).send('Authorization Token is not valid.'); break;
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
    return request.url.includes('/token/generate');
}

function isAuthTokenValid(request) {
    return new Promise(async (resolve, reject) => {
        const authHeaderToken = request.headers['authorization'];
        if (authHeaderToken == null || !authHeaderToken) {
            return reject('401');
        }

        jwtUtils.verify(authHeaderToken)
            .then((tokenData) => {
                request.userIdFromTokenData = tokenData;
                resolve(request);
            })
            .catch(() => {
                reject('403');
            });
    })
}

module.exports = { authenticateToken };
export {};