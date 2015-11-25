/// <reference path="../node/node.d.ts" />
interface Thenable<T> {
    then<TR>(onFulfilled:(value:T) => Thenable<TR>, onRejected?:(error:Error) => TR): Thenable<TR>;
    then<TR>(onFulfilled:(value:T) => Thenable<TR>, onRejected?:(error:Error) => void): Thenable<TR>;
    then<TR>(onFulfilled:(value:T) => TR, onRejected?:(error:Error) => void): Thenable<TR>;
    then<TR>(onFulfilled:(value:T) => TR, onRejected?:(error:Error) => TR): Thenable<TR>;
}

declare module "promise" {
    class Promise<T> implements Thenable<T> {
        constructor(callback:(resolve:(value?:T) => void, reject?:(error:Error) => void) => void);
        static resolve<T>(value?:T):Thenable<T>;
        static resolve<T>(promise:Thenable<T>):Thenable<T>;
        static reject<T>(error:Error):Thenable<T>;
        static all(promises:Thenable<any>[]):Thenable<any[]>;

        then<TR>(onFulfilled:(value:T) => Thenable<TR>, onRejected?:(error:Error) => TR):Thenable<TR>;
        then<TR>(onFulfilled:(value:T) => Thenable<TR>, onRejected?:(error:Error) => void):Thenable<TR>;
        then<TR>(onFulfilled:(value:T) => TR, onRejected?:(error:Error) => void):Thenable<TR>;
        then<TR>(onFulfilled:(value:T) => TR, onRejected?:(error:Error) => TR):Thenable<TR>;
    }

    export = Promise;
}
