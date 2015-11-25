///<reference path='../../../hornet-js-ts-typings/definition.d.ts'/>
"use strict";

import TestUtils = require('hornet-js-utils/src/test-utils');
var expect = TestUtils.chai.expect;
var sinon = TestUtils.sinon;

import HornetCache = require('src/cache/hornet-cache');
var logger = TestUtils.getLogger("hornet-js-core.test.cache.hornet-cache-spec");

describe('Hornet Cache', () => {
    it('should get only one instance', () => {
        expect(HornetCache.getInstance()).to.be.equal(HornetCache.getInstance());
    });

    it('should not allow multi instance', () => {
        // Arrange
        HornetCache.getInstance();

        // Act
        expect(() => {
            new HornetCache();
        }).to.throw(Error);

    });

    it('should get the data from cache', function (testDone) {
        // Arrange
        var data:string = TestUtils.randomString();
        var key:string = TestUtils.randomString();
        var cache = HornetCache.getInstance();

        // Act
        cache.miseEnCacheAsynchrone(key, data).then(() => {
            cache.getItem(key).then(function (result) {
                // Assert
                expect(result).to.be.equal(data);
                testDone();
            }).catch(testDone);
        });

    });

    it('should NOT get the data from cache because of EXPECTED TIME', function (testDone) {
        //Test asynchrone
        var data:string = TestUtils.randomString();
        var key:string = TestUtils.randomString();
        var timeInCache:number = 2; //2 secondes

        var clock = sinon.useFakeTimers();

        var cache:HornetCache = HornetCache.getInstance();
        cache.miseEnCacheAsynchrone(key, data, timeInCache).then(() => {
            clock.tick(6000);
            cache.getItem(key)
                .catch(function (error) {
                    expect(error).to.be.equal('Cache is missing');
                    clock.restore();
                    testDone();
                });
        });
    });
});

