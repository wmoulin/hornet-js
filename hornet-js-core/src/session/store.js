///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var events = require("events");
var Store = (function (_super) {
    __extends(Store, _super);
    function Store() {
        var _this = this;
        _super.call(this);
        this.ready = true;
        this.on("disconnect", function () {
            _this.ready = false;
        });
        this.on("connect", function () {
            _this.ready = true;
        });
    }
    Store.prototype.isReady = function () {
        return this.ready;
    };
    Store.prototype.get = function (sid, fn) {
        throw new Error("This method is abstract");
    };
    Store.prototype.set = function (session, fn) {
        throw new Error("This method is abstract");
    };
    Store.prototype.destroy = function (session, fn) {
        throw new Error("This method is abstract");
    };
    Store.prototype.touch = function (session, fn) {
        throw new Error("This method is abstract");
    };
    Store.prototype.getName = function () {
        var funcNameRegex = /function (.{1,})\(/;
        var results = (funcNameRegex).exec(this.constructor.toString());
        return (results && results.length > 1) ? results[1] : "";
    };
    /**
     * Describe if the 'touch' method is implemented or not into this kind of store
     *
     * @returns {boolean}
     */
    Store.prototype.isTouchImplemented = function () {
        throw new Error("This method is abstract");
    };
    return Store;
})(events.EventEmitter);
module.exports = Store;
//# sourceMappingURL=store.js.map