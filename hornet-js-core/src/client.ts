"use strict";
import utils = require("hornet-js-utils");
utils.setConfigObj((<any>window).Config);
utils.appSharedProps.rehydrate((<any>window).AppSharedProps);
var WError = utils.werror;

import Logger = require("hornet-js-utils/src/logger");
import ClientLog = require("src/log/client-log");
Logger.prototype.buildLogger = ClientLog.getLoggerBuilder(utils.config.getOrDefault("logClient", {}));

import react = require("react");
import PageInformationsStore = require("src/stores/page-informations-store");
import RouterView = require("src/routes/router-view");
import i18nPlugin = require("src/i18n/i18n-fluxible-plugin");
import ExtendedPromise = require("hornet-js-utils/src/promise-api");
import ClientConfiguration = require("src/client-conf");
declare var __webpack_public_path__:string;


class Client {

    static  internationalisationWebpackLoader(callback:any) {
        // Fonction de chargement asynchrone permettant de charger le polyfill 'intl' au besoin
        (<any>require)(["intl"], callback);
    }

    /**
     * Cette fonction initialise complètement le client avec le routage applicatif.
     *
     * Elle effectue les opérations suivantes:
     * <ul>
     *      <li> Réhydratation des stores et de la configuration applicative</li>
     *      <li> Enregistrement d'une fonction de callback spéciale auprès du 'PageInformationsStore' afin de lancer le premier rendu React une fois la première route résolue</li>
     *      <li> Configuration du routeur 'director' afin d'initialiser toutes les routes applicatives</li>
     *      <li> Démarrage du routeur</li>
     * </ul>
     * @param appConfig
     */
    static initAndStart(appConfig:ClientConfiguration, readyCallback:Function) {

        var logger = utils.getLogger("hornet-js-core.client");
        logger.trace("Enter initAndStart");

        __webpack_public_path__ = utils.buildStaticPath("/js") + "/";

        var currentPromise = <ExtendedPromise<any>>ExtendedPromise.resolve();
        // Patch pour l'internationalisation, valorise l'objet Intl s'il n'existe pas.
        if (!(<any>window).Intl) {
            logger.warn("Chargement d'une librairie remplacant Intl qui n'est pas supportée par ce navigateur");

            currentPromise = new ExtendedPromise(function (resolveFn) {
                Client.internationalisationWebpackLoader(resolveFn);
            });
            currentPromise = currentPromise.then(function (intlPolyfill) {
                (<any>window).Intl = intlPolyfill;
            });
        }

        logger.trace("currentPromise = ", currentPromise);

        currentPromise = currentPromise.then(function () {
            // Prépare le plugin qui sera valorisé par réhydratation
            var plugIntl = new i18nPlugin();
            appConfig.dispatcher.plug(plugIntl.createPlugin());
            // Création du contexte unique pour le client
            var fluxibleContext:FluxibleContext = appConfig.fluxibleContext = appConfig.dispatcher.createContext();
            // On réinjecte les stores et la conf

            try {
                fluxibleContext.rehydrate((<any>window).App);
            } catch (exc) {
                var message:string = "Erreur lors du rehydrade du context fluxible côté client";
                logger.error(message, exc);
            }

            logger.trace("fluxibleContext rehydrate done");

            var pageInformationStore = fluxibleContext.getActionContext().getStore(PageInformationsStore);

            function initAppFn() {
                try {
                    if (!pageInformationStore.getCurrentPageComponent()) {
                        logger.trace("Attente du prochain évènement avant de charger le client");
                        return;
                    }

                    logger.trace("initAppFn : react render");

                    // change "null" > <noscript> en "null" > <script> pour éviter les violations de DOM !
                    require("react/lib/ReactInjection").EmptyComponent.injectEmptyComponent("script");

                    react.render(
                        appConfig.appComponent({
                            componentContext: fluxibleContext.getComponentContext(),
                            context: fluxibleContext.getComponentContext()
                        }),
                        document.getElementById("app"),
                        function () {
                            logger.info("Application démarrée côté client !");
                        }
                    );

                    logger.trace("removeChangeListener initAppFn");
                    pageInformationStore.removeChangeListener(initAppFn);

                    if (_.isFunction(readyCallback)) {
                        logger.trace("readyCallback");
                        readyCallback();
                    }
                } catch (exc) {
                    var message:string = "Erreur lors du premier rendu react côté client";
                    logger.error(message, exc);
                    var error = new WError(exc, message);
                    error.name = " ";
                    throw error;
                }
            }

            logger.trace("addChangeListener initAppFn");
            pageInformationStore.addChangeListener(initAppFn);

            logger.trace("setCsrf initAppFn");
            utils.csrf = (<any>window).CsrfToken;

            var routeur = new RouterView(appConfig);
            (<any>window).routeur = routeur;

            routeur.startClient();
        });

        return currentPromise;
    }
}

export = Client;
