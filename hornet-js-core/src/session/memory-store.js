///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Store = require("src/session/store");
var utils = require("hornet-js-utils");
var logger = utils.getLogger("hornet-js-core.session.memory-store");
/* istanbul ignore next */
var defer = typeof setImmediate === "function" ? setImmediate : function (fn, a, b) {
    process.nextTick(fn.bind.apply(fn, arguments));
};
var MemoryStore = (function (_super) {
    __extends(MemoryStore, _super);
    /**
     * Constructor
     * @param expiredCheckInterval the interval in ms to check / delete expired sessions (default: 60000ms)
     */
    function MemoryStore(expiredCheckInterval) {
        if (expiredCheckInterval === void 0) { expiredCheckInterval = 60000; }
        _super.call(this);
        this.lastExpiredCheck = 0;
        this.expiredCheckInterval = expiredCheckInterval;
        this.sessions = Object.create(null);
    }
    /**
     * Describe if the 'touch' method is implemented or not by this kind of store
     *
     * @returns {boolean}
     */
    MemoryStore.prototype.isTouchImplemented = function () {
        return true;
    };
    /**
     * Clear all sessions.
     *
     * @param {function} fn
     * @public
     */
    MemoryStore.prototype.clear = function (fn) {
        this.sessions = Object.create(null);
        fn && defer(fn);
    };
    /**
     * Destroy the session associated with the given session ID.
     *
     * @param {Session} session
     * @param {function} fn
     * @public
     */
    MemoryStore.prototype.destroy = function (session, fn) {
        logger.trace("destroying session :", session.getId());
        delete this.sessions[session.getId()];
        fn && defer(fn);
    };
    /**
     * Fetch session by the given session ID.
     *
     * @param {string} sid
     * @param {function} fn
     * @public
     */
    MemoryStore.prototype.get = function (sid, fn) {
        this.checkExpired();
        defer(fn, null, this.sessions[sid]);
    };
    /**
     * Get number of active sessions.
     *
     * @param {function} fn
     * @public
     */
    MemoryStore.prototype.length = function (fn) {
        fn && defer(fn, null, Object.keys(this.sessions).length);
    };
    MemoryStore.prototype.set = function (session, fn) {
        logger.trace("saving session", session);
        this.sessions[session.getId()] = session;
        fn && defer(fn);
    };
    MemoryStore.prototype.touch = function (session, fn) {
        logger.trace("touching session", session);
        this.sessions[session.getId()] = session;
        fn && defer(fn);
    };
    MemoryStore.prototype.checkExpired = function () {
        var _this = this;
        var now = Date.now();
        if (now - this.lastExpiredCheck > this.expiredCheckInterval) {
            this.lastExpiredCheck = now;
            logger.trace("checking expired sessions");
            Object.keys(this.sessions).forEach(function (sid) {
                var session = _this.sessions[sid];
                if (now - session.getLastAccessTime().getTime() > session.getMaxInactiveInterval()) {
                    logger.info("session #" + session.getId() + " expired => removed from the MemoryStore");
                    session.invalidate(function () {
                    });
                }
            });
        }
    };
    return MemoryStore;
})(Store);
module.exports = MemoryStore;
//# sourceMappingURL=memory-store.js.map