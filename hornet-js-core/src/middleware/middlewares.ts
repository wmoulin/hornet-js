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
import * as path from "path";

import { Class } from "hornet-js-utils/src/typescript-utils";
import { ServerConfiguration } from "src/server-conf";
import ErrorObject = ajv.ErrorObject;

const isEnvProduction: boolean = (process.env["NODE_ENV"] === "production");

function isSecurityEnabled(envProduction: boolean, logger): boolean {
    let enabled: boolean = false;
    if (Utils.config.get("security")) {
        if (Utils.config.get("security.enabled") || envProduction) {
            enabled = true;
            logger.trace("SECURITY MIDDLEWARE CONFIGURATION :  Configuration de la sécurité...");
        } else {
            logger.warn("SECURITY MIDDLEWARE CONFIGURATION : La sécurité est désactivé!!!");
        }
    } else {
        logger.warn("SECURITY MIDDLEWARE CONFIGURATION : La sécurité n'est pas configurée!!!");
    }
    return enabled;
}

function checkSecurityConfiguration(key: string, enabledKey: boolean, middlewareName: string, logger): boolean {
    let enabled: boolean = false;
    if (Utils.config.has(key)) {
        if (enabledKey) {
            key = key + ".enabled";
        }

        if (Utils.config.getOrDefault(key, true)) {
            logger.debug("SECURITY MIDDLEWARE CONFIGURATION : ajout du middleware " + middlewareName);
            enabled = true;
        } else {
            logger.warn("SECURITY MIDDLEWARE CONFIGURATION : Le middleware " + middlewareName + " n'est pas activé");
        }
    } else {
        logger.warn("SECURITY MIDDLEWARE CONFIGURATION : Le middleware " + middlewareName + " n'est pas configuré");
    }
    return enabled;
}

function sanitizeErrorThrownInDomain(error) {
    if (error) {
        delete error["error@context"];
        delete error["domain"];
    }
}

// ------------------------------------------------------------------------------------------------------------------- //
/**
 * Classe abstraite de gestion d'un middleware dans une application Hornet
 * Cette classe doit être héritée par chaque middleware
 *
 * Attention : la classe héritant de AbstractHornetMiddleware doit définir le constructeur suivant :
 *          constructor() {
 *              [...]
 *              super(appConfig, PREFIX_OPTIONNEL, FN_OPTIONNEL);
 *              [...]
 *          }
 *
 * > Par défaut, la fonction "insertMiddleware(app)" utilise le PREFIX et FN fournis : app.use(PREFIX, FN)
 *
 * > Pour des cas particuliers, il est possible de surcharger cette méthode pour ajouter autant de middlewares qu'on veut :
 *      public insertMiddleware(app) {
 *          app.use("/exemple", (req, res, next) => { [ ... ] });
 *          app.use((req, res, next) => { .... });
 *          ...
 *      }
 */
export class AbstractHornetMiddleware {
    static APP_CONFIG: ServerConfiguration;
    protected prefix: string;
    protected middlewareFunction: ErrorRequestHandler | RequestHandler;

    /**
     * Constructeur
     *
     * @param middlewareFunction
     * @param prefix
     */
    constructor(middlewareFunction?: ErrorRequestHandler | RequestHandler, prefix?: string) {
        this.prefix = prefix;
        this.middlewareFunction = middlewareFunction;
    }

    /**
     * Méthode appelée automatiquement lors de l'initialisation du serveur afin d'ajouter un middleware
     * @param app
     */
    public insertMiddleware(app: express.Express) {

        if (this.prefix !== null && this.prefix !== undefined) {
            app.use(this.prefix, this.middlewareFunction);
        } else {
            app.use(this.middlewareFunction);
        }
    }
}

// ------------------------------------------------------------------------------------------------------------------- //
//                                      HornetContextInitializerMiddleware
// ------------------------------------------------------------------------------------------------------------------- //

import { RouteType } from "src/routes/abstract-routes";

export class HornetContextInitializerMiddleware extends AbstractHornetMiddleware {
    constructor() {
        let callbacksStorage = Utils.getContinuationStorage();
        const dataPathPrefix = Utils.buildContextPath(
            Utils.config.getOrDefault("fullSpa.name", AbstractHornetMiddleware.APP_CONFIG.routesDataContext));
        super((req, res, next) => {
            callbacksStorage.bindEmitter(req);
            callbacksStorage.bindEmitter(res);

            callbacksStorage.run(() => {
                callbacksStorage.set("hornet.request", req);
                callbacksStorage.set("hornet.response", res);
                callbacksStorage.set("hornet.routeType",
                    parseUrl.original(req).pathname.indexOf(dataPathPrefix) === 0 ? RouteType.DATA : RouteType.PAGE);

                let currentUrl = parseUrl.original(req).pathname;
                let relativePathname = currentUrl.replace(Utils.getContextPath(), "");
                callbacksStorage.set("hornet.routePath", relativePathname);
                callbacksStorage.set("hornet.currentUrl", currentUrl);
                next();
            });
        });
    }
}

