///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";
// suppression du typage suite aux erreurs typescript liées à la nouvelle version 1.6.3 avec resolver désactivé
//import SessionManager = require("src/session/session-manager");
var utils = require("hornet-js-utils");
var logger = utils.getLogger("hornet-js-core.session.session");
var sessionManager = null;
var Session = (function () {
    function Session(sid, maxInactiveInterval, data) {
        this.data = {};
        this.sid = sid;
        this.maxInactiveInterval = maxInactiveInterval;
        this.creationTime = this.lastAccessedTime = new Date();
        if (typeof data === "object" && data !== null) {
            //for (var prop in data) {
            //    this.data[prop] = data[prop];
            //}
            this.data = data;
        }
        if (utils.isServer && !sessionManager)
            sessionManager = require("src/session/session-manager");
    }
    Session.prototype.getId = function () {
        return this.sid;
    };
    Session.prototype.getData = function () {
        return this.data;
    };
    Session.prototype.invalidate = function (fn) {
        if (utils.isServer) {
            sessionManager.invalidate(this, fn);
        }
        else {
            logger.warn("Session.invalidate() called within the browser ... discarding");
        }
    };
    Session.prototype.getAttribute = function (key) {
        return this.data[key];
    };
    Session.prototype.setAttribute = function (key, value) {
        this.data[key] = value;
    };
    Session.prototype.removeAttribute = function (key) {
        delete this.data[key];
    };
    Session.prototype.touch = function () {
        this.lastAccessedTime = new Date();
    };
    Session.prototype.getCreationTime = function () {
        return this.creationTime;
    };
    Session.prototype.getLastAccessTime = function () {
        return this.lastAccessedTime;
    };
    Session.prototype.getMaxInactiveInterval = function () {
        return this.maxInactiveInterval;
    };
    return Session;
})();
module.exports = Session;
//# sourceMappingURL=session.js.map