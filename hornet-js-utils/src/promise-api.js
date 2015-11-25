///<reference path="../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";
var Promise = require("promise");
var ExtendedPromise = (function () {
    function ExtendedPromise(promise) {
        this.promise = (promise instanceof Promise) ? promise : new Promise(promise);
    }
    ExtendedPromise.prototype.then = function (onFulfilled, onRejected) {
        var extPromise = new ExtendedPromise(this.promise.then(onFulfilled, onRejected));
        /* On réutilise la fonction onRejected (si elle est définie) pour traiter les erreurs éventuellement déclenchées dans onFulfilled */
        if (onRejected) {
            extPromise = extPromise.fail(onRejected);
        }
        return extPromise;
    };
    ExtendedPromise.prototype.fail = function (onRejected) {
        return new ExtendedPromise(this.promise.then(null, onRejected));
    };
    // permet de couper la chaine des promise
    ExtendedPromise.prototype.stop = function () {
        var stopPromise = new ExtendedPromise(function () { });
        stopPromise.then = function () { return stopPromise; };
        return stopPromise;
    };
    ExtendedPromise.prepare = function (callback) {
        return function () { return new ExtendedPromise(new Promise(callback)); };
    };
    // Redirection de la fonction all pour permettre le chainage d'appels
    ExtendedPromise.all = function (promises) {
        var all = Promise.all(promises);
        return new ExtendedPromise(all);
    };
    // Redirection de la fonction resolve pour permettre le chainage d'appels
    ExtendedPromise.resolve = function (value) {
        return new ExtendedPromise(Promise.resolve(value));
    };
    ExtendedPromise.reject = function (error) {
        return new ExtendedPromise(Promise.reject(error));
    };
    return ExtendedPromise;
})();
module.exports = ExtendedPromise;
//# sourceMappingURL=promise-api.js.map