// ------------------------------------------------------------------------------------------------------------------- //
//                                      LoggerTIDMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
const uuid = require("uuid");

export class LoggerTIDMiddleware extends AbstractHornetMiddleware {
    constructor() {
        super((req, res, next) => {
            Utils.setCls("hornet.tid", uuid.v4().substr(0, 8));
            next();
        });
    }
}

// ------------------------------------------------------------------------------------------------------------------- //
//                                      LoggerUserMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
export class LoggerUserMiddleware extends AbstractHornetMiddleware {
    private static logger: Logger = Utils.getLogger("hornet-js-core.middlewares.LoggerUserMiddleware");

    constructor() {
        super((req, res, next) => {
            Utils.setCls("hornet.user", req.user);
            next();
        });
    }
}

// ------------------------------------------------------------------------------------------------------------------- //
//                                      WelcomePageRedirectMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
const parseUrl = require("parseurl");

export class WelcomePageRedirectMiddleware extends AbstractHornetMiddleware {
    private static logger: Logger = Utils.getLogger("hornet-js-core.middlewares.WelcomePageRedirectMiddleware");

    constructor() {
        let contextPath = Utils.buildContextPath("/").replace(/(^.*)([^\/]+)\/+$/g, "$1$2");
        let welcomePage = Utils.buildContextPath(Utils.appSharedProps.get("welcomePageUrl")).replace(/(^.*)([^\/]+)\/+$/g, "$1$2");

        super((req, res, next) => {
            let pathname = parseUrl.original(req).pathname.replace(/(^.*)([^\/]+)\/+$/g, "$1$2");
            if (pathname === contextPath && welcomePage !== contextPath) {
                return res.redirect(welcomePage);
            } else {
                next();
            }
        });
    }
}

// ------------------------------------------------------------------------------------------------------------------- //
//                                      WithoutSlashPageRedirectMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
export class WithoutSlashPageRedirectMiddleware extends AbstractHornetMiddleware {
    constructor() {
        let contextPath = Utils.getContextPath();
        super((req, res, next) => {
            let pathname = parseUrl.original(req).pathname;
            if (pathname === contextPath) {
                return res.redirect(contextPath + "/");
            } else {
                next();
            }
        });
    }
}

// ------------------------------------------------------------------------------------------------------------------- //
//                                      StaticNodeHttpHeaderMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
export class StaticNodeHttpHeaderMiddleware extends AbstractHornetMiddleware {
    private static logger: Logger = Utils.getLogger("hornet-js-core.middlewares.StaticNodeHttpHeaderMiddleware");

    constructor() {
        let staticUrl = Utils.buildStaticPath("/").replace(Utils.getContextPath(), "");

        super((req, res, next) => {
            res.setHeader("X-Static-From", "app");
            next();
        }, staticUrl);
    }
}

// ------------------------------------------------------------------------------------------------------------------- //
//                                      StaticPathMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
import * as express from "express";

export class StaticPathMiddleware extends AbstractHornetMiddleware {
    private static logger: Logger = Utils.getLogger("hornet-js-core.middlewares.StaticPathMiddleware");

    constructor() {
        let appConfig = AbstractHornetMiddleware.APP_CONFIG;
        let staticPath = path.join(appConfig.serverDir, appConfig.staticPath);

        let staticUrl = Utils.buildStaticPath("/").replace(Utils.getContextPath(), "");

        StaticPathMiddleware.logger.trace("Emplacement des ressources statiques '" + staticUrl + "' :", staticPath);

        super(express.static(staticPath, (<any>{fallthrough: false})), staticUrl);
    }
}

// ------------------------------------------------------------------------------------------------------------------- //
//                                      StaticPathErrorMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
export class StaticPathErrorMiddleware extends AbstractHornetMiddleware {
    private static logger: Logger = Utils.getLogger("hornet-js-core.middlewares.StaticPathErrorMiddleware");

    constructor() {

        let staticUrl = Utils.buildStaticPath("/").replace(Utils.getContextPath(), "");

        super((err, req, res, next) => {
            res.status(404).send("Resource not found").end();
            StaticPathErrorMiddleware.logger.error("Ressource statique non trouvée", err);
        }, staticUrl);
    }
}

// ------------------------------------------------------------------------------------------------------------------- //
//                                      BodyParserJsonMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
import * as bodyParser from "body-parser";

export class BodyParserJsonMiddleware extends AbstractHornetMiddleware {
    constructor() {
        super(bodyParser.json({limit: Utils.config.getOrDefault("server.bodyParserLimit", "50mb")}));
    }
}

