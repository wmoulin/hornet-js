"use strict";
import utils = require("hornet-js-utils");
(<any> Error).stackTraceLimit = utils.config.getOrDefault("server.stackTraceLimit", 100);
import KeyStoreHelper = require("hornet-js-utils/src/key-store-helper");

var logger = utils.getLogger("hornet-js-core.server");

var parseUrl = require("parseurl");
import http = require("http");
import https = require("https");
import ServerConfiguration = require("src/server-conf");
import express = require("express");
import expstate = require("express-state");
import HornetMiddlewares = require("src/middleware/middlewares");
import HornetMonitor = require("src/monitoring/monitor");

process.on("uncaughtException", function (error) {
    logger.error("Exception non catchée : ", error);
});

class Server {

    private app:express.Express;
    private server;
    private monitor:HornetMonitor;
    private keepAlive:boolean;
    private keepAliveTimeout:number;
    private port:number;
    private maxConnections:number;
    private timeout:number;
    private protocol:string;

    constructor(appConfig:ServerConfiguration, hornetMiddlewareList:HornetMiddlewares.HornetMiddlewareList) {
        this.server = this.createServer(appConfig.httpsOptions);

        this.maxConnections = utils.config.getOrDefault("server.maxConnections", 300);
        this.timeout = utils.config.getOrDefault("server.timeout", 300000);

        this.server.maxConnections = this.maxConnections;
        this.server.timeout = this.timeout;

        this.monitor = new HornetMonitor(this.server);
        this.app = this.init(appConfig, hornetMiddlewareList);
        this.server.addListener("request", this.app);

        this.port = utils.config.getOrDefault("server.port", 8888);
        this.keepAlive = utils.config.getOrDefault("server.keepAlive", true);
        this.keepAliveTimeout = utils.config.getOrDefault("server.keepAliveTimeout", 150000);

        // Auto configuration du keystore
        KeyStoreHelper.KeyStoreBuilder.setHttpsGlobalAgent(null, utils.config.getOrDefault("keystore", {}));
    }

    public start():void {
        this.server.listen(this.port, "0.0.0.0", () => {
            logger.info("Application démarrée côté serveur !");
            logger.info("Mode :", process.env.NODE_ENV);
            logger.info("Protocole :", this.protocol);
            logger.info("Listening on port", this.port, " with params", {
                maxConnections: this.maxConnections,
                timeout: this.timeout,
                keepAlive: this.keepAlive,
                keepAliveTimeout: this.keepAliveTimeout
            });
        }).on("error", (err) => {
            logger.error("Impossible de démarrer le serveur ... : ", err);
            process.exit(1);
        });


        // Gestion à la main du keep-alive
        this.server.on("request", (req, res) => {
            if (this.keepAlive !== false) {
                req.connection.setKeepAlive(true);

                // On utilise le timeout par défaut lors d'une requête entrante
                req.connection.setTimeout(this.timeout);

                // On ajoute les entêtes
                if (!res._headerSent) {
                    res.setHeader("Connection", "keep-alive");
                    res.setHeader("Keep-Alive", "timeout=" + (this.keepAliveTimeout / 1000));
                }
                // On utilise le timeout keepAlive lorsque la requête est terminée
                res.once("finish", () => {
                    req.connection.setTimeout(this.keepAliveTimeout);
                });
            } else {
                req.connection.setKeepAlive(false);

                if (!res._headerSent) {
                    res.setHeader("Connection", "close");
                }
            }
        });
    }

    /**
     * Création du serveur web en mode http ou bien https
     * @param httpsOptions option pour le mode https
     * @returns {Server} le serveur instancié
     */
    private createServer(httpsOptions?:https.ServerOptions):http.Server | https.Server {
        if (httpsOptions) {
            this.protocol = "https";
            return https.createServer(httpsOptions);
        }
        this.protocol = "http";
        return http.createServer();
    }

