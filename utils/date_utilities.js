'use strict';

/**
 * @returns {number} Current date in seconds as unix timestamp.
 * Note: mysql stores timestamps the same as this.
 */
function currentDateAsUnixTimestamp() {
    return Math.floor(Date.now() / 1000);
}

function isDateBeforeNow(dateAsUnixTimestamp) {
    if (dateAsUnixTimestamp) {
        return dateAsUnixTimestamp < currentDateAsUnixTimestamp();
    } else {
        throw new Error("DateAsUnixTimestamp is null or undefined or NaN");
    }
}

function isDateAfterNow(dateAsUnixTimestamp) {
    if (dateAsUnixTimestamp) {
        return dateAsUnixTimestamp > currentDateAsUnixTimestamp();
    } else {
        throw new Error("DateAsUnixTimestamp is null or undefined or NaN");
    }
}

module.exports = { currentDateAsUnixTimestamp, isDateBeforeNow, isDateAfterNow }