// ------------------------------------------------------------------------------------------------------------------- //
//                                      BodyParserUrlEncodedMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
export class BodyParserUrlEncodedMiddleware extends AbstractHornetMiddleware {
    constructor() {
        super(bodyParser.urlencoded({ // to support URL-encoded bodies
            extended: true,
            limit: Utils.config.getOrDefault("server.bodyParserLimit", "50mb")
        }));
    }
}

// ------------------------------------------------------------------------------------------------------------------- //
//                                      SessionMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
import { SessionManager } from "src/session/session-manager";

export class SessionMiddleware extends AbstractHornetMiddleware {
    constructor() {
        let sessionConfiguration = {
            trustProxy: Utils.config.getOrDefault("server.trustProxy", false),
            store: AbstractHornetMiddleware.APP_CONFIG.sessionStore || null,
            // secret: Utils.config.get('cookie.secret'),
            secret: null,
            cookie: {
                route: Utils.config.getOrDefault("server.route", null),
                domain: Utils.config.getOrDefault("cookie.domain", null),
                path: Utils.config.getOrDefault("cookie.path", Utils.buildContextPath("/")),
                httpOnly: Utils.config.getOrDefault("cookie.httpOnly", true),
                secure: (isEnvProduction && Utils.config.getOrDefault("cookie.secure", false))
            },
            sessionTimeout: Utils.config.getOrDefault("server.sessionTimeout", 1800000),
            alwaysSetCookie: Utils.config.getOrDefault("cookie.alwaysSetCookie", false),
            saveUnmodifiedSession: null // laisse le session-manager décider en fonction du type de store
        };

        super(SessionManager.middleware(sessionConfiguration));
    }
}

// ------------------------------------------------------------------------------------------------------------------- //
//                                      MulterMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
import multer = require("multer");
import { CustomStoreEngine } from "src/upload/custom-store-engine";

export class MulterMiddleware extends AbstractHornetMiddleware {
    constructor() {
        super(multer({
            storage: Utils.config.getOrDefault("server.uploadAntivirus", false) ?
                new CustomStoreEngine()
                : multer.memoryStorage(),
            limits: {
                fileSize: Utils.config.getOrDefault("server.uploadFileSize", 10000)
            }
        }).any());
    }
}

// ------------------------------------------------------------------------------------------------------------------- //
//                                      SecurityMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
import hpp = require("hpp");

const helmet = require("helmet");

export class SecurityMiddleware extends AbstractHornetMiddleware {
    private static logger: Logger = Utils.getLogger("hornet-js-core.middlewares.SecurityMiddleware");

    public insertMiddleware(app) {
        if (isSecurityEnabled(isEnvProduction, SecurityMiddleware.logger)) {
            // Enlève le header 'x-powered-by' pour éviter de montrer que le site est généré par express
            app.disable("x-powered-by");

            this.hppConfiguration(app);
            this.ieNoOpenConfiguration(app);
            this.noSniffConfiguration(app);
            this.cspConfiguration(app);
            this.frameguardConfiguration(app);
            this.xssFilterConfiguration(app);
            this.hpkpConfiguration(app);
            this.hstsConfiguration(app);
            this.referrerPolicyConfiguration(app);
        }
    }

    private hppConfiguration(app) {
        // Suppression des doublons de paramètres GET
        if (checkSecurityConfiguration("security.hpp", false,
                "HPP 'HTTP Parameter Pollution'", SecurityMiddleware.logger)) {
            app.use(hpp());
        }
    }

    private ieNoOpenConfiguration(app) {

        if (checkSecurityConfiguration("security.ieNoOpen", false,
                "ienoopen 'IE, restrict untrusted HTML: ieNoOpen'", SecurityMiddleware.logger)) {
            // Pour IE8+: ajout le header X-Download-Options
            app.use(helmet.ieNoOpen());
        }
    }

    private noSniffConfiguration(app) {

        if (checkSecurityConfiguration("security.noSniff", false,
                "noSniff 'Don't infer the MIME type: noSniff'", SecurityMiddleware.logger)) {
            // Pour IE8+: ajout le header X-Download-Options
            app.use(helmet.noSniff());
        }
    }

