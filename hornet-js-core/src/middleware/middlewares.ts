import utils = require("hornet-js-utils");
import ServerConfiguration = require("src/server-conf");
import path = require("path");
var isEnvProduction:boolean = (process.env.NODE_ENV === "production");

function isSecurityEnabled(envProduction:boolean, logger):boolean {
    let enabled:boolean = false;
    if (utils.config.get("security")) {
        if (utils.config.get("security.enabled") || envProduction) {
            enabled = true;
            logger.info("SECURITY MIDDLEWARE CONFIGURATION :  Configuration de la sécurité...");
        } else {
            logger.warn("SECURITY MIDDLEWARE CONFIGURATION : La sécurité est désactivé!!!");
        }
    } else {
        logger.warn("SECURITY MIDDLEWARE CONFIGURATION : La sécurité n'est pas configurée!!!");
    }
    return enabled;
}

function checkSecurityConfiguration(key:string, enabledKey:boolean, middlewareName:string, logger):boolean {
    let enabled:boolean = false;
    if (utils.config.has(key)) {
        if (enabledKey) {
            key = key + ".enabled";
        }

        if (utils.config.getOrDefault(key, true)) {
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

// ------------------------------------------------------------------------------------------------------------------- //
/**
 * Classe abstraite de gestion d'un middleware dans une application Hornet
 * Cette classe doit être héritée par chaque middleware
 *
 * Attention : la classe héritant de AbstractHornetMiddleware doit définir le constructeur suivant :
 *          constructor(appConfig:ServerConfiguration) {
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
    protected appConfig:ServerConfiguration;
    protected prefix:string;
    protected middlewareFunction:Function;

    /**
     * Constructeur
     *
     * @param appConfig
     * @param prefix
     * @param middlewareFunction
     */
    constructor(appConfig:ServerConfiguration, prefix?:string, middlewareFunction?:Function) {
        this.appConfig = appConfig;
        this.prefix = prefix;
        this.middlewareFunction = middlewareFunction;
    }

    /**
     * Méthode appelée automatiquement lors de l'initialisation du serveur afin d'ajouter un middleware
     * @param app
     */
    public insertMiddleware(app) {
        if (this.prefix !== null) {
            app.use(this.prefix, this.middlewareFunction);
        } else {
            app.use(this.middlewareFunction);
        }
    }
}

// ------------------------------------------------------------------------------------------------------------------- //
//                                      LoggerTIDMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
import uuid = require("node-uuid");
export class LoggerTIDMiddleware extends AbstractHornetMiddleware {
    constructor(appConfig:ServerConfiguration) {
        super(appConfig, null, (req, res, next) => {
            var tid = uuid.v4().substr(0, 8);

            var callbacksStorage = utils.getContinuationStorage();
            // wrap the events from request and response
            callbacksStorage.bindEmitter(req);
            callbacksStorage.bindEmitter(res);

            // run following middleware in the scope of the namespace we created
            callbacksStorage.run(function () {
                // set tid on the namespace, makes it available for all continuations
                callbacksStorage.set("tid", tid);
                next();
            });
        });
    }
}

// ------------------------------------------------------------------------------------------------------------------- //
//                                      LoggerUserMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
export class LoggerUserMiddleware extends AbstractHornetMiddleware {
    private static logger = utils.getLogger("hornet-js-core.middlewares.LoggerUserMiddleware");

    constructor(appConfig:ServerConfiguration) {
        super(appConfig, null, (req, res, next) => {

            var callbacksStorage = utils.getContinuationStorage();
            // wrap the events from request and response
            callbacksStorage.bindEmitter(req);
            callbacksStorage.bindEmitter(res);

            var user = req.user ? req.user.name : null;
            // run following middleware in the scope of the namespace we created
            callbacksStorage.run(function () {
                // set tid on the namespace, makes it available for all continuations
                callbacksStorage.set("user", user);
                next();
            });
        });
    }
}


// ------------------------------------------------------------------------------------------------------------------- //
//                                      WelcomePageRedirectMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
var parseUrl = require("parseurl");
export class WelcomePageRedirectMiddleware extends AbstractHornetMiddleware {
    constructor(appConfig:ServerConfiguration) {
        var contextPath = utils.buildContextPath("/").replace(/(^.*)([^\/]+)\/+$/g, "$1$2");
        var welcomePage = utils.buildContextPath(utils.appSharedProps.get("welcomePageUrl")).replace(/(^.*)([^\/]+)\/+$/g, "$1$2");
        super(appConfig, null, (req, res, next) => {
            var pathname = parseUrl.original(req).pathname.replace(/(^.*)([^\/]+)\/+$/g, "$1$2");
            if (pathname === contextPath && welcomePage !== contextPath) {
                return res.redirect(welcomePage);
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
    private static logger = utils.getLogger("hornet-js-core.middlewares.StaticNodeHttpHeaderMiddleware");

    constructor(appConfig:ServerConfiguration) {
        var staticUrl = utils.buildStaticPath("/").replace(utils.getContextPath(), "");
        super(appConfig, staticUrl, (req, res, next) => {
            res.setHeader("X-Static-From", "app");
            next();
        });
    }
}


// ------------------------------------------------------------------------------------------------------------------- //
//                                      StaticPathMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
import express = require("express");
export class StaticPathMiddleware extends AbstractHornetMiddleware {
    private static logger = utils.getLogger("hornet-js-core.middlewares.StaticPathMiddleware");

    constructor(appConfig:ServerConfiguration) {
        var staticPath:string = path.join(appConfig.serverDir, appConfig.staticPath);
        var staticUrl = utils.buildStaticPath("/").replace(utils.getContextPath(), "");
        StaticPathMiddleware.logger.info("Emplacement des ressources statiques '" + staticUrl + "' :", staticPath);
        super(appConfig, staticUrl, express.static(staticPath));
    }
}


// ------------------------------------------------------------------------------------------------------------------- //
//                                      BodyParserJsonMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
import bodyParser = require("body-parser");
export class BodyParserJsonMiddleware extends AbstractHornetMiddleware {
    constructor(appConfig:ServerConfiguration) {
        super(appConfig, null, bodyParser.json());
    }
}


// ------------------------------------------------------------------------------------------------------------------- //
//                                      BodyParserUrlEncodedMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
export class BodyParserUrlEncodedMiddleware extends AbstractHornetMiddleware {
    constructor(appConfig:ServerConfiguration) {
        super(appConfig, null, bodyParser.urlencoded({ // to support URL-encoded bodies
            extended: true
        }));
    }
}


// ------------------------------------------------------------------------------------------------------------------- //
//                                      SessionMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
import sessionManager = require("src/session/session-manager");
export class SessionMiddleware extends AbstractHornetMiddleware {
    constructor(appConfig:ServerConfiguration) {
        var sessionConfiguration = {
            store: appConfig.sessionStore || null,
            // secret: utils.config.get('cookie.secret'),
            secret: null,
            cookie: {
                route: utils.config.getOrDefault("server.route", null),
                domain: utils.config.getOrDefault("cookie.domain", null),
                path: utils.config.getOrDefault("cookie.path", utils.buildContextPath("/")),
                httpOnly: utils.config.getOrDefault("cookie.httpOnly", true),
                secure: (isEnvProduction && utils.config.getOrDefault("cookie.secure", false))
            },
            sessionTimeout: utils.config.getOrDefault("server.sessionTimeout", 1800000),
            alwaysSetCookie: utils.config.getOrDefault("cookie.alwaysSetCookie", false),
            saveUnmodifiedSession: null // laisse le session-manager décider en fonction du type de store
        };
        super(appConfig, null, sessionManager.middleware(sessionConfiguration));
    }
}


// ------------------------------------------------------------------------------------------------------------------- //
//                                      MulterMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
import multer = require("multer");
export class MulterMiddleware extends AbstractHornetMiddleware {
    constructor(appConfig:ServerConfiguration) {
        super(appConfig, null, multer({
            // dest: './uploads/',
            inMemory: true,
            limits: {
                fileSize: utils.config.getOrDefault("server.uploadFileSize", 10000)
            },
            /*putSingleFilesInArray à true sera le comportemlent par défaut des prochaines versions (voir documentation)*/
            putSingleFilesInArray: true
        }));
    }
}


// ------------------------------------------------------------------------------------------------------------------- //
//                                      SecurityMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
import hpp = require("hpp");
var helmet = require("helmet");
export class SecurityMiddleware extends AbstractHornetMiddleware {
    private static logger = utils.getLogger("hornet-js-core.middlewares.SecurityMiddleware");

    constructor(appConfig:ServerConfiguration) {
        super(appConfig);
    }

    public insertMiddleware(app) {
        if (isSecurityEnabled(isEnvProduction, SecurityMiddleware.logger)) {
            // Enlève le header 'x-powered-by' pour éviter de montrer que le site est généré par express
            app.disable("x-powered-by");

            this.hppConfiguration(app);
            this.ienoopenConfiguration(app);
            this.noSniffConfiguration(app);
            this.cspConfiguration(app);
            this.frameguardConfiguration(app);
            this.xssFilterConfiguration(app);
            this.hpkpConfiguration(app);
            this.hstsConfiguration(app);
        }
    }

    private hppConfiguration(app) {
        // Suppression des doublons de paramètres GET
        if (checkSecurityConfiguration("security.hpp", false, "HPP 'HTTP Parameter Pollution'", SecurityMiddleware.logger)) {
            app.use(hpp());
        }
    }

    private ienoopenConfiguration(app) {

        if (checkSecurityConfiguration("security.ienoopen", false, "ienoopen 'IE, restrict untrusted HTML: ieNoOpen'", SecurityMiddleware.logger)) {
            // Pour IE8+: ajout le header X-Download-Options
            app.use(helmet.ienoopen());
        }
    }

    private noSniffConfiguration(app) {

        if (checkSecurityConfiguration("security.noSniff", false, "noSniff 'Don't infer the MIME type: noSniff'", SecurityMiddleware.logger)) {
            // Pour IE8+: ajout le header X-Download-Options
            app.use(helmet.noSniff());
        }
    }

    private cspConfiguration(app) {
        // Ajout des headers "content security" pour empêcher le chargement de scripts venant d'autres domaines
        if (checkSecurityConfiguration("security.csp", true, "CSP 'Content Security Policy'", SecurityMiddleware.logger)) {
            var directives:any = {
                // defaultSrc: utils.config.getOrDefault("security.csp.defaultSrc", ["'self'", "'unsafe-inline'", "'unsafe-eval'"]),
                baseUri: utils.config.getOrDefault("security.csp.baseUri", ["'self'"]),
                childSrc: utils.config.getOrDefault("security.csp.childSrc", ["'self'"]),
                connectSrc: utils.config.getOrDefault("security.csp.connectSrc", ["'self'"]),
                fontSrc: utils.config.getOrDefault("security.csp.fontSrc", ["'self'"]),
                formAction: utils.config.getOrDefault("security.csp.formAction", ["'self'"]),
                frameAncestors: utils.config.getOrDefault("security.csp.frameAncestors", ["'self'"]),
                frameSrc: utils.config.getOrDefault("security.csp.childSrc", ["'self'"]), // deprecated gestion ancien navigateur
                imgSrc: utils.config.getOrDefault("security.csp.imgSrc", ["'self'"]),
                manifestSrc: utils.config.getOrDefault("security.csp.manifestSrc", ["'self'"]),
                mediaSrc: utils.config.getOrDefault("security.csp.mediaSrc", ["'self'"]),
                objectSrc: utils.config.getOrDefault("security.csp.objectSrc", ["'self'"]),
                referrer: utils.config.getOrDefault("security.csp.referrer", "origin-when-cross-origin"),
                reflectedXss: utils.config.getOrDefault("security.csp.reflectedXss", "block"),
                reportUri: utils.config.getOrDefault("security.csp.reportUri", ""),
                scriptSrc: utils.config.getOrDefault("security.csp.scriptSrc", ["'self'", "'unsafe-inline'", "'unsafe-eval'"]),
                styleSrc: utils.config.getOrDefault("security.csp.styleSrc", ["'self'", "'unsafe-inline'"])
            };
            var sandbox = utils.config.getOrDefault("security.csp.sandbox", false); // TODO A traiter spécifiquement
            if (sandbox) {
                directives.sandbox = sandbox;
            }
            var pluginTypes = utils.config.getOrDefault("security.csp.pluginTypes", false);
            if (pluginTypes) {
                directives.pluginTypes = pluginTypes;
            }
            var blockAllMixedContent = utils.config.getOrDefault("security.csp.blockAllMixedContent", true);
            if (blockAllMixedContent) {
                directives.blockAllMixedContent = blockAllMixedContent;
            }
            var upgradeInsecureRequests = utils.config.getOrDefault("security.csp.upgradeInsecureRequests", false);
            if (upgradeInsecureRequests) {
                directives.upgradeInsecureRequests = upgradeInsecureRequests;
            }
            app.use(helmet.contentSecurityPolicy({
                directives: directives,
                disableAndroid: utils.config.getOrDefault("security.csp.disableAndroid", false),
                reportOnly: utils.config.getOrDefault("security.csp.reportOnly", false),
                setAllHeaders: utils.config.getOrDefault("security.csp.setAllHeaders", true)
            }));
        }
    }

    private frameguardConfiguration(app) {
        // Pour empêcher la mise en iframe
        if (checkSecurityConfiguration("security.frameguard", true, "frameguard", SecurityMiddleware.logger)) {
            app.use(helmet.frameguard(
                utils.config.getOrDefault("security.frameguard.mode", "deny"),
                utils.config.getOrDefault("security.frameguard.allowFromPattern", "")));
        }
    }

    private xssFilterConfiguration(app) {

        if (checkSecurityConfiguration("security.xss", true, "XssFilter 'Cross-site scripting Filter'", SecurityMiddleware.logger)) {
            // Ajoute le header X-XSS-Protection pour essayer de protéger contre des attaques XSS simples
            // This has some security problems for old IE!
            app.use(helmet.xssFilter({setOnOldIE: utils.config.getOrDefault("security.xss.setOnOldIE", true)}));
        }
    }

    private hpkpConfiguration(app) {
        // Ajoute les headers HTTP Public Key Pinning pour sécuriser les connexions SSL
        if (checkSecurityConfiguration("security.hpkp", true, "HPKP 'HTTP Public Key Pinning'", SecurityMiddleware.logger)) {
            app.use(helmet.publicKeyPins({
                maxAge: utils.config.getOrDefault("security.hpkp.maxAge", 7776000000),
                sha256s: utils.config.get("security.hpkp.sha256s"),
                includeSubdomains: utils.config.getOrDefault("security.hpkp.includeSubdomains", true),
                reportUri: utils.config.getOrDefault("security.hpkp.reportUri", null),
                reportOnly: utils.config.getOrDefault("security.hpkp.reportOnly", false)
            }));
        }
    }

    private hstsConfiguration(app) {
        if (checkSecurityConfiguration("security.hsts", true, "HSTS 'HTTP Strict-Transport-Security'", SecurityMiddleware.logger)) {
            // Ajoute le header Strict-Transport-Security pour demander au navigateur client un accès au site en https
            app.use(helmet.hsts({
                // Must be at least 18 weeks to be approved by Google
                maxAge: utils.config.getOrDefault("security.hsts.maxAge", 10886400000),
                // Must be enabled to be approved by Google
                includeSubDomains: utils.config.getOrDefault("security.hsts.includeSubDomains", true),
                preload: utils.config.getOrDefault("security.hsts.preload", false)
            }));
        }
    }
}


// ------------------------------------------------------------------------------------------------------------------- //
//                                      CsrfMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
var _ = utils._;
export class CsrfMiddleware extends AbstractHornetMiddleware {
    private static logger = utils.getLogger("hornet-js-core.middlewares.CsrfMiddleware");
    static HEADER_CSRF_NAME = "x-csrf-token";
    static CSRF_SESSION_KEY = "security.csrf";

    constructor() {
        super(null);
    }

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
    static generateToken():string {
        var newToken = Math.random().toString(36).slice(2);
        CsrfMiddleware.logger.trace("Génération d'un token CSRF:", newToken);
        return newToken;
    }

    /**
     * Middleware express pour sécuriser les verbs HTTP PUT, POST, PATCH et DELETE d'attaques CSRF
     * @param req
     * @param res
     * @param next
     */
    static middleware(req, res:director.DirectorResponse, next) {
        if (req.method === "PUT" || req.method === "POST" || req.method === "PATCH" || req.method === "DELETE") {
            var incomingCsrf = req.headers[CsrfMiddleware.HEADER_CSRF_NAME];
            if (_.isUndefined(incomingCsrf)) {
                CsrfMiddleware.logger.trace(CsrfMiddleware.HEADER_CSRF_NAME, "non present, recherche dans le body de la requête");
                incomingCsrf = req.body && req.body[CsrfMiddleware.HEADER_CSRF_NAME];
            }
            var sessionCsrf = req.getSession().getAttribute(CsrfMiddleware.CSRF_SESSION_KEY);

            var valid = CsrfMiddleware.isTokenValid(incomingCsrf, sessionCsrf);
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

            // On propose dans la requête une fonction pour générer un token et le mettre en session
            // Cette fonction est utilisée par le router-view pour exposer le token au client
            req.generateCsrfToken = function () {
                var token = req.getSession().getAttribute(CsrfMiddleware.CSRF_SESSION_KEY);
                if (token != null) {
                    CsrfMiddleware.logger.debug("Token CSRF already exists in session");
                } else {
                    token = CsrfMiddleware.generateToken();
                    req.getSession().setAttribute(CsrfMiddleware.CSRF_SESSION_KEY, token);
                }
                return token;

            };
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
    static isTokenValid(incomingCsrf:string, sessionCsrf:string) {
        CsrfMiddleware.logger.trace("incomingCsrf =", incomingCsrf, "sessionCsrf =", sessionCsrf);

        return incomingCsrf === sessionCsrf;
    }

}


// ------------------------------------------------------------------------------------------------------------------- //
//                                      MockManagerMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
import director = require("director");
export class MockManagerMiddleware extends AbstractHornetMiddleware {
    private static logger = utils.getLogger("hornet-js-core.middlewares.MockManagerMiddleware");

    constructor(appConfig:ServerConfiguration) {
        super(appConfig);
    }

    public insertMiddleware(app) {
        if (utils.config.getOrDefault("mock.enabled", false)) {
            var routes = this.appConfig.serverDir + utils.config.get("mock.routes");

            MockManagerMiddleware.logger.warn("LE MODE BOUCHON EST ACTIF");
            MockManagerMiddleware.logger.warn("MODE BOUCHON: Toutes les url commencant par '" +
                utils.config.getOrDefault("mock.defaultServices.host", "localhost:8888") +
                utils.buildContextPath("/hornet-mock") +
                "' seront traitées par le fichier de routes suivants :", routes);

            /*
             * Création du routeur
             * Ajout des routes au routeur
             * Ajout du routeur au server
             */
            var router = new director.http.Router();
            require(routes).build(router);
            app.use(function (req, res, next) {
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                next();
            });
            app.use("/hornet-mock", (req, res, next) => {
                router.attach(function () {
                    this.next = next;
                });
                router.dispatch(req, res, function (err) {
                    // When a 404, just forward on to next Express middleware.
                    if (err && err.status === 404) {
                        next();
                    }
                });
            });

        } else {
            MockManagerMiddleware.logger.debug("Mode mock disabled");
        }
    }
}


// ------------------------------------------------------------------------------------------------------------------- //
//                                      RouterDataMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
import RouterData = require("src/routes/router-data");
export class RouterDataMiddleware extends AbstractHornetMiddleware {
    constructor(appConfig:ServerConfiguration) {
        super(appConfig, utils.config.getOrDefault("fullSpa.name", "/services"), new RouterData(appConfig).middleware());
    }
}


// ------------------------------------------------------------------------------------------------------------------- //
//                                      RouterViewMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
import RouterView = require("src/routes/router-view");
export class RouterViewMiddleware extends AbstractHornetMiddleware {
    constructor(appConfig:ServerConfiguration) {
        super(appConfig, null, new RouterView(appConfig).middleware());
    }
}


// ------------------------------------------------------------------------------------------------------------------- //
//                                      ErrorMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
export class ErrorMiddleware extends AbstractHornetMiddleware {
    private static logger = utils.getLogger("hornet-js-core.middlewares.ErrorMiddleware");

    constructor(appConfig:ServerConfiguration) {
        super(appConfig, null, (err, req, res, next:any) => {
            ErrorMiddleware.logger.error("ERREUR non gérée par l'appli : ", err, " lors du traitement de la requete :", req);

            // send back a 500 with a generic
            res.status(500);
            res.send(err);
        });
    }
}


export var DEFAULT_HORNET_MIDDLEWARES:Array<typeof AbstractHornetMiddleware> = [
    LoggerTIDMiddleware,
    SecurityMiddleware,
    WelcomePageRedirectMiddleware,
    StaticNodeHttpHeaderMiddleware,
    StaticPathMiddleware,
    BodyParserJsonMiddleware,
    BodyParserUrlEncodedMiddleware,
    MockManagerMiddleware,
    SessionMiddleware,
    LoggerUserMiddleware,
    CsrfMiddleware,
    MulterMiddleware,
    RouterDataMiddleware,
    RouterViewMiddleware,
    ErrorMiddleware
];

export class HornetMiddlewareList extends Array<typeof AbstractHornetMiddleware> {
    constructor(middlewares:Array<typeof AbstractHornetMiddleware> = DEFAULT_HORNET_MIDDLEWARES) {
        super();
        middlewares.forEach((middleware) => {
            this.push(middleware);
        });
    }

    addMiddlewareBefore(newMiddleware:typeof AbstractHornetMiddleware, middleware:typeof AbstractHornetMiddleware) {
        var idx = this.indexOf(middleware);
        if (idx === -1) {
            throw new Error("Le middleware de base n'a pas été trouvé dans le tableau de middlewares " +
                ">> impossible d'insérer le nouveau middleware avant.");
        }
        this.splice(idx, 0, newMiddleware);
        return this;
    }

    addMiddlewareAfter(newMiddleware:typeof AbstractHornetMiddleware, middleware:typeof AbstractHornetMiddleware) {
        var idx = this.indexOf(middleware);
        if (idx === -1) {
            throw new Error("Le middleware de base n'a pas été trouvé dans le tableau de middlewares " +
                ">> impossible d'insérer le nouveau middleware après.");
        }
        this.splice(idx + 1, 0, newMiddleware);
        return this;
    }

    removeMiddleware(middleware:typeof AbstractHornetMiddleware) {
        var idx = this.indexOf(middleware);
        if (idx === -1) {
            throw new Error("Le middleware de base n'a pas été trouvé dans le tableau de middlewares " +
                ">> impossible d'insérer le nouveau middleware après.");
        }
        this.splice(idx, 1);
        return this;
    }
}
