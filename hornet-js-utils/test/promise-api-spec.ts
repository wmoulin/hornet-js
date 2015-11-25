/// <reference path="../../hornet-js-ts-typings/definition.d.ts" />
"use strict";

import chai = require('chai');
var expect = chai.expect;
import TestUtils = require('src/test-utils');
var logger = TestUtils.getLogger("hornet-js-utils.test.promise-api-spec");
import promise = require('src/promise-api');

describe('PromiseApi', () => {

    it('should prepare promise', () => {
        return promise.prepare(function (resolve) {
            resolve();
        })();
    });

    it('should handle failt', function (doneFn) {
        var errorMsg = 'Error !';
        promise.resolve(true).then(() => {
            return new promise(function (resolve, reject) {
                //On simule un rejet
                reject(errorMsg);
            })
        }).fail(function (msg) {
            expect(msg).to.be.equals(errorMsg);
            doneFn();
        });
    });

});
