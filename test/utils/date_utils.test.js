'use strict';

const dateUtils = require('../../utils/date_utils');

describe("test ./utils/date_utils.js", function () {
    // maybe it looks like folly but if method will change we can get notify about it
    it('currentDateAsUnixTimestamp() should return data as unix timestamp', function () {
        const expectedTimestamp = Math.floor(Date.now() / 1000); // manual counting to UNIX timestamp
        assert.equal(dateUtils.currentDateAsUnixTimestamp(), expectedTimestamp, 'currentDate in Unix format');
    });

    const dateNowAsUnixTimestamp = Math.floor(Date.now() / 1000);
    const beforeDate = dateNowAsUnixTimestamp - 60; // 1 minute before
    const afterDate = dateNowAsUnixTimestamp + 60; // 1 minute after
    describe('isDateBeforeNow() should return true/false when some date is validating', function () {
        it('return true if date is early then now', function () {
            assert.isTrue(dateUtils.isDateBeforeNow(beforeDate), 'beforeDate have to be early then now');
        });
        it('return false if date is later then now', function () {
            assert.isFalse(dateUtils.isDateBeforeNow(afterDate), 'afterDate have to be later then now');
        });
        it('return NaN if date is not a valid number', function () {
            assert.isNotNumber(dateUtils.isDateBeforeNow('text'), 'throwing error if parse false');
        });
        it('return error if date is null', function () {
            assert.throws(() => { dateUtils.isDateBeforeNow(null); }, Error, 'DateAsUnixTimestamp is null or undefined or NaN');
        });
        it('return error if date is NaN', function () {
            assert.throws(() => { dateUtils.isDateBeforeNow(NaN); }, Error, 'DateAsUnixTimestamp is null or undefined or NaN');
        });
        it('return error if date is undefined', function () {
            assert.throws(() => { dateUtils.isDateBeforeNow(undefined); }, Error, 'DateAsUnixTimestamp is null or undefined or NaN');
        });
    });

    describe('isDateAfterNow() should return true/false when some date is validating', function () {
        it('return false if date early then now', function () {
            assert.isFalse(dateUtils.isDateAfterNow(beforeDate), 'beforeDate have to be later then now');
        });
        it('return true if date later then now', function () {
            assert.isTrue(dateUtils.isDateAfterNow(afterDate), 'afterDate have to be early then now')
        });
        it('return true if date in not a valid number', function () {
            assert.isNotNumber(dateUtils.isDateAfterNow('text'), 'throwing error if parse false');
        });
        it('throw error if date is null', function () {
            assert.throws(() => { dateUtils.isDateAfterNow(null); }, Error, 'DateAsUnixTimestamp is null or undefined or NaN');
        });
        it('throw error if date is NaN', function () {
            assert.throws(() => { dateUtils.isDateAfterNow(NaN); }, Error, 'DateAsUnixTimestamp is null or undefined or NaN');
        });
        it('throw error if date is undefined', function () {
            assert.throws(() => { dateUtils.isDateAfterNow(undefined); }, Error, 'DateAsUnixTimestamp is null or undefined or NaN');
        });
    });
});
