"use strict";

import utils = require("src/index");
import Promise = require("bluebird");
if (utils.isServer) {
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // wrap bluebird afin de sécuriser l'utilisation de "continuation-local-storage" (perte ou mix de contexte) //
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var shimmer = require("shimmer");
    var proto = Promise && Promise.prototype;
    var ns = utils.getContinuationStorage();
    shimmer.wrap(proto, "_addCallbacks", function (_addCallbacks) {
        return function ns_addCallbacks(fulfill, reject, progress, promise, receiver, domain) {
            if (typeof fulfill === "function") fulfill = ns.bind(fulfill);
            if (typeof reject === "function") reject = ns.bind(reject);
            if (typeof progress === "function") progress = ns.bind(progress);
            return _addCallbacks.call(this, fulfill, reject, progress, promise, receiver, domain);
        };
    });
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
}

class ExtendedPromise<T> implements Thenable<T> {
    promise:Thenable<T>;

    constructor(promise:any) {
        this.promise = (promise instanceof Promise) ? promise : new Promise(promise);
    }

    // Redirection du then de Promise pour permettre le chainage d'appels
    then<TR>(onFulfilled:(value:T) => Thenable<TR>, onRejected?:(error:Error) => void):ExtendedPromise<TR>;
    then<TR>(onFulfilled:(value:T) => TR, onRejected?:(error:Error) => void):ExtendedPromise<TR>;
    then<TR>(onFulfilled:(value:T) => TR, onRejected?:(error:Error) => TR):ExtendedPromise<TR>;
    then<TR>(onFulfilled:(value:T) => Thenable<TR>, onRejected?:(error:Error) => TR):ExtendedPromise<TR> {
        var extPromise = new ExtendedPromise(this.promise.then(onFulfilled, onRejected));
        /* On réutilise la fonction onRejected (si elle est définie) pour traiter les erreurs éventuellement déclenchées dans onFulfilled */
        if (onRejected) {
            extPromise = extPromise.fail(onRejected);
        }
        return extPromise;
    }

    // Ajout de la fonction fail
    fail(onRejected:(error:Error) => void):ExtendedPromise<T> ;
    fail(onRejected:(error:string) => void):ExtendedPromise<T> ;
    fail(onRejected:(error:string) => T):ExtendedPromise<T> ;
    fail(onRejected:(error:Error) => T):ExtendedPromise<T> ;
    fail(onRejected:(error:any) => T):ExtendedPromise<T> {
        return new ExtendedPromise(this.promise.then(null, onRejected));
    }

    // permet de couper la chaine des promise
    stop():ExtendedPromise<T> {
        var stopPromise = new ExtendedPromise(()=> {
        });
        stopPromise.then = () => stopPromise;
        return stopPromise;
    }

    static prepare<TR>(callback:(resolve:(value?:any) => Thenable<TR>, reject?:(error:Error) => Thenable<TR>) => void):() => ExtendedPromise<TR> {
        return () => new ExtendedPromise(new Promise(callback));
    }

    // Redirection de la fonction all pour permettre le chainage d'appels
    static all(promises:Thenable<any>[]):ExtendedPromise<any[]> {
        var all = Promise.all(promises);
        return new ExtendedPromise(all);
    }

    // Redirection de la fonction resolve pour permettre le chainage d'appels
    static resolve<T>(value?:T):ExtendedPromise<T> {
        return new ExtendedPromise(Promise.resolve(value));
    }

    static reject<T>(error:Error):ExtendedPromise<T> {
        return new ExtendedPromise(Promise.reject(error));
    }
}
export = ExtendedPromise;