    private cspConfiguration(app) {
        // Ajout des headers "content security" pour empêcher le chargement de scripts venant d'autres domaines
        if (checkSecurityConfiguration("security.csp", true, "CSP 'Content Security Policy'", SecurityMiddleware.logger)) {
            let directives: any = {
                // defaultSrc: Utils.config.getOrDefault("security.csp.defaultSrc", ["'self'", "'unsafe-inline'", "'unsafe-eval'"]),
                baseUri: Utils.config.getOrDefault("security.csp.baseUri", ["'self'"]),
                childSrc: Utils.config.getOrDefault("security.csp.childSrc", ["'self'"]),
                connectSrc: Utils.config.getOrDefault("security.csp.connectSrc", ["'self'"]),
                fontSrc: Utils.config.getOrDefault("security.csp.fontSrc", ["'self'"]),
                formAction: Utils.config.getOrDefault("security.csp.formAction", ["'self'"]),
                frameAncestors: Utils.config.getOrDefault("security.csp.frameAncestors", ["'self'"]),
                frameSrc: Utils.config.getOrDefault("security.csp.childSrc", ["'self'"]), // deprecated gestion ancien navigateur
                imgSrc: Utils.config.getOrDefault("security.csp.imgSrc", ["'self'"]),
                manifestSrc: Utils.config.getOrDefault("security.csp.manifestSrc", ["'self'"]),
                mediaSrc: Utils.config.getOrDefault("security.csp.mediaSrc", ["'self'"]),
                objectSrc: Utils.config.getOrDefault("security.csp.objectSrc", ["'self'"]),
                // todo deal with missing directives
                // reflectedXss: Utils.config.getOrDefault("security.csp.reflectedXss", "block"),
                // todo create post route to report policy failures
                // reportUri: Utils.config.getOrDefault("security.csp.reportUri", ""),
                scriptSrc: Utils.config.getOrDefault("security.csp.scriptSrc", ["'self'", "'unsafe-inline'", "'unsafe-eval'"]),
                styleSrc: Utils.config.getOrDefault("security.csp.styleSrc", ["'self'", "'unsafe-inline'"])
            };
            let sandbox = Utils.config.getOrDefault("security.csp.sandbox", false); // TODO A traiter spécifiquement
            if (sandbox) {
                directives.sandbox = sandbox;
            }
            let pluginTypes = Utils.config.getOrDefault("security.csp.pluginTypes", false);
            if (pluginTypes) {
                directives.pluginTypes = pluginTypes;
            }
            let blockAllMixedContent = Utils.config.getOrDefault("security.csp.blockAllMixedContent", false);
            if (blockAllMixedContent) {
                directives.blockAllMixedContent = blockAllMixedContent;
            }
            let upgradeInsecureRequests = Utils.config.getOrDefault("security.csp.upgradeInsecureRequests", false);
            if (upgradeInsecureRequests) {
                directives.upgradeInsecureRequests = upgradeInsecureRequests;
            }
            app.use(helmet.contentSecurityPolicy({
                directives: directives,
                disableAndroid: Utils.config.getOrDefault("security.csp.disableAndroid", false),
                reportOnly: Utils.config.getOrDefault("security.csp.reportOnly", false),
                setAllHeaders: Utils.config.getOrDefault("security.csp.setAllHeaders", true)
            }));
        }
    }

    private referrerPolicyConfiguration(app) {
        app.use(helmet.referrerPolicy({
            policy: Utils.config.getOrDefault("security.csp.referrer", "origin-when-cross-origin")
        }));
    }

    private frameguardConfiguration(app) {
        // Pour empêcher la mise en itiframe
        if (checkSecurityConfiguration("security.frameguard", true, "frameguard", SecurityMiddleware.logger)) {
            app.use(helmet.frameguard({
                action: Utils.config.getOrDefault("security.frameguard.mode", "deny")
                // todo deal with allow-from and domain conf
                // domain: Utils.config.getOrDefault("security.frameguard.allowFromPattern", "")
                // domain: ''
            }));
        }
    }

    private xssFilterConfiguration(app) {

        if (checkSecurityConfiguration("security.xss", true, "XssFilter 'Cross-site scripting Filter'", SecurityMiddleware.logger)) {
            // Ajoute le header X-XSS-Protection pour essayer de protéger contre des attaques XSS simples
            // This has some security problems for old IE!
            app.use(helmet.xssFilter({setOnOldIE: Utils.config.getOrDefault("security.xss.setOnOldIE", true)}));
        }
    }

    private hpkpConfiguration(app) {
        // Ajoute les headers HTTP Public Key Pinning pour sécuriser les connexions SSL
        if (checkSecurityConfiguration("security.hpkp", true, "HPKP 'HTTP Public Key Pinning'", SecurityMiddleware.logger)) {
            app.use(helmet.hpkp({
                maxAge: Utils.config.getOrDefault("security.hpkp.maxAge", 7776000000),
                sha256s: Utils.config.get("security.hpkp.sha256s"),
                includeSubdomains: Utils.config.getOrDefault("security.hpkp.includeSubdomains", true),
                reportUri: Utils.config.getOrDefault("security.hpkp.reportUri", null),
                reportOnly: Utils.config.getOrDefault("security.hpkp.reportOnly", false)
            }));
        }
    }

