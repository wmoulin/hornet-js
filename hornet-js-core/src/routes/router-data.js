///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var utils = require("hornet-js-utils");
var ExtendedPromise = require("hornet-js-utils/src/promise-api");
var MediaType = require("src/protocol/media-type");
var RouterAbstract = require("src/routes/router-abstract");
var File = require("src/data/file");
var WError = utils.werror;
var logger = utils.getLogger("hornet-js-core.routes.router-data");
var _ = utils._;
var RouterData = (function (_super) {
    __extends(RouterData, _super);
    function RouterData(appConfig) {
        _super.call(this, appConfig);
    }
    /**
     * Fonction appelée lorsqu'une route doit être appliquée
     * @param routeContext Le contexte courant de lrequete
     * @param handler La fonction permettant d'exécuter le code associé à la route
     */
    RouterData.prototype.handleRoute = function (routeContext, handler, parameters) {
        // `routeContext` has `req` and `res` when on the server (from Director).
        //var router:RouterData = this;
        var params = [routeContext].concat(parameters);
        var locales = routeContext.req.acceptsLanguages();
        var fluxibleContext = this.configuration.dispatcherLoaderFn(locales);
        routeContext.actionContext = fluxibleContext.getActionContext();
        try {
            logger.trace("routeContext", {
                req: {
                    body: routeContext.req.body,
                    query: routeContext.req.query,
                    getSession: routeContext.req.getSession()
                }
            });
            var routeInfos = handler.apply(routeContext, params);
            var currentPromise = ExtendedPromise.resolve(true);
            // on initialise l'objet qui sera transmis d'Action en Action, avant toute action
            logger.debug("Initialisation du ActionChainData");
            currentPromise = this.initActionChainData(currentPromise, routeInfos.chainData, routeContext.req);
            // on vérifie que l'utilisateur à le droit d'accéder à cette ressource
            currentPromise = this.validateUserAccess(currentPromise, fluxibleContext, routeInfos, routeContext);
            logger.debug("Chainage des actions");
            // On chaine chaque action dans le then de la précédente
            currentPromise = this.chainActions(currentPromise, fluxibleContext.getActionContext(), routeInfos.actions);
            logger.debug("Gestion des erreurs actionChainData");
            currentPromise = this.manageErrors(currentPromise, fluxibleContext, routeInfos, routeContext);
            logger.debug("Gestion du resultat, mediatypes ou json");
            currentPromise = this.manageResultType(currentPromise, fluxibleContext, routeInfos, routeContext);
            currentPromise.fail(this.handleErrBuilder(routeContext));
        }
        catch (err) {
            logger.debug("catch -> handleErr");
            this.handleErr(err, routeContext);
        }
    };
    RouterData.prototype.parseRoutes = function (routes, basePath) {
        logger.debug("parseRoutes Data : ", basePath);
        var matcher = RouterData.routeMatcherFactory();
        routes.buildDataRoutes(matcher.getMatcher(this, basePath));
        return matcher;
    };
    RouterData.prototype.manageResultType = function (currentPromise, fluxibleContext, routeInfos, routeContext) {
        currentPromise = currentPromise.then(function (actionsChainData) {
            logger.debug("Gestion du ResultType");
            var headers = routeContext.req.headers || {};
            var hasError = (actionsChainData.lastError instanceof WError) || actionsChainData.isAccessForbidden;
            if (!hasError) {
                logger.trace("Gestion du ResultType actionsChainData = ", actionsChainData);
                if (MediaType.isRedirect(actionsChainData.responseMimeType)) {
                    logger.trace("Gestion JSON du result : ", actionsChainData.result);
                    routeContext.res.json(actionsChainData.result);
                }
                else if (actionsChainData.result && (actionsChainData.result instanceof File)) {
                    logger.debug("Gestion du ResultType, renvoie d'un fichier vers le client ");
                    //Cas d'un fichier à renvoyer au client
                    var file = actionsChainData.result;
                    routeContext.res.writeHead(200, { "Content-Type": file.mimeType, "Cache-Control": "no-cache" });
                    routeContext.res.write(new Buffer(file.buffer));
                    routeContext.res.end();
                }
                else {
                    logger.debug("MediaType.isRedirect(actionsChainData.responseMimeType) = false");
                    routeContext.res.writeHead(200, { "Content-Type": actionsChainData.responseMimeType, "Cache-Control": 'no-cache' });
                    logger.debug("Gestion actionsChainData.result : ", actionsChainData.result);
                    if (actionsChainData.result) {
                        actionsChainData.result.on("data", function (data) {
                            logger.debug("Gestion du ResultType actionsChainData data = ", data);
                            routeContext.res.write(data);
                        });
                        actionsChainData.result.on("end", function () {
                            routeContext.res.end();
                        });
                    }
                    else {
                        routeContext.res.end();
                    }
                }
            }
            else {
                logger.error("Retour en erreur:", actionsChainData);
                if (!actionsChainData.isAccessForbidden) {
                    routeContext.res.status(400);
                    if (headers["accept"] === utils.CONTENT_JSON) {
                        routeContext.res.json(actionsChainData.lastError.message);
                        logger.error("Retour en erreur:", actionsChainData.lastError.message);
                    }
                }
                routeContext.res.end();
            }
        });
        return currentPromise;
    };
    return RouterData;
})(RouterAbstract);
module.exports = RouterData;
//# sourceMappingURL=router-data.js.map