'use strict';

const assert = require('chai').assert;
const jsonWebTokenUtils = require('../../utils/jsonwebtoken_utils');

// this token was generated from JWT with environment key:value JWT_SECRET='JWTSecretOrPrivateKey' for data 'someData';
const tokenManual = 'eyJhbGciOiJIUzI1NiJ9.c29tZURhdGE.0kEBShXBB18pRntEx-Jb4w01aXSHcRJ6o-63nNcsTk0';
const tokenNaN = 'eyJhbGciOiJIUzI1NiJ9.TmFO.hV50Ll28DJDi7qBj_v6InWWuvpu6EKBJ8FUUg7tznzo'; // the same for NaN
const tokenNumber = 'eyJhbGciOiJIUzI1NiJ9.LTEyMzQ1.J--4-C-SvrUM63AA7YKNwT4Spfft8Csy0kCxAkPrMcE'; // the same for number -12345

describe('test ./utils/jsonwebtoken_utils.js ', function () {
    it('generateToken() should return new token', function () {
        assert.equal(jsonWebTokenUtils.generateToken("someData"), tokenManual, 'TOKENS equal if data correct');
        assert.equal(jsonWebTokenUtils.generateToken(-12345), tokenNumber, 'TOKENS equal if data correct');
        assert.equal(jsonWebTokenUtils.generateToken(NaN), tokenNaN, 'TOKENS equal even if data NaN');
        assert.isNull(jsonWebTokenUtils.generateToken(null), 'return NULL if wrong data');
        assert.isNull(jsonWebTokenUtils.generateToken(undefined), 'return NULL if wrong data');
    });
});
