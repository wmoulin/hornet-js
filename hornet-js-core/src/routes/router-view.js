///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var utils = require("hornet-js-utils");
var NotificationStore = require("src/stores/notification-store");
var PageInformationsStore = require('src/stores/page-informations-store');
var ExtendedPromise = require("hornet-js-utils/src/promise-api");
var ActionExtendedPromise = require("src/routes/action-extended-promise");
var RouterAbstract = require("src/routes/router-abstract");
var Session = require("src/session/session");
var WError = utils.werror;
var react = require("react");
var logger = utils.getLogger("hornet-js-core.routes.router-view");
var _ = utils._;
var fullSpa = utils.config.getOrDefault("fullSpa.enabled", false);
// Sur nodeJS le premier rendu n"est pas utilisé donc toujours mis à false
var firstRender = utils.isServer ? false : true;
var SimpleAction = require("src/actions/simple-action");
var ActionsChainData = require("src/routes/actions-chain-data");
var RouterView = (function (_super) {
    __extends(RouterView, _super);
    function RouterView(appConfig) {
        _super.call(this, appConfig);
        this.session = new Session("__browser__sid", -1);
    }
    /**
     * Fonction appelée lorsqu"une route doit être appliquée
     * @param routeContext Le contexte courant de lrequete
     * @param handler La fonction permettant d"exécuter le code associé à la route
     */
    RouterView.prototype.handleRoute = function (routeContext, handler, parameters) {
        var _this = this;
        logger.debug("Chargement des routes - View");
        // `routeContext` has `req` and `res` when on the server (from Director).
        var router = this;
        var params = [routeContext].concat(parameters);
        var locales = [];
        if (utils.isServer) {
            //var requete:any = "fr-FR";//this.req; voir routeContext.req.header("local")
            var languagesReq = routeContext.req;
            locales = languagesReq.acceptsLanguages();
        }
        var fluxibleContext = router.configuration.dispatcherLoaderFn(locales);
        routeContext.actionContext = fluxibleContext.getActionContext();
        if (!utils.isServer) {
            // router.currentUrl : l"url de destination
            // window.location.href : l"url actuellement affichée
            router.currentUrl = router.currentUrl || window.location.href;
            // Creation du body et du query car ils ne sont pas embarqués côté client
            var context = routeContext;
            context.req = {
                body: router.currentParam || {},
                query: RouterView.getUrlParameters(router.currentUrl),
                getSession: function () { return _this.session; }
            };
            router.currentParam = undefined;
        }
        try {
            logger.trace("routeContext", {
                req: routeContext.req
            });
            //Appel du handler associé à cette route
            var routeInfos = handler.apply(routeContext, params);
            var currentPromise = ExtendedPromise.resolve(true);
            var currentPath = (!utils.isServer) ? window.location.pathname : routeContext.req.originalUrl;
            logger.debug("CurrentPath:", currentPath);
            if (routeInfos.lazyRoutesParam) {
                // Cette partie de code n"est possible que sur le navigateur car sur NodeJS les routes lazy sont chargées au démarrage
                logger.debug("Chargement des routes en mode lazy");
                currentPromise = this.loadRoutes(currentPromise, routeInfos, routeContext, fluxibleContext.getActionContext());
                currentPromise.fail(this.handleErrBuilder(routeContext));
                return;
            }
            else {
                // On initialise l"objet qui sera transmis d"Action en Action, avant toute action
                logger.debug("Initialisation du ActionChainData");
                currentPromise = this.initActionChainData(currentPromise, routeInfos.chainData, routeContext.req);
                // On insert l"url actuelle dans le store
                currentPromise = currentPromise.then(function (actionsChainData) {
                    return new SimpleAction(SimpleAction.CHANGE_URL)
                        .withContext(fluxibleContext.getActionContext())
                        .withPayload(currentPath)
                        .promise(actionsChainData);
                });
                if (utils.isServer) {
                    // On insert le thème actuellement selectionné dans le store
                    var themeNameSession = routeContext.req.getSession().getAttribute("themeName");
                    var themeSplit = router.configuration.themeUrl.split("/");
                    var themeNameConfiguration = themeSplit[themeSplit.length - 1];
                    if (themeNameSession != themeNameConfiguration) {
                        var themeName = _.defaults(themeNameSession, themeNameConfiguration);
                        currentPromise = currentPromise.then(function (actionsChainData) {
                            return new SimpleAction(SimpleAction.CHANGE_THEME)
                                .withContext(fluxibleContext.getActionContext())
                                .withPayload(themeName)
                                .promise(actionsChainData);
                        });
                    }
                    if (router.configuration.menuConfig) {
                        // On insert les informations du menu dans le store
                        currentPromise = currentPromise.then(function (actionsChainData) {
                            return new SimpleAction(SimpleAction.RECEIVE_MENU_CONFIG)
                                .withContext(fluxibleContext.getActionContext())
                                .withPayload(router.configuration.menuConfig)
                                .promise(actionsChainData);
                        });
                    }
                }
                // On vérifie que l"utilisateur à le droit d"accéder à cette page
                currentPromise = this.validateUserAccess(currentPromise, fluxibleContext, routeInfos, routeContext);
                if (firstRender && !fullSpa) {
                    // Sur le premier rendu client on bypass l"exécution des actions et on fait confiance
                    // au mécanisme de déshydratation/réhydratation des stores pour fournir l"état courant
                    // >> uniquement en mode isomorphique !!
                    firstRender = false;
                }
                else {
                    // On nettoie les notifications potentiellement présentes avant de lancer les actions
                    currentPromise = currentPromise.then(function (actionsChainData) {
                        return new SimpleAction(SimpleAction.REMOVE_ALL_NOTIFICATIONS)
                            .withContext(fluxibleContext.getActionContext())
                            .promise(actionsChainData);
                    });
                    if (routeInfos.actions && routeInfos.actions.length > 0) {
                        logger.debug("Chainage des actions");
                        // On chaine chaque action dans le then de la précédente
                        currentPromise = this.chainActions(currentPromise, fluxibleContext.getActionContext(), routeInfos.actions);
                    }
                }
                logger.debug("Gestion des erreurs actionChainData");
                currentPromise = this.manageErrors(currentPromise, fluxibleContext, routeInfos, routeContext);
                // Gestion du rendu
                if (utils.isServer) {
                    currentPromise = this.manageResultType(currentPromise, fluxibleContext, routeInfos, routeContext);
                }
                else {
                    currentPromise = this.clientPageAction(currentPromise, fluxibleContext, routeInfos);
                }
                currentPromise.fail(this.handleErrBuilder(routeContext));
            }
        }
        catch (err) {
            logger.debug("catch -> handleErr");
            this.handleErr(err, routeContext);
        }
    };
    /**
     * Ajoute à currentPromise une 'promise" déclenchant le chargement du composant page correspondant à la route indiquée
     * @param currentPromise promise correspondant à la chaîne d'actions de la route
     * @param fluxibleContext contexte fluxible
     * @param routeInfos configuration de la route
     * @returns {ExtendedPromise<any>}
     */
    RouterView.prototype.clientPageAction = function (currentPromise, fluxibleContext, routeInfos) {
        var _this = this;
        currentPromise = currentPromise.then(function (actionsChainData) {
            logger.trace("Gestion du rendu de composant");
            var notificationStore = fluxibleContext.getActionContext().getStore(NotificationStore);
            var component = routeInfos.composant;
            /* Le composant à rendre est la page d'erreur générique dans le cas où la route fait un changement de page et qu'une erreur est survenue dans la chaine d'actions */
            if (!notificationStore.canRenderComponent() || actionsChainData.lastError || actionsChainData.isAccessForbidden) {
                var pageInfosStore = fluxibleContext.getActionContext().getStore(PageInformationsStore);
                if (component && component != pageInfosStore.getCurrentPageComponent()) {
                    logger.trace("Rendu de la page d'erreur générique");
                    component = _this.configuration.errorComponent;
                }
            }
            var internalPromise = _this.buildComponentResolver(component);
            internalPromise = internalPromise.then(function (composant) {
                if (composant) {
                    _this.currentUrl = undefined; // Reset de l"url potentiellement valorisée par setRouteInternal
                    return new SimpleAction(SimpleAction.CHANGE_PAGE_COMPONENT)
                        .withContext(fluxibleContext.getActionContext())
                        .withPayload(composant)
                        .promise(new ActionsChainData());
                }
                else {
                    logger.trace("clientPageAction : pas de composant");
                    return new ActionExtendedPromise(function (resolve, reject) {
                        resolve(new ActionsChainData());
                    });
                }
            });
            return internalPromise;
        });
        return currentPromise;
    };
    RouterView.prototype.manageResultType = function (currentPromise, fluxibleContext, routeInfos, routeContext) {
        var _this = this;
        currentPromise = currentPromise.then(function (actionsChainData) {
            logger.trace("Gestion du rendu côté serveur");
            var notificationStore = fluxibleContext.getActionContext().getStore(NotificationStore);
            var composant = routeInfos.composant;
            /* Le composant à rendre est la page d'erreur générique dans le cas où la route fait un changement de page et qu'une erreur est survenue dans la chaine d'actions */
            if (!notificationStore.canRenderComponent() || actionsChainData.lastError || actionsChainData.isAccessForbidden) {
                var pageInfosStore = fluxibleContext.getActionContext().getStore(PageInformationsStore);
                if (composant && composant != pageInfosStore.getCurrentPageComponent()) {
                    logger.trace("Rendu de la page d'erreur générique");
                    composant = _this.configuration.errorComponent;
                }
            }
            //Maintenant on termine le rendu si possible
            if (composant) {
                logger.trace("Rendu d'un composant en réponse");
                if (_.isString(composant)) {
                    logger.trace("composant = ", composant);
                    composant = _this.configuration.componentLoaderFn(composant);
                }
                //On expose la sérialisation des stores aux clients
                logger.trace("expose fluxibleContext.dehydrate");
                routeContext.res.expose(fluxibleContext.dehydrate(), "App");
                //On expose la sérialisation de la conf aux clients
                var clientConfig = {
                    shared: utils.config.getOrDefault("shared", ""),
                    themeUrl: utils.config.getOrDefault("themeUrl", ""),
                    fullSpa: utils.config.getOrDefault("fullSpa", {
                        "enabled": false,
                        "host": "",
                        "name": "/services"
                    }),
                    contextPath: utils.config.getOrDefault("contextPath", ""),
                    services: utils.config.getOrDefault("services", {}),
                    cache: utils.config.getOrDefault("cache", { enabled: false }),
                    log: utils.config.getOrDefault("logClient", {})
                };
                routeContext.res.expose(clientConfig, "Config");
                //On envoi au client le tokken csrf
                if (_.isFunction(routeContext.req.generateNewCsrfTokken)) {
                    var newCsrfToken = routeContext.req.generateNewCsrfTokken();
                    logger.trace("Génération d'un token CSRF:", newCsrfToken);
                    routeContext.res.expose(newCsrfToken, "CsrfTokken");
                }
                // On expose au client les informations de l"application courante
                routeContext.res.expose(utils.appSharedProps.dehydrate(), "AppSharedProps");
                // On expose au client le mode de façon dynamique
                routeContext.res.expose(process.env.NODE_ENV, "Mode");
                // On rend le composant appComponent
                var currentFluxibleContext = fluxibleContext.getComponentContext();
                logger.trace("renderToString");
                var htmlApp = react.renderToString(_this.configuration.appComponent({
                    composantPage: composant,
                    context: currentFluxibleContext
                }));
                // On rend la page entière en y intégrant l"appComponent rendu précédemment
                var html = react.renderToStaticMarkup(_this.configuration.layoutComponent({
                    composantApp: htmlApp,
                    context: currentFluxibleContext,
                    state: routeContext.res.locals.state
                }));
                routeContext.res.send("<!DOCTYPE html>" + html);
                routeContext.res.end();
            }
            else {
                logger.trace("Autre réponse");
                routeContext.res.end();
            }
        });
        return currentPromise;
    };
    RouterView.prototype.parseRoutes = function (routes, basePath) {
        logger.debug("basePath:", basePath);
        var matcher = RouterAbstract.routeMatcherFactory();
        routes.buildViewRoutes(matcher.getMatcher(this, basePath));
        return matcher;
    };
    return RouterView;
})(RouterAbstract);
module.exports = RouterView;
//# sourceMappingURL=router-view.js.map