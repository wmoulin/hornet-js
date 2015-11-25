var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>
var utils = require("hornet-js-utils");
var path = require("path");
var isEnvProduction = (process.env["NODE_ENV"] === "production");
function isSecurityEnabled(envProduction, logger) {
    var enabled = false;
    if (utils.config.get("security")) {
        if (utils.config.get("security.enabled") || envProduction) {
            enabled = true;
            logger.info("SECURITY MIDDLEWARE CONFIGURATION :  Configuration de la sécurité...");
        }
        else {
            logger.warn("SECURITY MIDDLEWARE CONFIGURATION : La sécurité est désactivé!!!");
        }
    }
    else {
        logger.warn("SECURITY MIDDLEWARE CONFIGURATION : La sécurité n'est pas configurée!!!");
    }
    return enabled;
}
function checkSecurityConfiguration(key, enabledKey, middlewareName, logger) {
    var enabled = false;
    if (utils.config.has(key)) {
        if (enabledKey) {
            key = key + ".enabled";
        }
        if (utils.config.getOrDefault(key, true)) {
            logger.debug("SECURITY MIDDLEWARE CONFIGURATION : ajout du middleware " + middlewareName);
            enabled = true;
        }
        else {
            logger.warn("SECURITY MIDDLEWARE CONFIGURATION : Le middleware " + middlewareName + " n'est pas activé");
        }
    }
    else {
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
var AbstractHornetMiddleware = (function () {
    /**
     * Constructeur
     *
     * @param appConfig
     * @param prefix
     * @param middlewareFunction
     */
    function AbstractHornetMiddleware(appConfig, prefix, middlewareFunction) {
        this.appConfig = appConfig;
        this.prefix = prefix;
        this.middlewareFunction = middlewareFunction;
    }
    /**
     * Méthode appelée automatiquement lors de l'initialisation du serveur afin d'ajouter un middleware
     * @param app
     */
    AbstractHornetMiddleware.prototype.insertMiddleware = function (app) {
        if (this.prefix !== null) {
            app.use(this.prefix, this.middlewareFunction);
        }
        else {
            app.use(this.middlewareFunction);
        }
    };
    return AbstractHornetMiddleware;
})();
exports.AbstractHornetMiddleware = AbstractHornetMiddleware;
// ------------------------------------------------------------------------------------------------------------------- //
//                                      LoggerTIDMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
var uuid = require("node-uuid");
var LoggerTIDMiddleware = (function (_super) {
    __extends(LoggerTIDMiddleware, _super);
    function LoggerTIDMiddleware(appConfig) {
        _super.call(this, appConfig, null, function (req, res, next) {
            var tid = uuid.v4().substr(0, 8);
            var callbacksStorage = utils.callbacksLocalStorage.getStorage();
            // wrap the events from request and response
            callbacksStorage.bindEmitter(req);
            callbacksStorage.bindEmitter(res);
            // run following middleware in the scope of the namespace we created
            callbacksStorage.run(function () {
                // set tid on the namespace, makes it available for all continuations
                callbacksStorage.set('tid', tid);
                next();
            });
        });
    }
    return LoggerTIDMiddleware;
})(AbstractHornetMiddleware);
exports.LoggerTIDMiddleware = LoggerTIDMiddleware;
// ------------------------------------------------------------------------------------------------------------------- //
//                                      LoggerUserMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
var LoggerUserMiddleware = (function (_super) {
    __extends(LoggerUserMiddleware, _super);
    function LoggerUserMiddleware(appConfig) {
        _super.call(this, appConfig, null, function (req, res, next) {
            var callbacksStorage = utils.callbacksLocalStorage.getStorage();
            // wrap the events from request and response
            callbacksStorage.bindEmitter(req);
            callbacksStorage.bindEmitter(res);
            var user = req.user ? req.user.name : null;
            // run following middleware in the scope of the namespace we created
            callbacksStorage.run(function () {
                // set tid on the namespace, makes it available for all continuations
                callbacksStorage.set('user', user);
                next();
            });
        });
    }
    LoggerUserMiddleware.logger = utils.getLogger("hornet-js-core.middlewares.LoggerUserMiddleware");
    return LoggerUserMiddleware;
})(AbstractHornetMiddleware);
exports.LoggerUserMiddleware = LoggerUserMiddleware;
// ------------------------------------------------------------------------------------------------------------------- //
//                                      DisableKeepAliveMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
var DisableKeepAliveMiddleware = (function (_super) {
    __extends(DisableKeepAliveMiddleware, _super);
    function DisableKeepAliveMiddleware(appConfig) {
        _super.call(this, appConfig, null, function (req, res, next) {
            res.setHeader("Connection", "close");
            next();
        });
    }
    return DisableKeepAliveMiddleware;
})(AbstractHornetMiddleware);
exports.DisableKeepAliveMiddleware = DisableKeepAliveMiddleware;
// ------------------------------------------------------------------------------------------------------------------- //
//                                      WelcomePageRedirectMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
var parseUrl = require('parseurl');
var WelcomePageRedirectMiddleware = (function (_super) {
    __extends(WelcomePageRedirectMiddleware, _super);
    function WelcomePageRedirectMiddleware(appConfig) {
        var contextPath = utils.buildContextPath("/").replace(/(^.*)([^\/]+)\/+$/g, "$1$2");
        var welcomePage = utils.buildContextPath(utils.appSharedProps.get("welcomePageUrl")).replace(/(^.*)([^\/]+)\/+$/g, "$1$2");
        _super.call(this, appConfig, null, function (req, res, next) {
            var pathname = parseUrl.original(req).pathname.replace(/(^.*)([^\/]+)\/+$/g, "$1$2");
            if (pathname === contextPath && welcomePage !== contextPath) {
                return res.redirect(welcomePage);
            }
            else {
                next();
            }
        });
    }
    return WelcomePageRedirectMiddleware;
})(AbstractHornetMiddleware);
exports.WelcomePageRedirectMiddleware = WelcomePageRedirectMiddleware;
// ------------------------------------------------------------------------------------------------------------------- //
//                                      StaticPathMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
var express = require("express");
var StaticPathMiddleware = (function (_super) {
    __extends(StaticPathMiddleware, _super);
    function StaticPathMiddleware(appConfig) {
        var staticPath = path.join(appConfig.serverDir, appConfig.staticPath);
        var staticUrl = utils.buildStaticPath("/").replace(utils.getContextPath(), "");
        StaticPathMiddleware.logger.info("Emplacement des ressources statiques '" + staticUrl + "' :", staticPath);
        _super.call(this, appConfig, staticUrl, express.static(staticPath));
    }
    StaticPathMiddleware.logger = utils.getLogger("hornet-js-core.middlewares.StaticPathMiddleware");
    return StaticPathMiddleware;
})(AbstractHornetMiddleware);
exports.StaticPathMiddleware = StaticPathMiddleware;
// ------------------------------------------------------------------------------------------------------------------- //
//                                      BodyParserJsonMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
var bodyParser = require("body-parser");
var BodyParserJsonMiddleware = (function (_super) {
    __extends(BodyParserJsonMiddleware, _super);
    function BodyParserJsonMiddleware(appConfig) {
        _super.call(this, appConfig, null, bodyParser.json());
    }
    return BodyParserJsonMiddleware;
})(AbstractHornetMiddleware);
exports.BodyParserJsonMiddleware = BodyParserJsonMiddleware;
// ------------------------------------------------------------------------------------------------------------------- //
//                                      BodyParserUrlEncodedMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
var BodyParserUrlEncodedMiddleware = (function (_super) {
    __extends(BodyParserUrlEncodedMiddleware, _super);
    function BodyParserUrlEncodedMiddleware(appConfig) {
        _super.call(this, appConfig, null, bodyParser.urlencoded({
            extended: true
        }));
    }
    return BodyParserUrlEncodedMiddleware;
})(AbstractHornetMiddleware);
exports.BodyParserUrlEncodedMiddleware = BodyParserUrlEncodedMiddleware;
// ------------------------------------------------------------------------------------------------------------------- //
//                                      SessionMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
var sessionManager = require("src/session/session-manager");
var SessionMiddleware = (function (_super) {
    __extends(SessionMiddleware, _super);
    function SessionMiddleware(appConfig) {
        var sessionConfiguration = {
            store: appConfig.sessionStore || null,
            //secret: utils.config.get('cookie.secret'),
            secret: null,
            cookie: {
                route: utils.config.getOrDefault("server.route", null),
                domain: utils.config.getOrDefault("cookie.domain", null),
                path: utils.config.getOrDefault("cookie.path", utils.buildContextPath("/")),
                httpOnly: utils.config.getOrDefault("cookie.httpOnly", true),
                secure: (isEnvProduction && utils.config.getOrDefault('cookie.secure', false))
            },
            sessionTimeout: utils.config.getOrDefault("server.sessionTimeout", 1800000),
            alwaysSetCookie: utils.config.getOrDefault("cookie.alwaysSetCookie", false),
            saveUnmodifiedSession: null // laisse le session-manager décider en fonction du type de store
        };
        _super.call(this, appConfig, null, sessionManager.middleware(sessionConfiguration));
    }
    return SessionMiddleware;
})(AbstractHornetMiddleware);
exports.SessionMiddleware = SessionMiddleware;
// ------------------------------------------------------------------------------------------------------------------- //
//                                      MulterMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
var multer = require("multer");
var MulterMiddleware = (function (_super) {
    __extends(MulterMiddleware, _super);
    function MulterMiddleware(appConfig) {
        _super.call(this, appConfig, null, multer({
            //dest: './uploads/',
            inMemory: true,
            limits: {
                fileSize: utils.config.getOrDefault("server.uploadFileSize", 10000)
            },
            /*putSingleFilesInArray à true sera le comportemlent par défaut des prochaines versions (voir documentation)*/
            putSingleFilesInArray: true
        }));
    }
    return MulterMiddleware;
})(AbstractHornetMiddleware);
exports.MulterMiddleware = MulterMiddleware;
// ------------------------------------------------------------------------------------------------------------------- //
//                                      SecurityMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
var hpp = require("hpp");
var helmet = require("helmet");
var SecurityMiddleware = (function (_super) {
    __extends(SecurityMiddleware, _super);
    function SecurityMiddleware(appConfig) {
        _super.call(this, appConfig);
    }
    SecurityMiddleware.prototype.insertMiddleware = function (app) {
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
    };
    SecurityMiddleware.prototype.hppConfiguration = function (app) {
        // Suppression des doublons de paramètres GET
        if (checkSecurityConfiguration("security.hpp", false, "HPP 'HTTP Parameter Pollution'", SecurityMiddleware.logger)) {
            app.use(hpp());
        }
    };
    SecurityMiddleware.prototype.ienoopenConfiguration = function (app) {
        if (checkSecurityConfiguration("security.ienoopen", false, "ienoopen 'IE, restrict untrusted HTML: ieNoOpen'", SecurityMiddleware.logger)) {
            // Pour IE8+: ajout le header X-Download-Options
            app.use(helmet.ienoopen());
        }
    };
    SecurityMiddleware.prototype.noSniffConfiguration = function (app) {
        if (checkSecurityConfiguration("security.noSniff", false, "noSniff 'Don't infer the MIME type: noSniff'", SecurityMiddleware.logger)) {
            // Pour IE8+: ajout le header X-Download-Options
            app.use(helmet.noSniff());
        }
    };
    SecurityMiddleware.prototype.cspConfiguration = function (app) {
        // Ajout des headers "content security" pour empêcher le chargement de scripts venant d'autres domaines
        if (checkSecurityConfiguration("security.csp", true, "CSP 'Content Security Policy'", SecurityMiddleware.logger)) {
            app.use(helmet.contentSecurityPolicy({
                defaultSrc: utils.config.getOrDefault("security.csp.defaultSrc", ["'self'", "'unsafe-inline'", "'unsafe-eval'"]),
                scriptSrc: utils.config.getOrDefault("security.csp.scriptSrc", false),
                styleSrc: utils.config.getOrDefault("security.csp.styleSrc", false),
                imgSrc: utils.config.getOrDefault("security.csp.imgSrc", false),
                connectSrc: utils.config.getOrDefault("security.csp.connectSrc", false),
                fontSrc: utils.config.getOrDefault("security.csp.fontSrc", false),
                objectSrc: utils.config.getOrDefault("security.csp.objectSrc", false),
                mediaSrc: utils.config.getOrDefault("security.csp.mediaSrc", false),
                frameSrc: utils.config.getOrDefault("security.csp.frameSrc", false),
                sandbox: utils.config.getOrDefault("security.csp.sandbox", false),
                reportUri: utils.config.getOrDefault("security.csp.reportUri", false),
                reportOnly: utils.config.getOrDefault("security.csp.reportOnly", false),
                setAllHeaders: utils.config.getOrDefault("security.csp.setAllHeaders", false),
                disableAndroid: utils.config.getOrDefault("security.csp.disableAndroid", false),
                safari5: utils.config.getOrDefault("security.csp.safari5", false)
            }));
        }
    };
    SecurityMiddleware.prototype.frameguardConfiguration = function (app) {
        // Pour empêcher la mise en iframe
        if (checkSecurityConfiguration("security.frameguard", true, "frameguard", SecurityMiddleware.logger)) {
            app.use(helmet.frameguard(utils.config.getOrDefault("security.frameguard.mode", "deny"), utils.config.getOrDefault("security.frameguard.allowFromPattern", "")));
        }
    };
    SecurityMiddleware.prototype.xssFilterConfiguration = function (app) {
        if (checkSecurityConfiguration("security.xss", true, "XssFilter 'Cross-site scripting Filter'", SecurityMiddleware.logger)) {
            // Ajoute le header X-XSS-Protection pour essayer de protéger contre des attaques XSS simples
            // This has some security problems for old IE!
            app.use(helmet.xssFilter({ setOnOldIE: utils.config.getOrDefault("security.xss.setOnOldIE", true) }));
        }
    };
    SecurityMiddleware.prototype.hpkpConfiguration = function (app) {
        // Ajoute les headers HTTP Public Key Pinning pour sécuriser les connexions SSL
        if (checkSecurityConfiguration("security.hpkp", true, "HPKP 'HTTP Public Key Pinning'", SecurityMiddleware.logger)) {
            app.use(helmet.publicKeyPins({
                maxAge: utils.config.getOrDefault("security.hpkp.maxAge", 7776000000),
                sha256s: utils.config.get("security.hpkp.sha256s"),
                includeSubdomains: utils.config.getOrDefault("security.hpkp.includeSubdomains", true),
                reportUri: utils.config.getOrDefault("security.hpkp.reportUri", null)
            }));
        }
    };
    SecurityMiddleware.prototype.hstsConfiguration = function (app) {
        if (checkSecurityConfiguration("security.hsts", true, "HSTS 'HTTP Strict-Transport-Security'", SecurityMiddleware.logger)) {
            // Ajoute le header Strict-Transport-Security pour demander au navigateur client un accès au site en https
            app.use(helmet.hsts({
                maxAge: utils.config.getOrDefault("security.hsts.maxAge", 10886400000),
                includeSubdomains: utils.config.getOrDefault("security.hsts.includeSubdomains", true),
                preload: utils.config.getOrDefault("security.hsts.preload", false)
            }));
        }
    };
    SecurityMiddleware.prototype.csrfConfiguration = function (app) {
        if (checkSecurityConfiguration("security.csrf", true, "CSRF 'Cross-Site Request Forgery'", SecurityMiddleware.logger)) {
            CsrfMiddleware.maxTokensNumberPerSession = utils.config.getOrDefault("security.csrf.maxTokensPerSession", 10);
            app.use(CsrfMiddleware.middleware);
        }
    };
    SecurityMiddleware.logger = utils.getLogger("hornet-js-core.middlewares.SecurityMiddleware");
    return SecurityMiddleware;
})(AbstractHornetMiddleware);
exports.SecurityMiddleware = SecurityMiddleware;
// ------------------------------------------------------------------------------------------------------------------- //
//                                      CsrfMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
var _ = utils._;
var CsrfMiddleware = (function (_super) {
    __extends(CsrfMiddleware, _super);
    function CsrfMiddleware() {
        _super.call(this, null);
    }
    CsrfMiddleware.prototype.insertMiddleware = function (app) {
        if (isSecurityEnabled(isEnvProduction, CsrfMiddleware.logger)) {
            this.csrfConfiguration(app);
        }
    };
    CsrfMiddleware.prototype.csrfConfiguration = function (app) {
        if (checkSecurityConfiguration("security.csrf", true, "CSRF 'Cross-Site Request Forgery'", CsrfMiddleware.logger)) {
            CsrfMiddleware.maxTokensNumberPerSession = utils.config.getOrDefault("security.csrf.maxTokensPerSession", 10);
            app.use(CsrfMiddleware.middleware);
        }
    };
    Object.defineProperty(CsrfMiddleware, "maxTokensNumberPerSession", {
        get: function () {
            return CsrfMiddleware._MAX_TOKENS_NUMBER_PER_SESSION;
        },
        set: function (maxNumber) {
            CsrfMiddleware.logger.debug("Changement du nombre de tokens max par session:", maxNumber);
            CsrfMiddleware._MAX_TOKENS_NUMBER_PER_SESSION = maxNumber;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Retourne un nouveau token aléatoire
     * @return {string}
     */
    CsrfMiddleware.generateToken = function () {
        var newToken = Math.random().toString(36).slice(2);
        CsrfMiddleware.logger.trace("newToken:", newToken);
        return newToken;
    };
    /**
     * Middleware express pour sécuriser les verbs HTTP PUT, POST, PATCH et DELETE d'attaques CSRF
     * @param req
     * @param res
     * @param next
     */
    CsrfMiddleware.middleware = function (req, res, next) {
        if (req.method === "PUT" || req.method === "POST" || req.method === "PATCH" || req.method === "DELETE") {
            var incomingCsrf = req.headers[CsrfMiddleware.HEADER_CSRF_NAME];
            if (_.isUndefined(incomingCsrf)) {
                CsrfMiddleware.logger.trace(CsrfMiddleware.HEADER_CSRF_NAME, "non present, recherche dans le body de la requête");
                incomingCsrf = req.body && req.body[CsrfMiddleware.HEADER_CSRF_NAME];
            }
            var sessionCsrf = req.getSession().getAttribute("csrf");
            var existingTokenIndex = CsrfMiddleware._getIndexOfIncomingCsrf(incomingCsrf, sessionCsrf);
            if (existingTokenIndex >= 0) {
                // Le token est correcte, l'accès est autorisé
                //On génére un nouveau token
                var newToken = CsrfMiddleware.generateToken();
                // On le transmet en retour
                CsrfMiddleware.setTokenInHeader(newToken, res);
                // On écrase l'ancien token devenu invalide
                sessionCsrf[existingTokenIndex] = newToken;
                next();
            }
            else {
                CsrfMiddleware.logger.debug("Csrf mismatch, retourning 417 status");
                res.status(417);
                res.end();
            }
        }
        else {
            // Pas de sécurité csrf sur ce verb HTTP.
            // On propose dans la requête une fonction pour générer un tokken à la demande, à chaque génération le tokken est sauvegardé en session
            // Cette fonction est utilisée par le router-view notamment
            req.generateNewCsrfTokken = function () {
                return CsrfMiddleware._generateTokenAndPutItInSession(req.getSession());
            };
            next();
        }
    };
    /**
     * Génère un nouveau token et l'insert dans la session courante (à mettre dans le this)
     * @param session
     * @return {string}
     */
    CsrfMiddleware._generateTokenAndPutItInSession = function (session) {
        var newToken = CsrfMiddleware.generateToken();
        var csrfSessionArray = session.getAttribute("csrf");
        if (!_.isArray(csrfSessionArray)) {
            csrfSessionArray = [];
            session.setAttribute("csrf", csrfSessionArray);
        }
        if (csrfSessionArray.length >= CsrfMiddleware._MAX_TOKENS_NUMBER_PER_SESSION) {
            CsrfMiddleware.logger.warn("Taille maximale de tokens atteinte, suppression du plus vieux:", csrfSessionArray[0]);
            csrfSessionArray.shift();
        }
        csrfSessionArray.push(newToken);
        return newToken;
    };
    /**
     * Set le token dans le header 'x-csrf-token' de la réponse
     * @param session
     * @param response
     * @return {string}
     */
    CsrfMiddleware.setTokenInHeader = function (token, response) {
        response.set(CsrfMiddleware.HEADER_CSRF_NAME, token);
    };
    /**
     * Retourne l'index du token dans la liste de tokens de l'utilisateur, -1 si le token est introuvable
     * @param incomingCsrf
     * @param sessionCsrfArray
     * @return {any}
     * @private
     */
    CsrfMiddleware._getIndexOfIncomingCsrf = function (incomingCsrf, sessionCsrfArray) {
        CsrfMiddleware.logger.trace("incomingCsrf =", incomingCsrf);
        CsrfMiddleware.logger.trace("sessionCsrf =", sessionCsrfArray);
        return _.findIndex(sessionCsrfArray, function (token) {
            return token === incomingCsrf;
        });
    };
    CsrfMiddleware.logger = utils.getLogger("hornet-js-core.middlewares.CsrfMiddleware");
    CsrfMiddleware._MAX_TOKENS_NUMBER_PER_SESSION = 10;
    CsrfMiddleware.HEADER_CSRF_NAME = 'x-csrf-token';
    return CsrfMiddleware;
})(AbstractHornetMiddleware);
exports.CsrfMiddleware = CsrfMiddleware;
// ------------------------------------------------------------------------------------------------------------------- //
//                                      MockManagerMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
var director = require('director');
var MockManagerMiddleware = (function (_super) {
    __extends(MockManagerMiddleware, _super);
    function MockManagerMiddleware(appConfig) {
        _super.call(this, appConfig);
    }
    MockManagerMiddleware.prototype.insertMiddleware = function (app) {
        if (utils.config.getOrDefault('mock.enabled', false)) {
            var routes = this.appConfig.serverDir + utils.config.get('mock.routes');
            MockManagerMiddleware.logger.warn("LE MODE BOUCHON EST ACTIF");
            MockManagerMiddleware.logger.warn("MODE BOUCHON: Toutes les url commencant par '[HOST]:" +
                utils.config.getOrDefault("server.port", 8888) + utils.buildContextPath("/hornet-mock") + "' seront traitées par le fichier de routes suivants :", routes);
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
            app.use('/hornet-mock', function (req, res, next) {
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
        }
        else {
            MockManagerMiddleware.logger.debug("Mode mock disabled");
        }
    };
    MockManagerMiddleware.logger = utils.getLogger("hornet-js-core.middlewares.MockManagerMiddleware");
    return MockManagerMiddleware;
})(AbstractHornetMiddleware);
exports.MockManagerMiddleware = MockManagerMiddleware;
var RouterData = require("src/routes/router-data");
var RouterDataMiddleware = (function (_super) {
    __extends(RouterDataMiddleware, _super);
    function RouterDataMiddleware(appConfig) {
        _super.call(this, appConfig, utils.config.getOrDefault("fullSpa.name", "/services"), new RouterData(appConfig).middleware());
    }
    return RouterDataMiddleware;
})(AbstractHornetMiddleware);
exports.RouterDataMiddleware = RouterDataMiddleware;
// ------------------------------------------------------------------------------------------------------------------- //
//                                      RouterViewMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
var RouterView = require("src/routes/router-view");
var RouterViewMiddleware = (function (_super) {
    __extends(RouterViewMiddleware, _super);
    function RouterViewMiddleware(appConfig) {
        _super.call(this, appConfig, null, new RouterView(appConfig).middleware());
    }
    return RouterViewMiddleware;
})(AbstractHornetMiddleware);
exports.RouterViewMiddleware = RouterViewMiddleware;
// ------------------------------------------------------------------------------------------------------------------- //
//                                      ErrorMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
var ErrorMiddleware = (function (_super) {
    __extends(ErrorMiddleware, _super);
    function ErrorMiddleware(appConfig) {
        _super.call(this, appConfig, null, function (err, req, res, next) {
            ErrorMiddleware.logger.error("ERREUR non gérée par l'appli : ", err, " lors du traitement de la requete :", req);
            // send back a 500 with a generic
            res.status(500);
            res.send(err);
        });
    }
    ErrorMiddleware.logger = utils.getLogger("hornet-js-core.middlewares.ErrorMiddleware");
    return ErrorMiddleware;
})(AbstractHornetMiddleware);
exports.ErrorMiddleware = ErrorMiddleware;
exports.DEFAULT_HORNET_MIDDLEWARES = [
    LoggerTIDMiddleware,
    DisableKeepAliveMiddleware,
    SecurityMiddleware,
    WelcomePageRedirectMiddleware,
    StaticPathMiddleware,
    BodyParserJsonMiddleware,
    BodyParserUrlEncodedMiddleware,
    SessionMiddleware,
    CsrfMiddleware,
    MulterMiddleware,
    MockManagerMiddleware,
    RouterDataMiddleware,
    RouterViewMiddleware,
    ErrorMiddleware
];
//# sourceMappingURL=middlewares.js.map