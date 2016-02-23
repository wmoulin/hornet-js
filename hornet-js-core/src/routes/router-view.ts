"use strict";
import utils = require("hornet-js-utils");

import NotificationStore = require("src/stores/notification-store");
import PageInformationsStore = require("src/stores/page-informations-store");
import ExtendedPromise = require("hornet-js-utils/src/promise-api");
import ActionExtendedPromise = require("src/routes/action-extended-promise");
import RouterAbstract = require("src/routes/router-abstract");
import Matcher = require("src/routes/route-matcher");
import Session = require("src/session/session");

import react = require("react");
var logger = utils.getLogger("hornet-js-core.routes.router-view");
var _ = utils._;
var fullSpa:boolean = utils.config.getOrDefault("fullSpa.enabled", false);

// Sur nodeJS le premier rendu n"est pas utilisé donc toujours mis à false
var firstRender:boolean = utils.isServer ? false : true;

import SimpleAction = require("src/actions/simple-action");
import ActionsChainData = require("src/routes/actions-chain-data");

import I = require("./router-interfaces");
import ServerConfiguration = require("src/server-conf");
import ClientConfiguration = require("src/client-conf");

class RouterView extends RouterAbstract {

    private session:Session = new Session("__browser__sid", -1);

    constructor(appConfig:ServerConfiguration|ClientConfiguration) {
        super(appConfig);
    }