    private hstsConfiguration(app) {
        if (checkSecurityConfiguration("security.hsts", true, "HSTS 'HTTP Strict-Transport-Security'", SecurityMiddleware.logger)) {
            // Ajoute le header Strict-Transport-Security pour demander au navigateur client un accès au site en https
            app.use(helmet.hsts({
                // Must be at least 18 weeks to be approved by Google
                maxAge: Utils.config.getOrDefault("security.hsts.maxAge", 10886400000),
                // Must be enabled to be approved by Google
                includeSubDomains: Utils.config.getOrDefault("security.hsts.includeSubDomains", true),
                preload: Utils.config.getOrDefault("security.hsts.preload", false)
            }));
        }
    }
}

// ------------------------------------------------------------------------------------------------------------------- //
//                                      CsrfMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
import * as _ from "lodash";
import director = require("director");

export class CsrfMiddleware extends AbstractHornetMiddleware {
    private static logger: Logger = Utils.getLogger("hornet-js-core.middlewares.CsrfMiddleware");
    static HEADER_CSRF_NAME = "x-csrf-token";
    static CSRF_SESSION_KEY = "security.csrf";

    public insertMiddleware(app) {
        if (isSecurityEnabled(isEnvProduction, CsrfMiddleware.logger)) {
            this.csrfConfiguration(app);
        }
    }

    private csrfConfiguration(app) {
        if (checkSecurityConfiguration("security.csrf", true, "CSRF 'Cross-Site Request Forgery'", CsrfMiddleware.logger)) {
            app.use(CsrfMiddleware.middleware);
        }
    }

    /**
     * Retourne un nouveau token aléatoire
     * @return {string}
     */
    static generateToken(): string {
        let newToken = Math.random().toString(36).slice(2);
        CsrfMiddleware.logger.trace("Génération d'un token CSRF:", newToken);
        return newToken;
    }

    /**
     * Middleware express pour sécuriser les verbs HTTP PUT, POST, PATCH et DELETE d'attaques CSRF
     * @param req
     * @param resrouter
     * @param next
     */
    static middleware(req, res: director.DirectorResponse, next) {
        if (req.method === "PUT" || req.method === "POST" || req.method === "PATCH" || req.method === "DELETE") {
            let incomingCsrf = req.headers[CsrfMiddleware.HEADER_CSRF_NAME];
            if (_.isUndefined(incomingCsrf)) {
                CsrfMiddleware.logger.trace(CsrfMiddleware.HEADER_CSRF_NAME, "non present, recherche dans le body de la requête");
                incomingCsrf = req.body && req.body[CsrfMiddleware.HEADER_CSRF_NAME];
            }
            let sessionCsrf = req.getSession().getAttribute(CsrfMiddleware.CSRF_SESSION_KEY);

            let valid = CsrfMiddleware.isTokenValid(incomingCsrf, sessionCsrf);
            if (valid) {
                // Le token est correcte, l'accès est autorisé
                next();
            } else {
                CsrfMiddleware.logger.debug("Csrf mismatch, retourning 417 status");

                res.status(417);
                res.end();
            }

        } else {
            // Pas de sécurité csrf sur ce verb HTTP.
            // On récupère le token courant en session, généré si absent, puis on l'insère dans le CLS
            let token = req.getSession().getAttribute(CsrfMiddleware.CSRF_SESSION_KEY);
            if (token != null) {
                CsrfMiddleware.logger.debug("Token CSRF already exists in session");
            } else {
                token = CsrfMiddleware.generateToken();
                req.getSession().setAttribute(CsrfMiddleware.CSRF_SESSION_KEY, token);
            }
            Utils.setCls("hornet.csrf", token);

            next();
        }
    }

    /**
     * Détermine si le token envoyé correspond à celui stocké en session
     * @param incomingCsrf
     * @param sessionCsrf
     * @return {boolean}
     * @private
     */
    static isTokenValid(incomingCsrf: string, sessionCsrf: string) {
        CsrfMiddleware.logger.trace("incomingCsrf =", incomingCsrf, "sessionCsrf =", sessionCsrf);

        return incomingCsrf === sessionCsrf;
    }

}

// ------------------------------------------------------------------------------------------------------------------- //
//                                      InternationalizationMiddleware                                                 //
// ------------------------------------------------------------------------------------------------------------------- //

import { I18nLoader, II18n } from "src/i18n/i18n-loader";
import { CookieManager } from "src/session/cookie-manager";

export class InternationalizationMiddleware extends AbstractHornetMiddleware {

    private static logger: Logger = Utils.getLogger("hornet-js-core.middlewares.InternationalizationMiddleware");

