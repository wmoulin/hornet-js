/**
 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
 * <p/>
 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
 * <p/>
 * Ce logiciel est un programme informatique servant à faciliter la création
 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
 * <p/>
 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
 * respectant les principes de diffusion des logiciels libres. Vous pouvez
 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
 * sur le site "http://www.cecill.info".
 * <p/>
 * En contrepartie de l'accessibilité au code source et des droits de copie,
 * de modification et de redistribution accordés par cette licence, il n'est
 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
 * titulaire des droits patrimoniaux et les concédants successifs.
 * <p/>
 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
 * associés au chargement,  à l'utilisation,  à la modification et/ou au
 * développement et à la reproduction du logiciel par l'utilisateur étant
 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 * manipuler et qui le réserve donc à des développeurs et des professionnels
 * avertis possédant  des  connaissances  informatiques approfondies.  Les
 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
 * logiciel à leurs besoins dans des conditions permettant d'assurer la
 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
 * <p/>
 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
 * termes.
 * <p/>
 * <p/>
 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
 * <p/>
 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
 * <p/>
 * This software is a computer program whose purpose is to facilitate creation of
 * web application in accordance with french general repositories : RGI, RGS and RGAA.
 * <p/>
 * This software is governed by the CeCILL license under French law and
 * abiding by the rules of distribution of free software.  You can  use,
 * modify and/ or redistribute the software under the terms of the CeCILL
 * license as circulated by CEA, CNRS and INRIA at the following URL
 * "http://www.cecill.info".
 * <p/>
 * As a counterpart to the access to the source code and  rights to copy,
 * modify and redistribute granted by the license, users are provided only
 * with a limited warranty  and the software's author,  the holder of the
 * economic rights,  and the successive licensors  have only  limited
 * liability.
 * <p/>
 * In this respect, the user's attention is drawn to the risks associated
 * with loading,  using,  modifying and/or developing or reproducing the
 * software by the user in light of its specific status of free software,
 * that may mean  that it is complicated to manipulate,  and  that  also
 * therefore means  that it is reserved for developers  and  experienced
 * professionals having in-depth computer knowledge. Users are therefore
 * encouraged to load and test the software's suitability as regards their
 * requirements in conditions enabling the security of their systems and/or
 * data to be ensured and,  more generally, to use and operate it in the
 * same conditions as regards security.
 * <p/>
 * The fact that you are presently reading this means that you have had
 * knowledge of the CeCILL license and that you accept its terms.
 *
 */

/**
 * hornet-js-core - Ensemble des composants qui forment le coeur de hornet-js
 *
 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
 * @version v5.1.0
 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
 * @license CECILL-2.1
 */

import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-utils/src/logger";
const logger: Logger = Utils.getLogger("hornet-js-core.session.session-manager");

import * as cookie from "cookie";
var crc = require("crc").crc32;
var parseUrl = require("parseurl");
var uid = require("uid-safe").sync;
var onHeaders = require("on-headers");
var signature = require("cookie-signature");

import { Session } from "src/session/session";
import { MemoryStore } from "src/session/memory-store";
import { Store } from "src/session/store";
import { CookieManager } from "src/session/cookie-manager"

declare module "express" {
    export interface Request {
        getSession?: () => Session;
    }
}

/**
 * Node.js 0.8+ async implementation.
 * @private
 */
/* istanbul ignore next */
var defer = typeof setImmediate === "function" ?
    setImmediate :
    function(fn, a?, b?) {
        process.nextTick(fn.bind.apply(fn, arguments))
    };

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
                val = CookieManager.unsignCookie(raw.slice(2), secret);

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
function hash(session: Session) {
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

export class SessionManager {
    private static STORE: Store;

    static invalidate(session: Session, fn: Function) {
    }

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
    static middleware(options: any) {
        var options = options || {}
            , name = options.name || "NODESESSIONID"
            , store = options.store || new MemoryStore
            , cookie = options.cookie || {}
            , trustProxy = options.trustProxy
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
        SessionManager.invalidate = function(session: Session, fn: Function) {
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
            logger.debug("undefined saveUnmodifiedSession option; default = !store.isTouchImplemented() = " + saveUnmodifiedSession);
        }

        return (req, res, next) => {
            // self-awareness
            if (typeof req.getSession === "function") return next();

            if (!store.isReady()) return logger.debug("store is not ready"), next();

            if (0 !== parseUrl.original(req).pathname.indexOf(cookie.path || "/")) return next();

            // get the session ID from the cookie
            var sessionId = getcookie(req, name, secret, route);

            // set-cookie listener
            onHeaders(res, function() {
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
            var hashBeforeRequest: String;
            var hashAfterRequest: String;

            logger.trace("incoming request with " + name + "=" + sessionId + " (path=" + requestUrl + ")");

            function extendsRequest(req, res, returnedSession: Session) {
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
            var ended = false;

            // prevent writing to closed response
            var error = false;
            ["close", "abort", "end"].forEach((event) => {
                res.once(event, () => {
                    error = true;
                });
            });

            res.end = function end(chunk, encoding) {
                if (ended) return false;
                ended = true;

                var ret;
                var sync = true;
                var session: Session = req.getSession();
                hashAfterRequest = hash(session);

                function writeend() {
                    if (error) return false;

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
                    logger.trace("session will be saved into the store : (cookieSessionId=" + sessionId + ", sessionId=" + session.getId() + ", hashBefore=" + hashBeforeRequest + ", hashAfter=" + hashAfterRequest + ", saveUnmodified=" + saveUnmodifiedSession + ")");
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
            store.get(sessionId, function(err, session: Session) {
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
