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

(<any>Error).stackTraceLimit = Utils.config.getOrDefault("server.stackTraceLimit", 100);
const logger: Logger = Utils.getLogger("hornet-js-core.server");
process.on("uncaughtException", function(error) {
    logger.error("Exception non catchée : ", error);
    //throw new TechnicalError('ERR_TECH_UNKNOWN', null, error);
});

var parseUrl = require("parseurl");

import * as http from "http";
import * as https from "https";

import * as express from "express";
import * as expressState from "express-state";
import { ServerConfiguration } from "src/server-conf";
import { KeyStoreBuilder } from "hornet-js-utils/src/key-store-helper";
import { HornetMiddlewareList, AbstractHornetMiddleware, HornetRouter } from "src/middleware/middlewares";
import { Monitor } from "src/monitoring/monitor";
import { TechnicalError } from "hornet-js-utils/src/exception/technical-error";
import { BaseError } from "hornet-js-utils/src/exception/base-error";


// NOTE: event name is camelCase as per node convention
process.on("unhandledRejection", function(reason, promise) {
    // See Promise.onPossiblyUnhandledRejection for parameter documentation
    if (process.env.NODE_ENV !== "production") {
        logger.error("unhandledRejection : ", reason);
    }
    let error = reason;
    if (!(reason instanceof BaseError)) {
        error = new TechnicalError("ERR_TECH_UNKNOWN", {errorMessage: "Erreur inattendue"}, reason);
    }

    throw error;

});

// NOTE: event name is camelCase as per node convention
process.on("rejectionHandled", function(promise) {
    // See Promise.onUnhandledRejectionHandled for parameter documentation
    if (process.env.NODE_ENV !== "production") {
        logger.error("rejectionHandled for promise ", promise);
    }
    throw new TechnicalError("ERR_TECH_UNKNOWN", {errorMessage: "Erreur inattendue"});
});


export class Server {

    public app: express.Express;
    private server;
    private monitor: Monitor;
    private keepAlive: boolean;
    private keepAliveTimeout: number;
    private port: number;
    private maxConnections: number;
    private timeout: number;
    private protocol: string;

    constructor(appConfig: ServerConfiguration, hornetMiddlewareList: HornetMiddlewareList) {
        this.server = this.createServer(appConfig.httpsOptions);

        this.maxConnections = Utils.config.getOrDefault("server.maxConnections", 300);
        this.timeout = Utils.config.getOrDefault("server.timeout", 300000);

        this.server.maxConnections = this.maxConnections;
        this.server.timeout = this.timeout;

        this.monitor = new Monitor(this.server);
        this.app = this.init(appConfig, hornetMiddlewareList);
        this.server.addListener("request", this.app);

        this.port = Utils.config.getOrDefault("server.port", 8888);
        this.keepAlive = Utils.config.getOrDefault("server.keepAlive", true);
        this.keepAliveTimeout = Utils.config.getOrDefault("server.keepAliveTimeout", 150000);

        // Auto configuration du keystore
        KeyStoreBuilder.setHttpsGlobalAgent(null, Utils.config.getOrDefault("keystore", {}));
    }

    public start(): void {

        let port: number = (this.port) ? this.port : this.server.address().port;
        let url: string = this.protocol + "://localhost:" + port + Utils.getContextPath();

        this.server.listen(this.port, "0.0.0.0", () => {
            logger.trace("Application démarrée côté serveur !");
            logger.trace("Mode :", process.env.NODE_ENV);
            logger.trace("Protocole :", this.protocol);
            logger.trace("URL application :", url);
            logger.trace("Listening on port", (this.port) ? this.port : this.server.address().port, " with params", {
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
    private createServer(httpsOptions?: https.ServerOptions): http.Server | https.Server {
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
    private init(appConfig: ServerConfiguration, hornetMiddlewareList: HornetMiddlewareList): express.Express {
        logger.debug("Initialisation du serveur");
        // on place par défaut les clés "loginUrl" & "logoutUrl" & "welcomePageUrl" dans les AppSharedProps
        Utils.appSharedProps.set("loginUrl", appConfig.loginUrl);
        Utils.appSharedProps.set("logoutUrl", appConfig.logoutUrl);
        Utils.appSharedProps.set("welcomePageUrl", appConfig.welcomePageUrl);

        // On surcharge express pour gérer des zones publiques
        extendsExpressForPublicZones(appConfig);

        // Initialisation du serveur
        var app: express.Express = express();

        // on surcharge les méthodes de définition de routes Express afin de gérer automatiquement le prefixage du contextPath
        var extendedMethods = ["use", "all", "get", "post", "put", "patch", "trace", "options", "delete", "patch", "head"];
        for (var i = 0; i < extendedMethods.length; i++) {
            extendsExpressMethods(app, extendedMethods[i]);
        }

        // Installation d'express-state
        expressState.extend(app);
        if (!appConfig.routesDataContext) appConfig.routesDataContext = "/services";
        // si pas de liste fournie >> on prend la liste des middlewares par défaut d'hornet
        // Instanciation et insertion des middlewares dans l'application
        AbstractHornetMiddleware.APP_CONFIG = appConfig;
        for (var i = 0; i < hornetMiddlewareList.list.length; i++) {
            var middleware = hornetMiddlewareList.list[i];
            if (middleware === undefined || middleware === null) {
                logger.warn("Un middleware de valeur '" + middleware + "' a été trouvé dans le tableau des middlewares.");
            } else {
                try {
                    if(middleware instanceof HornetRouter) {
                        app.use((middleware as HornetRouter).prefix, (middleware as HornetRouter).router);
                    } else {
                        var inst = new middleware();
                        inst.insertMiddleware(app);
                    }
                } catch (e) {
                    logger.error("Une erreur a été levée lors de l'instanciation d'un middleware > erreur:", e);
                    throw e;
                }
            }
        }

        return app;
    }
}

function joinUrl(...paths: string[]) {
    return Array.prototype.slice.call(paths).join("/")
        .replace(/[\/]+/g, "/")
        .replace(/\/\?/g, "?")
        .replace(/\/\#/g, "#")
        .replace(/\:\//g, "://");
}

function extendsExpressMethods(app: express.Express, routine: string) {
    var _saved = app[routine];
    app[routine] = function() {
        // cas tordu côté express ... la même méthode sert à autre chose en fonction du nombre d'arguments ...
        if (routine === "get" && arguments.length === 1) {
            return _saved.apply(app, arguments);
        }

        var args = Array.prototype.slice.call(arguments);
        // si un path est passé à express > on le prefix par le contextPath
        if (typeof arguments[0] === "string") {
            args[0] = joinUrl(Utils.getContextPath(), arguments[0]);

            // si pas de path > on créé le path avec le contextPath comme valeur
        } else {
            args.unshift(Utils.getContextPath());
        }
        logger.trace("Route Express : " + routine + "(", args, ")");

        _saved.apply(app, args);
    };
}


function extendsExpressForPublicZones(appConfig: ServerConfiguration) {
    if (appConfig.publicZones && appConfig.publicZones.length > 0) {
        var contextPath = Utils.getContextPath();
        var publicZones = Array.prototype.slice.call(appConfig.publicZones);
        var Layer = require("express/lib/router/layer");
        Layer.prototype.handle_request = function handle(req, res, next) {
            var fn = this.handle;

            //////////// Public Zone Patch /////////
            if (fn.name && fn.name === "ensureAuthenticated") {
                var isPublic: any = false;
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
