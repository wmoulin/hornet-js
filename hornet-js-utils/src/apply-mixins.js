///<reference path="../../hornet-js-ts-typings/lodash/lodash.d.ts"/>
"use strict";
var ApplyMixins = (function () {
    function ApplyMixins() {
    }
    ApplyMixins.applyMixins = function (derivedCtor, baseCtors) {
        baseCtors.forEach(function (baseCtor) {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            });
        });
    };
    return ApplyMixins;
})();
exports.ApplyMixins = ApplyMixins;
//# sourceMappingURL=apply-mixins.js.map