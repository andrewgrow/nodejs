'use strict';

function isEmpty(text) {
    return text === null || text === undefined || Number.isNaN(text) ||
        text.length === 0 || text.toString().trim().length === 0 ||
        typeof text !== 'string';
}

function isWrongInt(number) {
    let errorWhenParsed = false;
    try {
        Number.parseInt(number.toString());
    } catch (err) {
        errorWhenParsed = true;
    }
    return errorWhenParsed || isNaN(number) || number === null || number === undefined;
}

// The sleep function is pretty straightforward:
async function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

function replaceCommaToDot(text) {
    if (isEmpty(text)) {
        if (typeof text === 'number') {
            text = text.toString();
        } else {
            return NaN;
        }
    }

    if (text.includes(",")) {
        text = text.replace(",", ".");
    }

    if (isWrongInt(text)) {
        return NaN;
    }

    return text;
}

/**
 * Returns a random number between min (inclusive) and max (exclusive).
 * For example, in range [0 - 10001], result 2359.43363306518
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 * For example, in range [0 - 10001], result 2359
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = { isEmpty, isWrongInt, sleep, replaceCommaToDot, getRandomArbitrary, getRandomInt }