"use strict";

import TestUtils = require("hornet-js-utils/src/test-utils");
var expect = TestUtils.chai.expect;
var sinon:SinonStatic = TestUtils.sinon;
var ReactMixins = require("src/mixins/react-mixins");

describe("react-mixins-spec", () => {

    describe("throttleMixin", () => {
        var thisObj;
        beforeEach(function () {
            thisObj = {};
            thisObj.props = ReactMixins.mixins[5].getDefaultProps();
        });

        it("should fire throttled function with one call", () => {
            /* On vérifie que l'appel à la fonction encapsulée grâce à throttle fonctionne.
            * Il serait difficile de tester de façon fiable des appels multiples de façon automatisée car il faudrait lancer les appels
            * dans un trhead séparé et mesurer le temps écoulé pour le comparer à throttleDelay */
            var compteur = 0;
            var randomArg = TestUtils.randomString();
            var fn = function (arg) {
                // Assert
                expect(arg).to.equals(randomArg);
                compteur++;
            };

            // Act
            var throttledFn = ReactMixins.mixins[5].throttle.call(thisObj, fn);
            throttledFn(randomArg);
            // Assert
            expect(compteur).to.equals(1);
        });

        it("should fire throttled function on each call when throttleDelay is zero", () => {
            thisObj.props.throttleDelay = 0;
            var compteur = 0;
            var randomArg = TestUtils.randomString();
            var fn = function (arg) {
                // Assert
                expect(arg).to.equals(randomArg);
                compteur++;
            };

            // Act
            var throttledFn = ReactMixins.mixins[5].throttle.call(thisObj, fn);
            throttledFn(randomArg);
            throttledFn(randomArg);
            throttledFn(randomArg);

            // Assert
            expect(compteur).to.equals(3);
        });

        it("should fire debounced function only once with multiple calls", () => {
            /* On vérifie que l'appel à la fonction encapsulée grâce à debounce fonctionne.
             * On affecte un temps très long à debounceDelay pour être sûr que les appels successifs soient réalisés
             * dans un temps inférieur et que ce test fonctionne de façon automatisée. */
            thisObj.props.debounceDelay = 100000;
            var compteur = 0;
            var randomArg = TestUtils.randomString();
            var fn = function (arg) {
                // Assert
                expect(arg).to.equals(randomArg);
                compteur++;
            };

            // Act
            var debouncedFn = ReactMixins.mixins[5].debounce.call(thisObj, fn);
            debouncedFn(randomArg);
            debouncedFn(randomArg);
            debouncedFn(randomArg);

            // Assert
            expect(compteur).to.equals(1);

            /* On doit annuler les appels en attente pour que le test s'arrête */
            debouncedFn.cancel();
        });

        it("should fire debounced function on each call when debounceDelay is zero", () => {
            thisObj.props.debounceDelay = 0;
            var compteur = 0;
            var randomArg = TestUtils.randomString();
            var fn = function (arg) {
                // Assert
                expect(arg).to.equals(randomArg);
                compteur++;
            };

            // Act
            var debouncedFn = ReactMixins.mixins[5].debounce.call(thisObj, fn);
            debouncedFn(randomArg);
            debouncedFn(randomArg);
            debouncedFn(randomArg);

            // Assert
            expect(compteur).to.equals(3);
        });

        it("should call cancel on componentWillUnmount", () => {
            // Arrange
            var fn = sinon.spy();
            var throttledFn = ReactMixins.mixins[5].throttle.call(thisObj, fn);
            throttledFn.cancel = sinon.spy(throttledFn.cancel);

            var debouncedFn = ReactMixins.mixins[5].debounce.call(thisObj, fn);
            debouncedFn.cancel = sinon.spy(debouncedFn.cancel);

            // Act
            ReactMixins.mixins[5].componentWillUnmount.call(thisObj);

            // Assert
            expect(fn).to.not.be.called;
            expect(throttledFn.cancel).to.be.calledOnce;
            expect(debouncedFn.cancel).to.be.calledOnce;
        });

        it("should not crash if no throttledFn or debouncedFn", () => {
            // Act
            ReactMixins.mixins[5].componentWillUnmount.call(thisObj);
        });
    });
});