    /**
     * Fonction principale permettant d'initialiser le serveur NodeJS proprement dit. <br />
     * Elle effectue les opérations suivantes:
     * <ul>
     *     <li>Chargement de 'express'</li>
     *     <li>Application des middlewares</li>
     * </ul>
     * @param appConfig
     * @param hornetMiddlewareList
     * @returns {"express".e.Express}
     */
    private init(appConfig:ServerConfiguration, hornetMiddlewareList:HornetMiddlewares.HornetMiddlewareList):express.Express {
        logger.debug("Initialisation du serveur");
        // on place par défaut les clés "loginUrl" & "logoutUrl" & "welcomePageUrl" dans les AppSharedProps
        utils.appSharedProps.set("loginUrl", appConfig.loginUrl);
        utils.appSharedProps.set("logoutUrl", appConfig.logoutUrl);
        utils.appSharedProps.set("welcomePageUrl", appConfig.welcomePageUrl);

        // On surcharge express pour gérer des zones publiques
        extendsExpressForPublicZones(appConfig);

        // Initialisation du serveur
        var app = express();

        // on surcharge les méthodes de définition de routes Express afin de gérer automatiquement le prefixage du contextPath
        var extendedMethods = ["use", "all", "get", "post", "put", "patch", "trace", "options", "delete", "patch", "head"];
        for (var i = 0; i < extendedMethods.length; i++) {
            extendsExpressMethods(app, extendedMethods[i]);
        }

        // Installation d'express-state
        expstate.extend(app);

        // si pas de liste fournie >> on prend la liste des middlewares par défaut d'hornet
        // Instanciation et insertion des middlewares dans l'application
        for (var i = 0; i < hornetMiddlewareList.length; i++) {
            var middleware = hornetMiddlewareList[i];
            if (middleware === undefined || middleware === null) {
                logger.warn("Un middleware de valeur '" + middleware + "' a été trouvé dans le tableau des middlewares.");
            } else {
                try {
                    var inst = new middleware(appConfig);
                    inst.insertMiddleware(app);
                } catch (e) {
                    logger.error("Une erreur a été levée lors de l'instanciation d'un middleware > erreur:", e);
                    throw e;
                }
            }
        }

        return app;
    }
}

function joinUrl(...paths:string[]) {
    return Array.prototype.slice.call(paths).join("/")
        .replace(/[\/]+/g, "/")
        .replace(/\/\?/g, "?")
        .replace(/\/\#/g, "#")
        .replace(/\:\//g, "://");
}

function extendsExpressMethods(app:express.Express, routine:string) {
    var _saved = app[routine];
    app[routine] = function () {
        // cas tordu côté express ... la même méthode sert à autre chose en fonction du nombre d'arguments ...
        if (routine === "get" && arguments.length === 1) {
            return _saved.apply(app, arguments);
        }

        var args = Array.prototype.slice.call(arguments);
        // si un path est passé à express > on le prefix par le contextPath
        if (typeof arguments[0] === "string") {
            args[0] = joinUrl(utils.getContextPath(), arguments[0]);

            // si pas de path > on créé le path avec le contextPath comme valeur
        } else {
            args.unshift(utils.getContextPath());
        }
        logger.trace("Route Express : " + routine + "(", args, ")");

        _saved.apply(app, args);
    };
}


function extendsExpressForPublicZones(appConfig:ServerConfiguration) {
    if (appConfig.publicZones && appConfig.publicZones.length > 0) {
        var contextPath = utils.getContextPath();
        var publicZones = Array.prototype.slice.call(appConfig.publicZones);
        var Layer = require("express/lib/router/layer");
        Layer.prototype.handle_request = function handle(req, res, next) {
            var fn = this.handle;

            //////////// Public Zone Patch /////////
            if (fn.name && fn.name === "ensureAuthenticated") {
                var isPublic:any = false;
                var pathname = parseUrl.original(req).pathname.replace(contextPath, "");
                publicZones.forEach((publicZone) => {
                    isPublic |= <any>(pathname.indexOf(publicZone) === 0);
                });

                if (isPublic) {
                    return next();
                }
            }
            ///////////////////////////////////////

            if (fn.length > 3) {
                // not a standard request handler
                return next();
            }

            try {
                fn(req, res, next);
            } catch (err) {
                next(err);
            }
        };
    }
}

export = Server;
