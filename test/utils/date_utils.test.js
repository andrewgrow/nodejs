'use strict';

const assert = require('chai').assert;
const dateUtils = require('../../utils/date_utils');

describe("test ./utils/date_utils.js", function () {
    // maybe it looks like folly but if method will change we can get notify about it
    it('currentDateAsUnixTimestamp should return data as unix timestamp', function () {
        const expectedTimestamp = Math.floor(Date.now() / 1000); // manual counting to UNIX timestamp
        assert.equal(dateUtils.currentDateAsUnixTimestamp(), expectedTimestamp, 'currentDate in Unix format');
    });

    it('isDateBeforeNow should return true/false when some date is validating', function () {
        const dateNowAsUnixTimestamp = Math.floor(Date.now() / 1000);
        const beforeDate = dateNowAsUnixTimestamp - 60; // 1 minute before
        const afterDate = dateNowAsUnixTimestamp + 60; // 1 minute after
        assert.isTrue(dateUtils.isDateBeforeNow(beforeDate), 'beforeDate have to be early then now')
        assert.isFalse(dateUtils.isDateBeforeNow(afterDate), 'afterDate have to be later then now')
        assert.isNotNumber(dateUtils.isDateBeforeNow('text'), 'throwing error if parse false');
        assert.throws(() => { dateUtils.isDateBeforeNow(null); }, Error, 'DateAsUnixTimestamp is null or undefined or NaN');
        assert.throws(() => { dateUtils.isDateBeforeNow(NaN); }, Error, 'DateAsUnixTimestamp is null or undefined or NaN');
        assert.throws(() => { dateUtils.isDateBeforeNow(undefined); }, Error, 'DateAsUnixTimestamp is null or undefined or NaN');
    });

    it('isDateAfterNow should return true/false when some date is validating', function () {
        const dateNowAsUnixTimestamp = Math.floor(Date.now() / 1000);
        const beforeDate = dateNowAsUnixTimestamp - 60; // 1 minute before
        const afterDate = dateNowAsUnixTimestamp + 60; // 1 minute after
        assert.isFalse(dateUtils.isDateAfterNow(beforeDate), 'beforeDate have to be later then now')
        assert.isTrue(dateUtils.isDateAfterNow(afterDate), 'afterDate have to be early then now')
        assert.isNotNumber(dateUtils.isDateAfterNow('text'), 'throwing error if parse false');
        assert.throws(() => { dateUtils.isDateAfterNow(null); }, Error, 'DateAsUnixTimestamp is null or undefined or NaN');
        assert.throws(() => { dateUtils.isDateAfterNow(NaN); }, Error, 'DateAsUnixTimestamp is null or undefined or NaN');
        assert.throws(() => { dateUtils.isDateAfterNow(undefined); }, Error, 'DateAsUnixTimestamp is null or undefined or NaN');
    });
});
