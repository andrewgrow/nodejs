'use strict';

import { assert } from "chai";

const wrapper = require('../../oldnode/telegram/telegramBotWrapper');

describe('test ../telegram/telegramBotWrapper.ts', function () {
    describe('test functions startTelegramBot() & getBotInfo()', function () {
        it('should return a mocked bot', function () {
            return assert.eventually.equal(wrapper.startTelegramBot(), 'Initiated LocalStubBot!');
        });
        it('should return a message from the bot', function () {
            assert.equal(wrapper.getBotInfo(), 'Initiated LocalStubBot! Be aware with messaging, sending does not work!');
        });
    });
});

