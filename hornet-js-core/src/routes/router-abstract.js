///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";
var utils = require("hornet-js-utils");
var Action = require("src/actions/action");
var ExtendedPromise = require("hornet-js-utils/src/promise-api");
var director = require("director");
var MediaType = require("src/protocol/media-type");
var Matcher = require("src/routes/route-matcher");
//plugin fluxible pour passer les messages d'i18n et les avoir dans les contextes fluxible
var I18nPlugin = require("src/i18n/i18n-fluxible-plugin");
var N = require("src/routes/notifications");
var WError = utils.werror;
var logger = utils.getLogger("hornet-js-core.routes.router-abstract");
var _ = utils._;
var DirectorRouter = utils.isServer ? director.http.Router : director.Router;
var SimpleAction = require("src/actions/simple-action");
var ActionsChainData = require("src/routes/actions-chain-data");
var validateUserAccessAction = require("src/actions/validate-user-access-action");
var PageInformationsStore = require("src/stores/page-informations-store");
/**
 * Fonction permettant de charger dynamiquement les composants
 * DESACTIVEE car ce sont les routes qui ont cette fonction de lazy loading maintenant
 * @param name
 */
function componentLoader(name) {
    throw new Error("ERROR: DO NOT USE THE COMPONENT LAZY LOADING");
}
var RouterAbstract = (function () {
    function RouterAbstract(config) {
        if (!config) {
            throw new Error("must provide appConfig configuration.");
        }
        if (utils.isServer) {
            var appConfig1 = config;
            this.configuration = {
                defaultRoutesClass: appConfig1.defaultRoutesClass,
                appComponent: appConfig1.appComponent,
                layoutComponent: appConfig1.layoutComponent,
                errorComponent: appConfig1.errorComponent,
                componentLoaderFn: appConfig1.componentLoaderFn || componentLoader,
                routesLoaderfn: appConfig1.routesLoaderfn,
                dispatcherLoaderFn: RouterAbstract.prepareInternationalizationContextFunction(appConfig1),
                themeUrl: utils.config.getOrDefault("themeUrl", utils.buildStaticPath("/")),
                menuConfig: appConfig1.menuConfig,
            };
        }
        else {
            var appConfig2 = config;
            this.configuration = {
                defaultRoutesClass: appConfig2.defaultRoutesClass,
                appComponent: appConfig2.appComponent,
                errorComponent: appConfig2.errorComponent,
                componentLoaderFn: appConfig2.componentLoaderFn || componentLoader,
                routesLoaderfn: appConfig2.routesLoaderfn,
                dispatcherLoaderFn: function () {
                    return appConfig2.fluxibleContext;
                },
                contextPath: utils.buildContextPath("/")
            };
        }
        var routeMatcher = this.parseRoutes(this.configuration.defaultRoutesClass, this.configuration.contextPath);
        logger.debug("routes chargées :", routeMatcher.routes);
        this.directorRouter = new DirectorRouter(routeMatcher.routes)
            .configure({
            recurse: false
        });
        if (utils.isServer && routeMatcher.lazyRoutes.length > 0) {
            logger.debug("[SERVEUR] : Lazy loading routes");
            this.loadLazyRoutesRecursively(routeMatcher.lazyRoutes);
        }
        // L'initialisation client est faite dans la fonction start()
        // L'initialisation serveur est faite avec le middleware
    }
    RouterAbstract.prepareInternationalizationContextFunction = function (appConfig) {
        var getContextFluxiblefunction;
        // Instanciation Fluxible
        // Prépare le plugin qui sera valorisé à chaque requête par la méthode  getDispatcher
        var plugIntl = new I18nPlugin();
        appConfig.dispatcher.plug(plugIntl.createPlugin());
        //détermine le type de loader
        if (appConfig.internationalization && _.isFunction(appConfig.internationalization.getMessages)) {
            //nous sommes avec un type AppInternationalizationLoader
            var loaderIntl = appConfig.internationalization;
            //créer à chaque requête
            getContextFluxiblefunction = function (locales) {
                var fluxibleContext = appConfig.dispatcher.createContext(loaderIntl.getMessages(locales));
                return fluxibleContext;
            };
        }
        else if (appConfig.internationalization && _.isObject(appConfig.internationalization)) {
            //le développeur a passé une chaine de caractère qui doit être un flux JSON représentant les messages de l'application au moins les basics pour les composants
            getContextFluxiblefunction = function (locales) {
                //peut import la local toujours les même messages
                var fluxibleContext = appConfig.dispatcher.createContext({
                    "locale": "",
                    "messages": appConfig.internationalization
                });
                return fluxibleContext;
            };
        }
        else {
            //throw new Error("Vous devez définir une variable internationalization dans la configuration du serveur. Se reporter à la documentation");
            //messages nécessaire au framework
            getContextFluxiblefunction = function (locales) {
                var fluxibleContext = appConfig.dispatcher.createContext({
                    "locale": "",
                    "messages": require("../i18n/hornet-messages-components")
                });
                return fluxibleContext;
            };
        }
        return getContextFluxiblefunction;
    };
    /**
     * Construit les routes en appliquant la fonction de matching sur les routes
     * @param routes
     * @param basePath Le Path de base de ces routes (utilisé pour les logs uniquement)
     * @returns {any}
     */
    RouterAbstract.prototype.parseRoutes = function (routes, basePath) {
        logger.debug("This method should be overridden");
        throw new Error("This method is abstract");
        return null;
    };
    /**
     * Charge de manière récursive toutes les routes 'lazy' et les ajoute au routeur
     * @param lazyRoutes
     */
    RouterAbstract.prototype.loadLazyRoutesRecursively = function (lazyRoutes) {
        if (lazyRoutes && lazyRoutes.length > 0) {
            var router = this;
            _.forEach(lazyRoutes, function (lazyRouteInfos) {
                var routesClass = router.configuration.routesLoaderfn(lazyRouteInfos.fileToLoad);
                logger.debug("Chargement OK des nouvelles routes du path : ", lazyRouteInfos.path);
                var newRoutes = router.parseRoutes(new routesClass(), lazyRouteInfos.path);
                router.directorRouter.mount(newRoutes.routes, lazyRouteInfos.path);
                //On charge récursivement si besoin
                router.loadLazyRoutesRecursively(newRoutes.lazyRoutes);
            });
        }
    };
    /**
     * Construit une fonction qui est exécutée par le routeur lorsque la route correspondante au handler est appliquée
     * @param handler
     * @returns {function(): undefined}
     */
    RouterAbstract.prototype.buildRouteHandler = function (handler) {
        var router = this;
        return function () {
            var routeContext = this;
            var parameters = Array.prototype.slice.call(arguments);
            router.handleRoute(routeContext, handler, parameters);
        };
    };
    RouterAbstract.prototype.loadRoutes = function (currentPromise, routeInfos, routeContext, fluxibleContext) {
        var _this = this;
        if (_.isObject(routeInfos.lazyRoutesParam)) {
            //currentPromise = currentPromise.then(this.buildRoutesLoaderResolver(routeInfos.lazyRoutesParam.fileToLoad));
            fluxibleContext.dispatch(Action.ASYNCHRONOUS_REQUEST_START);
            currentPromise = this.buildRoutesLoaderResolver(currentPromise, routeInfos.lazyRoutesParam.fileToLoad);
            currentPromise = currentPromise.then(function (routesClass) {
                logger.debug("Chargement OK des nouvelles routes du path: ", routeInfos.lazyRoutesParam.path);
                var currentRouteArray = routeContext.getRoute();
                logger.trace("Parsing de la route courante:", currentRouteArray);
                var currentRouteInRouter = routeContext.routes;
                _.forEach(currentRouteArray, function (path) {
                    if (_.isObject(currentRouteInRouter[path])) {
                        logger.debug("On avance dans les routes:", path);
                        currentRouteInRouter = currentRouteInRouter[path];
                    }
                    else {
                        logger.debug("Ce path n\'existe pas dans les routes:", path);
                    }
                });
                //Suppressions des routes qui n'ont plus lieu d'exister
                _.forOwn(currentRouteInRouter, function (value, key) {
                    logger.trace("Suppression route:", key);
                    delete currentRouteInRouter[key];
                });
                try {
                    logger.debug(routesClass);
                    var newRoutes = _this.parseRoutes(new routesClass());
                    logger.debug("Montage des routes:", newRoutes.routes);
                    _this.directorRouter.mount(newRoutes.routes, routeInfos.lazyRoutesParam.path);
                    logger.debug("Montage des routes (Fin)");
                    _this.currentParam = routeContext.req.body;
                    var cancelIntervalId = setInterval(function () {
                        try {
                            _this.directorRouter.setRoute(_this.currentUrl);
                            clearInterval(cancelIntervalId);
                            fluxibleContext.dispatch(Action.ASYNCHRONOUS_REQUEST_END_SUCCESS);
                        }
                        catch (err) {
                            if (_.isFunction(window.onpopstate)) {
                                logger.error(err);
                                clearInterval(cancelIntervalId);
                                fluxibleContext.dispatch(Action.ASYNCHRONOUS_REQUEST_END_ERROR, err);
                            }
                            else {
                                //Exception liée au fonctionnement interne de director qui ne met la fonction onPopState qu'après 500ms
                                logger.debug("Exception prévue, retry");
                            }
                        }
                    }, 200);
                }
                catch (err) {
                    logger.error("Loading routes Erreur:", err);
                    throw err;
                }
            });
        }
        //On arrête le chargement ici
        return currentPromise;
    };
    RouterAbstract.prototype.manageErrors = function (currentPromise, fluxibleContext, routeInfos, routeContext) {
        currentPromise = currentPromise.fail(function routeurGestionDesErreursFn(actionChainData) {
            logger.debug("Enter routeurGestionDesErreursFn");
            var headers = routeContext.req.headers || {};
            var acd = actionChainData;
            if (acd.isAccessForbidden) {
                if (utils.isServer) {
                    routeContext.res.status(403);
                }
                acd.lastError = new WError(fluxibleContext.getActionContext().i18n("authError"));
            }
            if (headers["accept"] === utils.CONTENT_JSON) {
                logger.debug("routeurGestionDesErreursFn Cas de headers CONTENT_JSON ou accès interdit => return actionChainData");
                return acd;
            }
            else {
                var notificationsError = new N.Notifications();
                var renduPossible = false;
                if (acd.formError) {
                    var formErrors = acd.formError;
                    // Gestion des erreurs dans les formulaires
                    logger.debug("Gestion des erreurs dans les formulaires, renduPossible=", renduPossible);
                    for (var field in formErrors.errors) {
                        if (formErrors.errors.hasOwnProperty(field)) {
                            formErrors.errors[field].data.forEach(function (error) {
                                var erreurNotification = new N.NotificationType();
                                erreurNotification.id = "ACTION_ERREUR_" + field + "_" + error.code;
                                erreurNotification.text = error.message;
                                erreurNotification.anchor = field + "_anchor";
                                erreurNotification.field = field;
                                notificationsError.addNotification(erreurNotification);
                            });
                        }
                    }
                    renduPossible = true;
                }
                else if (acd.result && acd.result.ex) {
                    renduPossible = true;
                    logger.debug("Gestion des exceptions dans les formulaires, renduPossible=", renduPossible);
                    var erreurNotification = new N.NotificationType();
                    erreurNotification.id = acd.result.ex + "_" + acd.result.numErreur;
                    erreurNotification.text = "error.messages." + acd.result.ex;
                    notificationsError.addNotification(erreurNotification);
                }
                else {
                    logger.debug("Gestion des erreurs hors formulaires, renduPossible=", renduPossible);
                    logger.error("Erreur:", acd.lastError && acd.lastError.stack);
                    var erreurNotification = new N.NotificationType();
                    erreurNotification.id = "ACTION_ERREUR_" + acd.lastError;
                    erreurNotification.text = "Une erreur technique est survenue:" + acd.lastError;
                    notificationsError.addNotification(erreurNotification);
                }
                // Pour le rendu isomorphique: on indique si on est capable de rendre le composant afin de permettre au navigateur de savoir quoi faire lors du premier rendu
                notificationsError.canRenderRealComponent = renduPossible;
                return new SimpleAction(SimpleAction.EMIT_ERR_NOTIFICATION)
                    .withContext(fluxibleContext.getActionContext())
                    .withPayload(notificationsError)
                    .promise(acd);
            }
        });
        return currentPromise;
    };
    RouterAbstract.prototype.manageResultType = function (currentPromise, fluxibleContext, routeInfos, routeContext) {
        return currentPromise;
    };
    /**
     * Ajoute à la promise courante une action permettant de valider que l'utilisateur actuellement loggué à accès à la ressource demandée. Note
     * @param currentPromise
     * @param fluxibleContext
     * @param routeInfos
     * @param routeContext
     * @return {ExtendedPromise<any>}
     */
    RouterAbstract.prototype.validateUserAccess = function (currentPromise, fluxibleContext, routeInfos, routeContext) {
        // cas de la redirection vers la page de login si page avec rôles et pas connecté
        if (!utils.isServer) {
            var store = fluxibleContext.getActionContext().getStore(PageInformationsStore);
            if (!store.isAuthenticated() && routeInfos.roles && routeInfos.roles.length > 0) {
                logger.debug("Passage d'une page publique vers une page privée sans utilisateur, redirection vers la page de login");
                window.location.href = utils.buildContextPath(utils.appSharedProps.get("loginUrl")) + "?previousUrl=" + window.location.href;
                // hack permettant de couper la chaine des promise pour ne pas faire d'actions inutiles
                // car la redirection navigateur est asynchrone et ne coupe pas l'exécution du javascript en cours
                return currentPromise.stop();
            }
        }
        logger.debug("Vérification des roles");
        currentPromise = currentPromise.then(function (actionsChainData) {
            return new validateUserAccessAction()
                .withContext(fluxibleContext.getActionContext())
                .withPayload({
                user: routeContext.req.user,
                accessRetrictedToRoles: routeInfos.roles
            })
                .promise(actionsChainData);
        });
        return currentPromise;
    };
    /**
     * Fonction appelée lorsqu'une route doit être appliquée
     * @param routeContext Le contexte courant de lrequete
     * @param handler La fonction permettant d'exécuter le code associé à la route
     */
    RouterAbstract.prototype.handleRoute = function (routeContext, handler, parameters) {
        logger.debug("this method should be overridden");
        throw new Error("This method is abstract");
    };
    /**
     * @param component composant React à charger
     * @returns {ExtendedPromise} promise effectuant le chargement du composant React indiqué
     */
    RouterAbstract.prototype.buildComponentResolver = function (composant) {
        var _this = this;
        return new ExtendedPromise(function (resolveFn, rejectFn) {
            try {
                //logger.trace("buildComponentResolver composant : ", composant);
                if (_.isString(composant)) {
                    _this.configuration.componentLoaderFn(composant, resolveFn);
                }
                else {
                    resolveFn(composant);
                }
            }
            catch (err) {
                logger.error("Error of component loading :" + err);
                rejectFn(new WError("Error of component loading :" + err));
            }
        });
    };
    RouterAbstract.prototype.buildRoutesLoaderResolver = function (currentPromise, routesUrl) {
        var _this = this;
        return currentPromise.then(function () {
            return new ExtendedPromise(function (resolveFn) {
                logger.debug("buildNewRoutesResolver routes :", routesUrl);
                _this.configuration.routesLoaderfn(routesUrl, resolveFn);
            });
        });
    };
    RouterAbstract.prototype.handleErrBuilder = function (routeContext) {
        var _this = this;
        return function (err) {
            logger.debug("from handleErrBuilder");
            _this.handleErr(err, routeContext);
        };
    };
    /**
     * Méthode de gestion des erreurs de routage
     * @param err L'erreur associée
     * @param routeContext Sur le serveur uniquement: fourni le context courant
     */
    RouterAbstract.prototype.handleErr = function (err, routeContext) {
        logger.error("Erreur non gérée par le routeur et transmise au middleware suivant :", err.name, err.message, err);
        //logger.debug("routeContext: ", routeContext);
        if (utils.isServer) {
            if (routeContext.next) {
                logger.debug("routeContext.next");
                routeContext.next(err);
            }
            else {
                //Pas moyen d'appeler le prochain middleware donc on ferme le flux
                routeContext.res.status(500);
                routeContext.res.send(err);
            }
        }
        else {
            /* Erreur non gérée par le router côté client : on affiche tout de même une notification d'erreur */
            if (routeContext && routeContext.actionContext) {
                var notifs = N.Notifications.makeSingleNotification("ROUTER_ERROR", "Erreur technique :" + err);
                new SimpleAction(SimpleAction.EMIT_ERR_NOTIFICATION)
                    .withContext(routeContext.actionContext)
                    .withPayload(notifs)
                    .promise(new ActionsChainData());
            }
        }
    };
    /**
     * Méthode utilisée par la partie serveur pour initialiser le routeur.
     * Note: Fourni un middleware Express
     */
    RouterAbstract.prototype.middleware = function () {
        var directorRouter = this.directorRouter;
        return function middleware(req, res, next) {
            // Dispatch the request to the Director router.
            directorRouter.dispatch(req, res, function (err) {
                // When a 404, just forward on to next Express middleware.
                logger.debug("directorRouter.dispatch: ", err);
                if (err && err.status === 404) {
                    next();
                }
            });
        };
    };
    /**
     * Méthode utilisée par la partie cliente pour initialiser le routeur
     */
    RouterAbstract.prototype.startClient = function (bootstrappedData) {
        this.bootstrappedData = bootstrappedData;
        /**
         * Intercept any links that don't have 'data-pass-thru' or '#' and route using pushState.
         */
        document.addEventListener("click", function (e) {
            if (e.button != 0)
                return; // On ne prend que les clicks gauche
            var el = e.target;
            while (el) {
                if (el.nodeName === "A") {
                    var link = el.attributes && el.attributes.href && el.attributes.href.value || '';
                    // Cas des liens vides ou les actions
                    if (link.length === 0 || link === "#") {
                        e.preventDefault();
                        return;
                    }
                    ; // On bypass les liens qui ne pointent null part
                    var params = RouterAbstract.getUrlParameters(link);
                    if (_.isString(params[MediaType.MEDIATYPE_PARAMETER])) {
                        // Demande d'export, on n'appelle pas director
                        return;
                    }
                    // Gestion des ancres
                    if (link.indexOf("#") === 0)
                        return; //startsWith("#")
                    var dataset = el && el.getAttribute("data-pass-thru");
                    if (dataset !== "true") {
                        this.directorRouter.setRoute(link);
                        e.preventDefault();
                    }
                    return;
                }
                else {
                    el = el.parentElement || el.parentNode;
                }
            }
        }.bind(this), false);
        /**
         * Configure director avec:
         * <ul>
         * <li>html5history: indique d'utiliser le mode html5 history plutot que le mode hash (url#ancre)</li>
         * <li>strict: indique d'accepter aussi bien une url 'appli/maRessource' que 'appli/maRessource/'</li>
         * <li>convert_hash_in_init: indique de ne pas convertir les url 'monUrl#ancre' au chargement pour ne pas générer une route erronnée du type: 'monurl/ancre'</li>
         * <li>recurse: désactive l'exécution des routes de manière récursive</li>
         * </ul>
         */
        this.directorRouter.configure({
            html5history: true,
            strict: false,
            convert_hash_in_init: false,
            recurse: false,
            'notfound': function () {
                logger.error("Erreur. Cette route n'existe pas :'" + this.path + "'");
            }
        });
        /**
         * Démarrage du routeur
         */
        this.directorRouter.init();
    };
    /**
     * Permet de simuler un changement de route sans changer l'url dans la barre d'adresse du navigateur.
     * Cette fonction est utilisée pour les cas de POST qui ne doivent pas modifier l'adresse.
     * Note: Cette fonction étant utilisée uniquement côté client, le fait de mettre le currentParam directement dans le
     * routeur ne pose pas de problème de multiThreading
     * @param url L'url à appeler
     * @param param L'objet contenant les paramètres à fournir à la route
     */
    RouterAbstract.prototype.setRouteInternal = function (url, param) {
        this.currentParam = param;
        this.currentUrl = url;
        if (url) {
            this.directorRouter.dispatch("on", url.charAt(0) === "/" ? url : "/" + url);
        }
        else {
            logger.warn("setRouteInternal : Routes non définie!!!", param);
        }
    };
    /**
     * Méthode côté client pour demander un changement d'url dans la barre d'adresse du navigateur (et donc un changement de route)
     */
    RouterAbstract.prototype.setRoute = function (route) {
        this.directorRouter.setRoute(route);
    };
    /**
     * Retourne un objet contenant les paramètres présents dans l'url. Exemple: page?param1=XX&param2=YY => {param1:XX, param2:YY}
     * @param url L'URL à parser
     * @returns {{}}
     */
    RouterAbstract.getUrlParameters = function (url) {
        if (url === "")
            return {};
        // On s'assure d'avoir un '?'
        var urls = url.split("?");
        if (urls.length === 1) {
            return {};
        }
        // On enlève tout ce qui est avant le premier '?'
        url = urls.slice(1, urls.length).join("?");
        var b = {};
        if (url.charAt(0) === "?") {
            url = url.substr(1);
        }
        var a = url.split("&");
        for (var i = 0; i < a.length; ++i) {
            var p = a[i].split("=");
            if (p.length != 2)
                continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    };
    RouterAbstract.routeMatcherFactory = function () {
        return new Matcher.RouteMatcher();
    };
    /**
     * Cette fonction est appellée avant le premier appel à 'chainActions'
     * Elle permet d'initialiser l'objet qui sera transmis d'Action en Action (de promise en promise)
     *
     * L'objet transmis dans la chaine d'action est de type 'ActionsChainData'
     * Il peut être initialisé dans la configuration de la route si il y a besoin de le surcharger,
     * sinon il est instancié ici
     *
     * @param currentPromise : la promise sur laquelle vont être chainées les actions
     * @param chainDataRoute : l'objet défini dans la configuration de la route (peut être undefined / null)
     * @param req : la request pour accèder au content-type demandé
     * @returns {ActionExtendedPromise} : la promise sur laquelle vont être chainées les actions
     */
    RouterAbstract.prototype.initActionChainData = function (currentPromise, chainDataRoute, req) {
        logger.trace("Initialisation de l'objet ActionChainData");
        var actionsChainData = null;
        if (chainDataRoute) {
            logger.trace("L'objet ActionChainData a été défini dans la route, on l'utilise");
            actionsChainData = chainDataRoute;
        }
        else {
            logger.trace("L'objet ActionChainData n'a pas été défini dans la route, on instancie celui par défaut");
            actionsChainData = new ActionsChainData();
        }
        var mimeType;
        // Récupération du paramètre de l'URL 'mediaType'
        var mediaTypeUrl = req.query && req.query[MediaType.MEDIATYPE_PARAMETER];
        if (mediaTypeUrl) {
            // si le paramètre est présent, récupération du mimeType associé
            logger.trace("Le parametre mediaType a été défini dans l'URL : ", mediaTypeUrl);
            mimeType = MediaType.fromParameter(mediaTypeUrl).MIME;
            logger.trace("MIME correspondant : ", mimeType);
        }
        else {
            mimeType = req.headers && req.headers['accept'];
            logger.trace("Le MIME a été défini dans le header: ", mimeType);
        }
        actionsChainData.requestMimeType = mimeType;
        actionsChainData.responseMimeType = mimeType;
        logger.trace("Le mimeType demandé est : ", mimeType);
        currentPromise = currentPromise.then(function () {
            return actionsChainData;
        });
        return currentPromise;
    };
    /**
     * Gère le chainage des actions (pré-actions / actions / post-actions)
     *
     * @param currentPromise : la promise déjà initialisée
     * @param actionContext : le contexte d'action Fluxible
     * @param actions : le tableau de type Action
     * @returns {ExtendedPromise<any>}
     */
    RouterAbstract.prototype.chainActions = function (currentPromise, actionContext, actions) {
        logger.debug(actions && actions.length || 0, "étape(s) d'action");
        if (actions) {
            actions.map(function (element) {
                element.withContext(actionContext);
                currentPromise = currentPromise.then(function (value) {
                    return element.promise(value);
                });
            });
        }
        return currentPromise;
    };
    return RouterAbstract;
})();
module.exports = RouterAbstract;
//# sourceMappingURL=router-abstract.js.map