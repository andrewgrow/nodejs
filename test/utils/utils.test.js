'use strict';

const utils = require('../../utils/utils');

describe('test ./utils/utils.js', function () {
    describe('isEmpty() check if the text does not contain any data', function () {
        it('return true if text is null', function () {
            assert.isTrue(utils.isEmpty(null));
        });
        it('return true if text is NaN', function () {
            assert.isTrue(utils.isEmpty(NaN));
        });
        it('return true if text is undefined', function () {
            assert.isTrue(utils.isEmpty(undefined));
        });
        it('return true if text is only spaces', function () {
            assert.isTrue(utils.isEmpty('   '));
        });
        it('return true if text is empty', function () {
            assert.isTrue(utils.isEmpty(''));
        });
        it('return true if text is number', function () {
            assert.isTrue(utils.isEmpty(123.45));
        });
        it('return true if text is an object', function () {
            assert.isTrue(utils.isEmpty({ "test": "text" } ));
        });
        it('return false if text exists', function () {
            assert.isFalse(utils.isEmpty('123,45'));
        });
    });

    describe('isWrongInt() check if an argument is a correct number', function () {
        it('return true if the argument is NaN', function () {
            assert.isTrue(utils.isWrongInt(NaN));
        });
        it('return true if the argument is undefined', function () {
            assert.isTrue(utils.isWrongInt(undefined));
        });
        it('return true if the argument is null', function () {
            assert.isTrue(utils.isWrongInt(null));
        });
        it('return true if the argument is a text', function () {
            assert.isTrue(utils.isWrongInt("some text"));
        });
        it('return true if the argument is an object', function () {
            assert.isTrue(utils.isWrongInt( { number: 123 } ));
        });
        it('return false if the argument is a text with correct number', function () {
            assert.isFalse(utils.isWrongInt("123"));
        });
        it('return false if the argument is a number', function () {
            assert.isFalse(utils.isWrongInt(123));
        });
        it('return false if the argument is a number with a floating point', function () {
            assert.isFalse(utils.isWrongInt(-132.00001));
        });
    });

    describe('sleep() will pause of processing using a delay through Promise', function () {
        it('should run after delay', function () {
            const delay = 200;
            const plannedEndTime = new Date().getTime() + delay;
            const returnCurrentTimeAfterDelay = new Promise(async (resolve, _) => {
                await utils.sleep(delay + 100);
                resolve(plannedEndTime <= new Date().getTime());
            })

            return assert.eventually.isTrue(returnCurrentTimeAfterDelay);
        });
    });

    describe('replaceCommaToDot() change text from "123,45" to "123.45" (set a dot instead a comma). ', function () {
        it('return NaN if an argument is null', function () {
            assert.isNaN(utils.replaceCommaToDot(null));
        });
        it('return NaN if an argument is undefined', function () {
            assert.isNaN(utils.replaceCommaToDot(undefined));
        });
        it('return NaN if an argument is NaN', function () {
            assert.isNaN(utils.replaceCommaToDot(NaN));
        });
        it('return NaN if an argument is a plain text', function () {
            assert.isNaN(utils.replaceCommaToDot("test"));
        });
        it('return NaN if an argument is wrong number', function () {
            assert.isNaN(utils.replaceCommaToDot("123test"));
        });
        it('return correct text number after change comma', function () {
            assert.equal(utils.replaceCommaToDot("123,45"), "123.45");
        });
        it('return the same text', function () {
            assert.equal(utils.replaceCommaToDot("123.45"), "123.45");
        });
        it('return the same number as a plain text', function () {
            assert.equal(utils.replaceCommaToDot(123.45), "123.45");
        });
    });

    describe('test function getRandomArbitrary()', function () {

    });

    describe('test functions getRandomInt() & getRandomArbitrary()', function () {
        const ranges = [[0, 1], [0, 10], [0, 100], [0, 1000], [0, 10000], [0, 100000], [0, 1000000],
            [0, 10000000], [0, 100000000], [0, 1000000000], [0, 10000000000], [0, 100000000000], [0, 1000000000000]];
        it('should be in range when call getRandomInt()', function () {
            let minValue, maxValue, result;
            for (let range of ranges) {
                minValue = range[0];
                maxValue = range[1];
                result = utils.getRandomInt(range[0], range[1]);
                assert.isAtLeast(result, minValue);
                assert.isAtMost(result, maxValue);
            }
        });
        it('should be in range when call getRandomArbitrary()', function () {
            let minValue, maxValue, result;
            for (let range of ranges) {
                minValue = range[0];
                maxValue = range[1] + 1;
                result = utils.getRandomArbitrary(range[0], range[1]);
                assert.isAtLeast(result, minValue);
                assert.isAtMost(result, maxValue);
            }
        });
    });
});