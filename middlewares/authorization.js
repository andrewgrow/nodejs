'use strict';

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * see @url(https://github.com/auth0/node-jsonwebtoken#readme)
 * and see @url(https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs)
 * @param request
 * @param response
 * @param next
 * @returns {*}
 */
function authenticateToken(request, response, next) {
    if (request.url === '/' || (request.url === '//') || (request.url ==='/randomToken')) {
        next();
        return;
    }

    const authHeaderToken = request.headerString('authorization');
    if (authHeaderToken == null || !authHeaderToken) {
        // return response.sendStatus(401)
        response.setHeader('middleware', true)
        return response.status(200).send('Node.js® test app');
    }
    jwt.verify(authHeaderToken, JWT_SECRET, null,(error, tokenData) => {
        console.log(`${error.name} ${error.message}`)
        if (error) {
            // return response.sendStatus(403);
            response.setHeader('middleware', true)
            return response.status(200).send('Node.js® test app');
        }
        request.tokenData = tokenData;
        next()
    })
}





module.exports = authenticateToken