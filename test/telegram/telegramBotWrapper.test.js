'use strict';

const wrapper = require('../../telegram/telegramBotWrapper');

describe('test ../telegram/telegramBotWrapper.js', function () {
    describe('test functions startTelegramBot() & getBotInfo()', function () {
        it('should return a mocked bot', function () {
            return assert.eventually.equal(wrapper.startTelegramBot(), 'Initiated LocalStubBot!');
        });
        it('should return a message from the bot', function () {
            assert.equal(wrapper.getBotInfo(), 'Initiated LocalStubBot! Be aware with messaging, sending does not work!');
        });
    });
});