    constructor() {

        super((req, res, next: Function) => {
            let appConfig = AbstractHornetMiddleware.APP_CONFIG;

            let isI18nInSession: boolean = req.session && req.session.i18n;
            let localeI18n: II18n = (isI18nInSession) ? req.session.i18n : Utils.config.getOrDefault("localeI18n", {});

            if (!isI18nInSession) {
                let cookLocaleI18n = CookieManager.getCookie(req, "internationalization");
                if (cookLocaleI18n != undefined) {
                    let shortLang = cookLocaleI18n.split("-");
                    localeI18n = {locale: cookLocaleI18n, lang: shortLang[1]};
                }
            }

            if (appConfig.internationalization instanceof I18nLoader) {
                Utils.setCls("hornet.internationalization", appConfig.internationalization.getMessages(localeI18n));
            }

            if (!isI18nInSession) {
                InternationalizationMiddleware.logger.trace("InternationalizationMiddleware :  Mise en session de la locale " + localeI18n.locale);
                req.session.i18n = localeI18n;
            }

            next();
        });
    }
}

// ------------------------------------------------------------------------------------------------------------------- //
//                                      ChangeI18nLocaleMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
export class ChangeI18nLocaleMiddleware extends AbstractHornetMiddleware {

    private static logger: Logger = Utils.getLogger("hornet-js-core.middlewares.ChangeI18nLocaleMiddleware");

    constructor() {
        let appConfig = AbstractHornetMiddleware.APP_CONFIG;
        let i18n = Utils.getCls("hornet.internationalization");

        if (!i18n) {

            let listLang = appConfig.internationalization.getLocales();
            Utils.appSharedProps.set("listLanguage", listLang);
        }

        super((req, res, next: Function) => {
            if (_.some(appConfig.internationalization.getLocales(), {"locale": req.params.i18n})) {

                ChangeI18nLocaleMiddleware.logger.trace("ChangeI18nLocaleMiddleware :  Changement de la locale " + req.params.i18n);
                let shortLang = req.params.i18n.split("-");
                req.session.i18n = {locale: req.params.i18n, lang: shortLang[1]};
                let i18n = appConfig.internationalization.getMessages(req.session.i18n);
                Utils.setCls("hornet.internationalization", i18n);
                CookieManager.setCookie(res, "internationalization", req.params.i18n);
                res.type("application/json");
                res.status(200).send(i18n);
                res.end();

            } else {
                ChangeI18nLocaleMiddleware.logger.trace("ChangeI18nLocaleMiddleware :  La locale demandée " + req.params.i18n + "n'existe pas");
                let err = new TechnicalError("ERR_TECH_UNKNOWN", {
                    errorMessage: "La locale '" + req.params.i18n + "' n\'existe pas",
                    httpStatus: 200
                });
                res.json(NodeApiResultBuilder.buildError(err));
                res.end();
            }
        });

        this.prefix = "/changeLanguage/:i18n";
    }
}

// ------------------------------------------------------------------------------------------------------------------- //
//                                      SetExpandedLayoutMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
export class SetExpandedLayoutMiddleware extends AbstractHornetMiddleware {

    private static logger: Logger = Utils.getLogger("hornet-js-core.middlewares.SetExpandedLayoutMiddleware");

    constructor() {

        super((req, res, next: Function) => {
            SetExpandedLayoutMiddleware.logger.trace("SetLayoutMiddleware : set isExpandedLayout appSharedProps with value:", req.body.isExpandedLayout);
            Utils.appSharedProps.set("isExpandedLayout", req.body.isExpandedLayout);
            res.type("application/json");
            res.status(200).send({isExpandedLayout: req.body.isExpandedLayout});
            res.end();
        });

        this.prefix = "/setExpandedLayout";
    }
}

// ------------------------------------------------------------------------------------------------------------------- //
//                                      IsExpandedLayoutMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
export class IsExpandedLayoutMiddleware extends AbstractHornetMiddleware {

    private static logger: Logger = Utils.getLogger("hornet-js-core.middlewares.IsExpandedLayoutMiddleware");

    constructor() {

        super((req, res, next: Function) => {
            let isExpandedLayout = Utils.appSharedProps.get("isExpandedLayout");
            IsExpandedLayoutMiddleware.logger.trace("IsExpandedLayoutMiddleware : get isExpandedLayout appSharedProps: ", isExpandedLayout);
            res.type("application/json");
            res.status(200).send({isExpandedLayout: isExpandedLayout});
            res.end();
        });

        this.prefix = "/isExpandedLayout";
    }
}

// ------------------------------------------------------------------------------------------------------------------- //
//                                      RouterServerMiddleware                                                         //
// ------------------------------------------------------------------------------------------------------------------- //
import { RouterServer } from "src/routes/router-server";

export class RouterServerMiddleware extends AbstractHornetMiddleware {
    private router: RouterServer;