    /**
     * Fonction appelée lorsqu"une route doit être appliquée
     * @param routeContext Le contexte courant de lrequete
     * @param handler La fonction permettant d"exécuter le code associé à la route
     */
    protected handleRoute(routeContext:I.IRouteContext, handler:I.IRouteHandler, parameters:any[]) {
        logger.debug("Chargement des routes - View");
        // `routeContext` has `req` and `res` when on the server (from Director).
        var router:RouterView = this;
        var params = [routeContext].concat(parameters);
        var locales:Array<string> = [];
        if (utils.isServer) {
            // var requete:any = "fr-FR";//this.req; voir routeContext.req.header("local")
            var languagesReq:any = routeContext.req;
            locales = languagesReq.acceptsLanguages();
        }
        var fluxibleContext:FluxibleContext = router.configuration.dispatcherLoaderFn(locales);

        routeContext.actionContext = fluxibleContext.getActionContext();

        if (!utils.isServer) {
            // router.currentUrl : l"url de destination
            // window.location.href : l"url actuellement affichée
            router.currentUrl = router.currentUrl || window.location.href;
            // Creation du body et du query car ils ne sont pas embarqués côté client
            var context:any = routeContext;
            context.req = {
                body: router.currentParam || {},
                query: RouterView.getUrlParameters(router.currentUrl),
                getSession: () => this.session
            };
            router.currentParam = undefined;
        }

        try {
            logger.trace("routeContext", {
                req: routeContext.req
            });

            // Appel du handler associé à cette route
            var routeInfos:I.IRoutesInfos = handler.apply(routeContext, params);

            var currentPromise:ExtendedPromise<any> = ExtendedPromise.resolve(true);
            var currentPath = (!utils.isServer) ? window.location.pathname : routeContext.req.originalUrl;
            logger.debug("CurrentPath:", currentPath);

            if (routeInfos.lazyRoutesParam) {
                // Cette partie de code n'est possible que sur le navigateur car sur NodeJS les routes lazy sont chargées au démarrage
                logger.debug("Chargement des routes en mode lazy");
                currentPromise = this.loadRoutes(currentPromise, routeInfos, routeContext, fluxibleContext.getActionContext());
                currentPromise.fail(this.handleErrBuilder(routeContext));
                return;
            } else {

                // On initialise l'objet qui sera transmis d"Action en Action, avant toute action
                logger.debug("Initialisation du ActionChainData");
                currentPromise = this.initActionChainData(currentPromise, routeInfos.chainData, routeContext.req);

                // On insert l'url actuelle dans le store
                currentPromise = currentPromise.then(function (actionsChainData) {
                    return new SimpleAction(SimpleAction.CHANGE_URL)
                        .withContext(fluxibleContext.getActionContext())
                        .withPayload(currentPath)
                        .promise(actionsChainData);
                });

                if (utils.isServer) {
                    // On insert le thème actuellement selectionné dans le store
                    var themeNameSession:string = routeContext.req.getSession().getAttribute("themeName");
                    var themeSplit = router.configuration.themeUrl.split("/");
                    var themeNameConfiguration:string = themeSplit[themeSplit.length - 1];

                    if (themeNameSession !== themeNameConfiguration) {
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

                // On vérifie que l'utilisateur à le droit d'accéder à cette page
                currentPromise = this.validateUserAccess(currentPromise, fluxibleContext, routeInfos, routeContext);

                if (firstRender && !fullSpa) {
                    // Sur le premier rendu client on bypass l'exécution des actions et on fait confiance
                    // au mécanisme de déshydratation/réhydratation des stores pour fournir l'état courant
                    // >> uniquement en mode isomorphique !!
                    firstRender = false;
                } else {

                    // On nettoie les notifications potentiellement présentes avant de lancer les actions
                    currentPromise = currentPromise.then(function (actionsChainData) {
                        return new SimpleAction(SimpleAction.REMOVE_ALL_NOTIFICATIONS)
                            .withContext(fluxibleContext.getActionContext())
                            .promise(actionsChainData);
                    });

                    if (routeInfos.actions && routeInfos.actions.length > 0) {
                        logger.debug("Chainage des actions");
                        // On chaine chaque action dans le then de la précédente
                        currentPromise = this.chainActions(currentPromise, fluxibleContext.getActionContext(),
                            routeInfos.actions);
                    }
                }

                logger.debug("Gestion des erreurs actionChainData");
                currentPromise = this.manageErrors(currentPromise, fluxibleContext, routeInfos, routeContext);

                // Gestion du rendu
                if (utils.isServer) {
                    currentPromise = this.manageResultType(currentPromise, fluxibleContext, routeInfos, routeContext);
                } else { // if client
                    currentPromise = this.clientPageAction(currentPromise, fluxibleContext, routeInfos);
                }
                currentPromise.fail(this.handleErrBuilder(routeContext));
            }
        } catch (err) {
            logger.debug("catch -> handleErr");
            this.handleErr(err, routeContext);
        }
    }

    /**
     * Ajoute à currentPromise une "promise" déclenchant le chargement du composant page correspondant à la route indiquée
     * @param currentPromise promise correspondant à la chaîne d'actions de la route
     * @param fluxibleContext contexte fluxible
     * @param routeInfos configuration de la route
     * @returns {ExtendedPromise<any>}
     */
    protected clientPageAction(currentPromise:ExtendedPromise<any>, fluxibleContext:FluxibleContext, routeInfos:I.IRoutesInfos):ActionExtendedPromise {
        currentPromise = currentPromise.then((actionsChainData:ActionsChainData) => {

            logger.trace("Gestion du rendu de composant");

            var notificationStore = fluxibleContext.getActionContext().getStore(NotificationStore);

            var component:any = routeInfos.composant;

            /* Le composant à rendre est la page d'erreur générique dans le cas où la route fait un changement de page et qu'une erreur est survenue dans la chaine d'actions */
            if (!notificationStore.canRenderComponent() || actionsChainData.lastError || actionsChainData.isAccessForbidden) {
                var pageInfosStore = fluxibleContext.getActionContext().getStore(PageInformationsStore);
                if (component && component !== pageInfosStore.getCurrentPageComponent()) {
                    logger.trace("Rendu de la page d'erreur générique");
                    component = this.configuration.errorComponent;
                }
            }

            var internalPromise = this.buildComponentResolver(component);
            internalPromise = internalPromise.then((composant) => {
                if (composant) {
                    this.currentUrl = undefined; // Reset de l"url potentiellement valorisée par setRouteInternal
                    return new SimpleAction(SimpleAction.CHANGE_PAGE_COMPONENT)
                        .withContext(fluxibleContext.getActionContext())
                        .withPayload(composant)
                        .promise(new ActionsChainData());
                } else {
                    logger.trace("clientPageAction : pas de composant");
                    return new ActionExtendedPromise((resolve, reject) => {
                        resolve(new ActionsChainData());
                    });
                }
            });
            return internalPromise;

        });
        return currentPromise;
    }

    protected manageResultType(currentPromise:ExtendedPromise<any>, fluxibleContext:FluxibleContext,
                               routeInfos:I.IRoutesInfos, routeContext:I.IRouteContext):ActionExtendedPromise {
        currentPromise = currentPromise.then((actionsChainData:ActionsChainData) => {
            logger.trace("Gestion du rendu côté serveur");

            var notificationStore = fluxibleContext.getActionContext().getStore(NotificationStore);

            var composant:any = routeInfos.composant;

            /* Le composant à rendre est la page d'erreur générique dans le cas où la route fait un
             changement de page et qu'une erreur est survenue dans la chaine d'actions */
            if (!notificationStore.canRenderComponent() || actionsChainData.lastError || actionsChainData.isAccessForbidden) {
                var pageInfosStore = fluxibleContext.getActionContext().getStore(PageInformationsStore);
                if (composant && composant !== pageInfosStore.getCurrentPageComponent()) {
                    logger.trace("Rendu de la page d'erreur générique");
                    composant = this.configuration.errorComponent;
                }
            }

            // Maintenant on termine le rendu si possible
            if (composant) {
                logger.trace("Rendu d'un composant en réponse");
                if (_.isString(composant)) {
                    logger.trace("composant = ", composant);
                    composant = this.configuration.componentLoaderFn(composant);
                }

                // On expose la sérialisation des stores aux clients
                logger.trace("expose fluxibleContext.dehydrate");
                routeContext.res.expose(fluxibleContext.dehydrate(), "App");

                // On expose la sérialisation de la conf aux clients
                var clientConfig = {
                    shared: utils.config.getOrDefault("shared", ""),
                    themeUrl: utils.config.getOrDefault("themeUrl", ""),
                    fullSpa: utils.config.getOrDefault("fullSpa", {
                        "enabled": false,
                        "host": "",
                        "name": "/services"
                    }),
                    contextPath: utils.config.getOrDefault("contextPath", ""),
                    cache: utils.config.getOrDefault("cache", {enabled: false}),
                    logClient: utils.config.getOrDefault("logClient", {}),
                    welcomePage: utils.config.getOrDefault("welcomePage", "/")
                };
                routeContext.res.expose(clientConfig, "Config");

                // On envoi au client le token csrf
                if (_.isFunction(routeContext.req.generateCsrfToken)) {
                    var csrfToken = routeContext.req.generateCsrfToken();
                    routeContext.res.expose(csrfToken, "CsrfToken");
                }

                // On expose au client les informations de l"application courante
                routeContext.res.expose(utils.appSharedProps.dehydrate(), "AppSharedProps");

                // On expose au client le mode de façon dynamique
                routeContext.res.expose(process.env.NODE_ENV, "Mode");

                // On rend le composant appComponent
                var currentFluxibleContext = fluxibleContext.getComponentContext();

                // change "null" > <noscript> en "null" > <script> pour éviter les violations de DOM !
                require("react/lib/ReactInjection").EmptyComponent.injectEmptyComponent("script");

                logger.trace("renderToString");
                var htmlApp:string = react.renderToString(this.configuration.appComponent({
                    composantPage: composant,
                    context: currentFluxibleContext
                }));

                // On rend la page entière en y intégrant l"appComponent rendu précédemment
                var html:string = react.renderToStaticMarkup(
                    this.configuration.layoutComponent({
                        composantApp: htmlApp,
                        context: currentFluxibleContext,
                        state: routeContext.res.locals.state
                    })
                );
                routeContext.res.send("<!DOCTYPE html>" + html);
                routeContext.res.end();
            } else {
                logger.trace("Autre réponse");
                routeContext.res.end();
            }
        });
        return currentPromise;
    }

    protected parseRoutes(routes:I.IRoutesBuilder, basePath?:string):Matcher.RouteMatcher {
        logger.debug("basePath:", basePath);
        var matcher = RouterAbstract.routeMatcherFactory();
        routes.buildViewRoutes(matcher.getMatcher(this, basePath));
        return matcher;
    }
}

export = RouterView;
