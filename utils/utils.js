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

module.exports = { isEmpty, isWrongInt, sleep, replaceCommaToDot }