    constructor() {
        super();
        let appConfig = AbstractHornetMiddleware.APP_CONFIG;
        this.router = new RouterServer(appConfig.defaultRoutesClass, appConfig.routesLoaderfn, appConfig.routesLoaderPaths, appConfig.routesDataContext);
    }

    public insertMiddleware(app) {
        app.use(this.router.pageMiddleware());
        app.use(Utils.config.getOrDefault("fullSpa.name", AbstractHornetMiddleware.APP_CONFIG.routesDataContext), this.router.dataMiddleware());
    }
}

// ------------------------------------------------------------------------------------------------------------------- //
//                                      UserAccessSecurityMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
import { AuthUtils } from "hornet-js-utils/src/authentication-utils";
import { SecurityError } from "hornet-js-utils/src/exception/security-error";
import { NotFoundError } from "hornet-js-utils/src/exception/not-found-error";

export class UserAccessSecurityMiddleware extends AbstractHornetMiddleware {
    private static logger: Logger = Utils.getLogger("hornet-js-core.middlewares.UserAccessSecurityMiddleware");

    constructor() {
        super((req, res, next) => {
            let routesAuthorization = Utils.getCls("hornet.routeAuthorization");

            if (!AuthUtils.isAllowed(req.user, routesAuthorization)) {
                let e: TechnicalError;
                if (isEnvProduction) {
                    e = new NotFoundError();
                }
                e = new SecurityError();
                UserAccessSecurityMiddleware.logger.trace("Tentative d'accès à une route non autorisée", req.url, e.reportId);
                throw e;
            }
            next();
        });
    }
}

// ------------------------------------------------------------------------------------------------------------------- //
//                                      MenuConfigMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
export class MenuConfigMiddleware extends AbstractHornetMiddleware {
    constructor() {
        super((req, res, next) => {
            Utils.setCls("hornet.menuConfig", AbstractHornetMiddleware.APP_CONFIG.menuConfig);
            next();
        });
    }
}

// ------------------------------------------------------------------------------------------------------------------- //
//                                      DataRenderingMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
import { RouteInfos, DataRouteInfos } from "src/routes/abstract-routes";
import { AsyncExecutor } from "src/executor/async-executor";
import { AsyncElement } from "src/executor/async-element";
import { NodeApiResultBuilder } from "src/services/service-api-results";
import { ValidationError } from "hornet-js-utils/src/exception/validation-error";
import { HornetResult } from "src/result/hornet-result";
import { ResultJSON } from "src/result/result-json";

export class DataRenderingMiddleware extends AbstractHornetMiddleware {
    private static logger: Logger = Utils.getLogger("hornet-js-core.middlewares.DataRenderingMiddleware");

    constructor() {
        super((req: Request, res: Response, next: Function) => {
            try {
                let routeInfos: RouteInfos = Utils.getCls("hornet.routeInfos");

                // route de type 'DATA' uniquement
                if (Utils.getCls("hornet.routeType") === RouteType.DATA) {

                    let dataRouteInfos = routeInfos as DataRouteInfos;

                    if (!dataRouteInfos) {
                        let mess = "DataRouteInfos inexistant pour l'url : " + req.originalUrl;
                        DataRenderingMiddleware.logger.warn(mess);
                        throw new TechnicalError("ERR_TECH_UNKNOWN", {errorMessage: mess, httpStatus: 200});

                    } else {

                        let executor = new AsyncExecutor();
                        executor.addElement(new AsyncElement((next: (err?: any, data?: any) => void) => {
                            let action = new (dataRouteInfos.getAction())();
                            action.req = req;
                            action.res = res;
                            action.attributes = routeInfos.getAttributes();
                            if (dataRouteInfos.getService()) {
                                action.service = new (dataRouteInfos.getService() as Class<any>)();
                            }

                            let validator = action.getDataValidator();
                            if (validator) {
                                let data = _.cloneDeep(action.getPayload());

                                let validationRes = validator.validate(data);

                                if (!validationRes.valid) {
                                    DataRenderingMiddleware.logger.warn("Données invalides (la validation aurait dû être effectuée côté client) : ", validationRes.errors);
                                    throw new ValidationError();
                                }
                            }

                            let exec: Promise<any> = action.execute();

                            exec.then((result: any | HornetResult) => {
                                let newResult: HornetResult = (result instanceof HornetResult) ? result : new ResultJSON({data: result});
                                return newResult.manageResponse(res);
                            }).then((send) => {
                                if (send) {
                                    res.end();
                                }
                            }).catch((error) => {
                                DataRenderingMiddleware.logger.error("Erreur de service..." + error);
                                next(error);
                            });
                        }));

                        executor.on("end", (err) => {
                            if (err) {
                                next(err);
                            }
                        });
                        executor.execute();
                    }
                }

            } catch (e) {
                next(e);
            }
        });
    }
}

