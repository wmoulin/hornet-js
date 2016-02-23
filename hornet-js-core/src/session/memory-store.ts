"use strict";

import Session = require("src/session/session");
import Store = require("src/session/store");
import utils = require("hornet-js-utils");
var logger = utils.getLogger("hornet-js-core.session.memory-store");

/* istanbul ignore next */
var defer = typeof setImmediate === "function" ? setImmediate : function (fn, a?, b?) {
    process.nextTick(fn.bind.apply(fn, arguments));
};


class MemoryStore extends Store {
    private sessions:any;
    private expiredCheckInterval:number;
    private lastExpiredCheck:number = 0;

    /**
     * Constructor
     * @param expiredCheckInterval the interval in ms to check / delete expired sessions (default: 60000ms)
     */
    constructor(expiredCheckInterval = 60000) {
        super();
        this.expiredCheckInterval = expiredCheckInterval;
        this.sessions = Object.create(null);
    }


    /**
     * Describe if the 'touch' method is implemented or not by this kind of store
     *
     * @returns {boolean}
     */
    isTouchImplemented():boolean {
        return true;
    }

    /**
     * Clear all sessions.
     *
     * @param {function} fn
     * @public
     */
    clear(fn:Function) {
        this.sessions = Object.create(null);
        fn && defer(fn);
    }

    /**
     * Destroy the session associated with the given session ID.
     *
     * @param {Session} session
     * @param {function} fn
     * @public
     */
    destroy(session:Session, fn:Function) {
        logger.trace("destroying session :", session.getId());
        delete this.sessions[session.getId()];
        fn && defer(fn);
    }

    /**
     * Fetch session by the given session ID.
     *
     * @param {string} sid
     * @param {function} fn
     * @public
     */
    get(sid:string, fn:Function) {
        this.checkExpired();
        defer(fn, null, this.sessions[sid]);
    }

    /**
     * Get number of active sessions.
     *
     * @param {function} fn
     * @public
     */
    length(fn) {
        fn && defer(fn, null, Object.keys(this.sessions).length);
    }

    set(session:Session, fn:Function) {
        logger.trace("saving session", session);
        this.sessions[session.getId()] = session;
        fn && defer(fn);
    }

    touch(session:Session, fn:Function) {
        logger.trace("touching session", session);
        this.sessions[session.getId()] = session;
        fn && defer(fn);
    }

    private checkExpired() {
        var now = Date.now();
        if (now - this.lastExpiredCheck > this.expiredCheckInterval) {
            this.lastExpiredCheck = now;
            logger.trace("checking expired sessions");
            Object.keys(this.sessions).forEach((sid) => {
                var session:Session = this.sessions[sid];
                if (now - session.getLastAccessTime().getTime() > session.getMaxInactiveInterval()) {
                    logger.info("session #" + session.getId() + " expired => removed from the MemoryStore");
                    session.invalidate(()=> {});
                }
            });
        }
    }
}

export = MemoryStore;
