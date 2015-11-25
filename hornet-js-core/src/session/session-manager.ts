///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";

var cookie = require("cookie");
var crc = require("crc").crc32;
var parseUrl = require("parseurl");
var uid = require("uid-safe").sync;
var onHeaders = require("on-headers");
var signature = require("cookie-signature");


import utils = require("hornet-js-utils");
import Session = require("src/session/session");
import MemoryStore = require("src/session/memory-store");
import Store = require("src/session/store");

var logger = utils.getLogger("hornet-js-core.session.session-manager");

/**
 * Node.js 0.8+ async implementation.
 * @private
 */
/* istanbul ignore next */
var defer = typeof setImmediate === "function" ?
    setImmediate :
    function (fn, a?, b?) { process.nextTick(fn.bind.apply(fn, arguments)) };

/**
 * Generate a session ID for a new session.
 *
 * @return {String}
 * @private
 */
function generateSessionId(req) {
    return uid(24);
}

/**
 * Verify and decode the given `val` with `secret`.
 *
 * @param {String} val
 * @param {String} secret
 * @returns {String|Boolean}
 * @private
 */
function unsigncookie(val, secret) {
    var result = signature.unsign(val, secret);

    if (result !== false) {
        return result;
    }

    return false;
}

/**
 * Get the session ID cookie from request.
 *
 * @return {string}
 * @private
 */
function getcookie(req, name, secret, route) {
    var header = req.headers.cookie;
    var raw;
    var val;
    var cookieRoute = route ? "." + route : null;

    // read from cookie header
    if (header) {
        var cookies = cookie.parse(header);

        raw = cookies[name];
        // sticky session management
        if (cookieRoute && raw && raw.indexOf(cookieRoute, raw.length - cookieRoute.length) > -1) {
            raw = raw.substr(0, raw.length - cookieRoute.length);
        }

        if (raw) {
            if (secret.length > 0 && raw.substr(0, 2) === "s:") {
                val = unsigncookie(raw.slice(2), secret);

                if (val === false) {
                    logger.debug("cookie signature invalid");
                    val = undefined;
                }
            } else {
                val = raw;
            }
        }
    }

    return val;
}

/**
 * Hash the given `sess` object omitting changes to `.cookie`.
 *
 * @param {Session} session
 * @return {String}
 * @private
 */
function hash(session:Session) {
    return crc(JSON.stringify(session.getData()));
}

/**
 * Determine if request is secure.
 *
 * @param {Object} req
 * @param {Boolean} [trustProxy]
 * @return {Boolean}
 * @private
 */
function isSecure(req, trustProxy) {
    // socket is https server
    if (req.connection && req.connection.encrypted) {
        return true;
    }

    // do not trust proxy
    if (trustProxy === false) {
        return false;
    }

    // no explicit trust; try req.secure from express
    if (trustProxy !== true) {
        var secure = req.secure;
        return typeof secure === "boolean"
            ? secure
            : false;
    }

    // read the proto from x-forwarded-proto header
    var header = req.headers["x-forwarded-proto"] || "";
    var index = header.indexOf(",");
    var proto = index !== -1
        ? header.substr(0, index).toLowerCase().trim()
        : header.toLowerCase().trim();

    return proto === "https";
}

/**
 * Set cookie on response.
 *
 * @private
 */
function setcookie(res, name, val, secret, options, route) {
    var cookieValue = secret.length > 0 ? "s:" + signature.sign(val, secret) : val;

    if (route) {
        cookieValue += "." + route;
    }

    var data = cookie.serialize(name, cookieValue, options);

    logger.trace("set-cookie", data);

    var prev = res.getHeader("set-cookie") || [];
    var header = Array.isArray(prev) ? prev.concat(data)
        : Array.isArray(data) ? [prev].concat(data)
        : [prev, data];

    res.setHeader("set-cookie", header)
}

class SessionManager {
    private static STORE:Store;

    static invalidate(session:Session, fn:Function) {}