import { BaseError } from "hornet-js-utils/src/exception/base-error";
import { BusinessError } from "hornet-js-utils/src/exception/business-error";
import { TechnicalError } from "hornet-js-utils/src/exception/technical-error";
import { RequestHandler } from "express";
import { Request } from "express";
import { Response } from "express";
import { ErrorRequestHandler } from "express";

// ------------------------------------------------------------------------------------------------------------------- //
//                                      UnmanagedDataErrorMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
export class UnmanagedDataErrorMiddleware extends AbstractHornetMiddleware {
    private static logger: Logger = Utils.getLogger("hornet-js-core.middlewares.UnmanagedDataErrorMiddleware");

    constructor() {
        super((err, req, res, next: any) => {
            // route de type 'DATA' uniquement
            if (Utils.getCls("hornet.routeType") === RouteType.DATA) {
                sanitizeErrorThrownInDomain(err);

                if (!(err instanceof BaseError)) {
                    err = new TechnicalError("ERR_TECH_UNKNOWN", {errorMessage: err.message, httpStatus: 200}, err);
                }

                if (err instanceof TechnicalError) {
                    UnmanagedDataErrorMiddleware.logger.error("ERREUR technique [" + err.code + "] - reportId [" + err.reportId + "] : ", err);
                } else if (err instanceof BusinessError) {
                    UnmanagedDataErrorMiddleware.logger.error("ERREUR métier [" + err.code + "] - : ", err);
                } else {
                    UnmanagedDataErrorMiddleware.logger.error("ERREUR [" + err.code + "] - : ", err);
                }

                // res.status(500);
                res.json(NodeApiResultBuilder.buildError(err));
                res.end();
                if (err.status && typeof err.status === "number") {
                    res.status(err.status);
                }
            } else {
                UnmanagedDataErrorMiddleware.logger.error("ERREUR technique [" + err.code + "] - reportId [" + err.reportId + "] : ", err);
                if (err.status && typeof err.status === "number") {
                    res.status(err.status);
                } else {
                    res.status(500);
                }
                res.end();
            }
        });
    }
}

export const DEFAULT_HORNET_MIDDLEWARES: Array<Class<AbstractHornetMiddleware>> = [
    HornetContextInitializerMiddleware,

    LoggerTIDMiddleware,
    SecurityMiddleware,
    WelcomePageRedirectMiddleware,
    WithoutSlashPageRedirectMiddleware,
    StaticNodeHttpHeaderMiddleware,
    StaticPathMiddleware,
    StaticPathErrorMiddleware,
    BodyParserJsonMiddleware,
    BodyParserUrlEncodedMiddleware,

    // MockManagerMiddleware,
    SessionMiddleware,
    InternationalizationMiddleware,
    ChangeI18nLocaleMiddleware,
    LoggerUserMiddleware,
    CsrfMiddleware,
    MulterMiddleware,
    SetExpandedLayoutMiddleware,
    IsExpandedLayoutMiddleware,

    MenuConfigMiddleware,
    RouterServerMiddleware,
    UserAccessSecurityMiddleware,
    DataRenderingMiddleware,

    UnmanagedDataErrorMiddleware
];

export class HornetMiddlewareList {

    public list = [];

    constructor(middlewares: Array<Class<AbstractHornetMiddleware>> = DEFAULT_HORNET_MIDDLEWARES) {
        middlewares.forEach((middleware) => {
            this.list.push(middleware);
        });
    }

    addBefore(newMiddleware: Class<AbstractHornetMiddleware>, middleware: Class<AbstractHornetMiddleware>) {
        let idx = this.list.indexOf(middleware);
        if (idx === -1) {
            throw new Error("Le middleware de base n'a pas été trouvé dans le tableau de middlewares " +
                ">> impossible d'insérer le nouveau middleware avant.");
        }
        this.list.splice(idx, 0, newMiddleware);
        return this;
    }

    addAfter(newMiddleware: Class<AbstractHornetMiddleware>, middleware: Class<AbstractHornetMiddleware>) {
        let idx = this.list.indexOf(middleware);
        if (idx === -1) {
            throw new Error("Le middleware de base n'a pas été trouvé dans le tableau de middlewares " +
                ">> impossible d'insérer le nouveau middleware après.");
        }
        this.list.splice(idx + 1, 0, newMiddleware);
        return this;
    }

    remove(middleware: Class<AbstractHornetMiddleware>) {
        let idx = this.list.indexOf(middleware);
        if (idx === -1) {
            throw new Error("Le middleware n'a pas été trouvé dans le tableau de middlewares " +
                ">> suppression impossible.");
        }
        this.list.splice(idx, 1);
        return this;
    }
}
