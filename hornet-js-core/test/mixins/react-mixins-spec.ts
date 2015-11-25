/// <reference path='../../../hornet-js-ts-typings/definition.d.ts'/>
"use strict";

import TestUtils = require('hornet-js-utils/src/test-utils');
var expect = TestUtils.chai.expect;
var sinon:SinonStatic = TestUtils.sinon;
var logger = TestUtils.getLogger("hornet-js-core.test.mixins.react-mixins-spec");
var ReactMixins = require('src/mixins/react-mixins');

describe('react-mixins-spec', () => {

    describe('throttleMixin', () => {
        var thisObj;
        beforeEach(function () {
            thisObj = {};
            thisObj.props = ReactMixins.mixins[5].getDefaultProps();
        });

        it('should fire delayed function with one call', () => {
            // Arrange
            var compteur = 0;
            var randomArg = TestUtils.randomString();
            var fn = function (arg) {
                // Assert
                expect(arg).to.equals(randomArg);
                compteur++;
            };

            // Act
            var throttleFn = ReactMixins.mixins[5].throttle.call(thisObj, fn);
            throttleFn(randomArg);
            // Assert
            expect(compteur).to.equals(1);
        });

        it('should deactivate throttle if throttleDelay=0', () => {
            // Arrange
            var fn = sinon.spy();

            // Act
            thisObj.props.throttleDelay = 0;
            var throttleFn = ReactMixins.mixins[5].throttle.call(thisObj, fn);
            // Assert
            expect(throttleFn).to.equals(fn);
        });


        it('should call cancel on componentWillUnmount', () => {
            // Arrange
            var fn = sinon.spy();
            var throttledFn1 = ReactMixins.mixins[5].throttle.call(thisObj, fn);
            throttledFn1.cancel = sinon.spy(throttledFn1.cancel);

            var throttledFn2 = ReactMixins.mixins[5].throttle.call(thisObj, fn);
            throttledFn2.cancel = sinon.spy(throttledFn2.cancel);

            // Act
            ReactMixins.mixins[5].componentWillUnmount.call(thisObj);

            // Assert
            expect(fn).to.not.be.called;
            expect(throttledFn1.cancel).to.be.calledOnce;
            expect(throttledFn2.cancel).to.be.calledOnce;
        });

        it('should not crash if no throttledFn', () => {
            // Act
            ReactMixins.mixins[5].componentWillUnmount.call(thisObj);
        });
    });

});
