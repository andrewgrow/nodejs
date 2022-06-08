'use strict';

function isEmpty(text) {
    return text === null || text === undefined || text.length === 0 || text.trim().length === 0;
}

function isWrongInt(number) {
    let errorWhenParsed = false;
    try {
        Number.parseInt(number.toString());
    } catch (err) {
        console.error(err);
        errorWhenParsed = true;
    }
    return errorWhenParsed || isNaN(number) || number === null || number === undefined;
}

// The sleep function is pretty straightforward:
async function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

function getNumberFromTextWithoutComma(text) {
    if (isEmpty(text)) {
        return NaN;
    }
    if (text.includes(",")) {
        text = text.replace(",", ".");
    }
    return text;
}

module.exports = { isEmpty, isWrongInt, sleep, getNumberFromTextWithoutComma }