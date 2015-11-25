///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";

import events = require("events");
import Session = require("src/session/session");

class Store extends events.EventEmitter {

    private ready:boolean = true;

    constructor() {
        super();
        this.on("disconnect", () => {
            this.ready = false;
        });
        this.on("connect", () => {
            this.ready = true;
        });
    }

    isReady():boolean {
        return this.ready;
    }

    get(sid:string, fn:Function) {
        throw new Error("This method is abstract");
    }

    set(session:Session, fn:Function) {
        throw new Error("This method is abstract");
    }

    destroy(session:Session, fn:Function) {
        throw new Error("This method is abstract");
    }

    touch(session:Session, fn:Function) {
        throw new Error("This method is abstract");
    }

    getName() {
        var funcNameRegex = /function (.{1,})\(/;
        var results = (funcNameRegex).exec((<any> this).constructor.toString());
        return (results && results.length > 1) ? results[1] : "";
    }

    /**
     * Describe if the 'touch' method is implemented or not into this kind of store
     *
     * @returns {boolean}
     */
    isTouchImplemented():boolean {
        throw new Error("This method is abstract");
    }
}

export = Store;


