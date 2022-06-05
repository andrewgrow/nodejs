'use strict';

const dateUtils = require('../utils/date_utils');
const requestTokenDao = require('../db/models/requestToken');

async function requestToken(request, response, next) {
    if (isPageNoNeedAnyToken(request)) {
        return next();
    }

    // each page must have the Request token and the Auth Token
    // for the start we will check the Request token
    await isRequestTokenValid(request).catch((err) => { return response.status(400).send(err) });
    // if after awaiting it has returned status 400 we will return this response
    if (response.statusCode === 400) {
        return response;
    } else {
        return next();
    }
}

function isRequestTokenValid(request) {
    return new Promise(async (resolve, reject) => {
        // try to find in headers
        const headerRequestToken = request.headerString('request_token');
        if (headerRequestToken === null || headerRequestToken === undefined) {
            reject('Request Token does not exist.');
        }
        // try to find in database
        const token = await requestTokenDao.findByValue(headerRequestToken);
        if (token === null || token === undefined) {
            // database does not contain this token
            return reject('Request Token not found.');
        }
        // try to check expire
        if (token.expire_at != null) {
            if (dateUtils.isDateAfterNow(token.expire_at)) {
                resolve(true);
            } else {
                reject('Request Token is expired.');
            }
        } else {
            resolve(true);
        }
    });
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

module.exports = { requestToken }