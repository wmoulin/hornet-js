///<reference path="../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";
import utils = require("hornet-js-utils");
import AppSharedProps = require("hornet-js-utils/src/app-shared-props");

var logger = utils.getLogger("hornet-js-core.server");
import http = require("http");
import ServerConfiguration = require("src/server-conf");
import express = require("express");
import expstate = require("express-state");
import HornetMiddlewares = require("src/middleware/middlewares");

class Server {

    private app:express.Express;
    private server;

    constructor(appConfig:ServerConfiguration, middlewares:Array<typeof HornetMiddlewares.AbstractHornetMiddleware>) {
        this.app = this.init(appConfig, middlewares);
        this.server = http.createServer(this.app);
    }

    public start():void {
        var port = utils.config.getOrDefault("server.port", 8888);
        var maxConnections = utils.config.getOrDefault("server.maxConnections", 300);
        var timeout = utils.config.getOrDefault("server.timeout", 300000);
        this.server.maxConnections = maxConnections;
        this.server.timeout = timeout;
        this.server.listen(port, "0.0.0.0");

        logger.info("Application démarrée côté serveur !");
        logger.info("MODE :", process.env.NODE_ENV);
        logger.info("Listening on port", port, " with params", {
            maxConnections: maxConnections,
            timeout: timeout,
            keepAlive: utils.config.getOrDefault("server.keepAlive", true)
        });
    }

    /**
     * Fonction principale permettant d'initialiser le serveur NodeJS proprement dit. <br />
     * Elle effectue les opérations suivantes:
     * <ul>
     *     <li>Chargement de 'express'</li>
     *     <li>Application des middlewares</li>
     * </ul>
     * @param appConfig
     * @param middlewares? : liste ordonnées des middlewares à utiliser, si pas fournies, la liste par défaut d'hornet est utilisée.
     * @returns {"express".e.Express}
     */
    private init(appConfig:ServerConfiguration, middlewares?:Array<typeof HornetMiddlewares.AbstractHornetMiddleware>):express.Express {
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
        for (var i=0;i<extendedMethods.length;i++) {
            extendsExpressMethods(app, extendedMethods[i]);
        }

        // Installation d'express-state
        expstate.extend(app);

        // si pas de liste fournie >> on prend la liste des middlewares par défaut d'hornet
        var serverMiddlewares = middlewares ? middlewares : HornetMiddlewares.DEFAULT_HORNET_MIDDLEWARES;
        // Instanciation et insertion des middlewares dans l'application
        for (var i=0;i<serverMiddlewares.length;i++) {
            var middleware = serverMiddlewares[i];
            var inst = new middleware(appConfig);
            inst.insertMiddleware(app);
        }

        return app;
    }
}

function joinUrl(...paths:string[]) {
    return Array.prototype.slice.call(paths).join('/')
        .replace(/[\/]+/g, '/')
        .replace(/\/\?/g, '?')
        .replace(/\/\#/g, '#')
        .replace(/\:\//g, '://');
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
            args.unshift(utils.getContextPath())
        }
        logger.trace("Route Express : " + routine + "(", args, ")");

        _saved.apply(app, args);
    };
}

var parseUrl = require('parseurl');
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