    /**
     * Setup session middleware with the given `options`.
     *
     * @param {Object} [options]
     * @param {Object} [options.cookie] Options for cookie
     * @param {Function} [options.genid]
     * @param {String} [options.name=NODESSIONID] Session ID cookie name
     * @param {Boolean} [options.proxy]
     * @param {Boolean} [options.resave] Resave unmodified sessions back to the store
     * @param {Boolean} [options.rolling] Enable/disable rolling session expiration
     * @param {Boolean} [options.saveUninitialized] Save uninitialized sessions to the store
     * @param {String} [options.secret] Secret for signing session ID
     * @param {Object} [options.store=MemoryStore] Session store
     * @return {Function} middleware
     * @public
     */
    static middleware(options:any) {
        var options = options || {}
            , name = options.name || "NODESESSIONID"
            , store = options.store || new MemoryStore
            , cookie = options.cookie || {}
            , trustProxy = options.proxy
            , alwaysSetCookie = options.alwaysSetCookie || false
            , saveUnmodifiedSession = options.saveUnmodifiedSession
            , secret = options.secret || ""
            , sessionTimeout = options.sessionTimeout || 1800000
            , route = cookie.route || null
        ;

        var cookieDestroy = {
            expires: new Date("01/01/1970 GMT"),
            path: cookie.path,
            domain: cookie.domain,
            httpOnly: cookie.httpOnly,
            secure: cookie.secure
        };

        // implementation dynamique pour accès à la conf
        SessionManager.invalidate = function(session:Session, fn:Function) {
            var res = session["currentResponse"];
            onHeaders(res, () => {
                setcookie(res, name, "", "", cookieDestroy, null);
            });
            SessionManager.STORE.destroy(session, fn);
        };

        logger.debug("SessionManager configured with : ", options);
        logger.debug("SessionManager final configuration : ", {
            name: name,
            store: store.getName() || "Unknown Store Type",
            cookie: cookie,
            trustProxy: trustProxy,
            alwaysSetCookie: alwaysSetCookie,
            saveUnmodifiedSession: saveUnmodifiedSession,
            secret: secret,
            sessionTimeout: sessionTimeout,
            route: route
        });
        // save the store in the SessionManager class
        SessionManager.STORE = store;

        var generateId = options.genid || generateSessionId;

        if (typeof generateId !== "function") {
            throw new TypeError("genid option must be a function");
        }

        if (!saveUnmodifiedSession && saveUnmodifiedSession !== false) {
            saveUnmodifiedSession = !store.isTouchImplemented();
            logger.warn("undefined saveUnmodifiedSession option; default = !store.isTouchImplemented() = " + saveUnmodifiedSession);
        }

        return function session(req, res, next) {
            // self-awareness
            if (typeof req.getSession === "function") return next();

            if (!store.isReady()) return logger.debug("store is not ready"), next();

            if (0 != parseUrl.original(req).pathname.indexOf(cookie.path || "/")) return next();

            // get the session ID from the cookie
            var sessionId = getcookie(req, name, secret, route);

            // set-cookie listener
            onHeaders(res, function () {
                if (!req.getSession()) {
                    logger.debug("no session");
                    return;
                }

                // only send secure cookies via https
                if (cookie.secure && !isSecure(req, trustProxy)) {
                    logger.debug("not secured");
                    return;
                }

                if (alwaysSetCookie || !sessionId || sessionId !== req.getSession().getId()) {
                    setcookie(res, name, req.getSession().getId(), secret, cookie, route);
                }
            });

            var requestUrl = parseUrl.original(req).path;
            var hashBeforeRequest:String;
            var hashAfterRequest:String;

            logger.trace("incoming request with " + name + "=" + sessionId + " (path=" + requestUrl + ")");

            function extendsRequest(req, res, returnedSession:Session) {
                // extends request with "getSession" method
                req.getSession = () => returnedSession;

                // Keep old session object referencing the data of Session for unmanaged middlewares (passport, ...)
                req.session = returnedSession.getData();

                // compute hash before request
                hashBeforeRequest = hash(returnedSession);

                // Expose the current response to be able to destroy the session and remove the cookie
                Object.defineProperty(returnedSession, "currentResponse", {
                    configurable: true,
                    enumerable: false,
                    value: res
                });
            }

            // create a new Session
            function generate(req, res) {
                var session = new Session(generateId(req), sessionTimeout);
                logger.trace("new session", session);
                extendsRequest(req, res, session);
            }

            // proxy end() to commit the session
            var _end = res.end;
            var _write = res.write;
            var ended = false;
            res.end = function end(chunk, encoding) {
                if (ended) return false;
                ended = true;

                var ret;
                var sync = true;
                var session:Session = req.getSession();
                hashAfterRequest = hash(session);

                function writeend() {
                    if (sync) {
                        ret = _end.call(res, chunk, encoding);
                        sync = false;
                        return;
                    }

                    _end.call(res);
                }

                if (!session) {
                    logger.trace("no session");
                    return _end.call(res, chunk, encoding);
                }

                // touch session
                logger.trace("touching session #" + session.getId());
                session.touch();

                // Session saving logic:
                //  - if new session or
                //  - if data object is different (session modified)
                //  - if touch is not implemented by the store
                //
                //  - otherwise touch the session
                if (sessionId !== session.getId() || hashBeforeRequest !== hashAfterRequest || saveUnmodifiedSession) {
                    logger.trace("session will be saved into the store : (cookieSessionId="+sessionId+", sessionId="+session.getId()+", hashBefore="+hashBeforeRequest+", hashAfter="+hashAfterRequest+", saveUnmodified="+saveUnmodifiedSession + ")");
                    store.set(session, function onSaveCallback(err) {
                        if (err) defer(next, err);
                        writeend();
                    });

                } else if (store.isTouchImplemented()) {
                    logger.trace("session will be touched into the store");
                    store.touch(session, function onTouchCallback(err) {
                        if (err) defer(next, err);
                        writeend();
                    });
                }
                return;
            };

            // no SID > new Session
            if (!sessionId) {
                logger.trace("SID not found in cookies > new session");
                generate(req, res);
                next();
                return;
            }

            // get the session from the store if exists
            store.get(sessionId, function (err, session:Session) {
                if (err) {
                    logger.trace("error trying to get session in the store : %j", err);
                    if (err.code !== "ENOENT") {
                        next(err);
                        return;
                    }
                    generate(req, res);

                } else if (!session) {
                    logger.trace("no session found in the store");
                    generate(req, res);

                } else {
                    logger.trace("session found in the store");
                    extendsRequest(req, res, session);
                }

                next();
            });
        };
    }
}

export = SessionManager;