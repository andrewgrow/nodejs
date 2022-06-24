'use strict';

const chai = require("chai");
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const assert = require('chai').assert;
let dbMigrate;


describe.only('test ../scripts/dbmigrate.js', function () {
    before('run init script', function () {
        console.log('start test dbmigrate!');
        dbMigrate = require('../../scripts/dbmigrate');

    });

    after('destroy test tables', function () {
        console.log('end test dbmigrate!');
    });

    it('', function () {
        console.log('run test dbmigrate! block 1');
    });

    it('', function () {
        console.log('run test dbmigrate! block 2');
    });
});