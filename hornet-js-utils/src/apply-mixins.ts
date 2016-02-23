"use strict";

export class ApplyMixins {

    static applyMixins(derivedCtor:any, baseCtors:any[]) {
        baseCtors.forEach(baseCtor => {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            });
        });
    }
}
