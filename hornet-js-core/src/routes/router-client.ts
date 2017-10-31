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
import { Class } from "hornet-js-utils/src/typescript-utils";
import { Router, DirectorRouter, DirectorRouterConfiguration } from "director";
import {
    AbstractRoutes,
    RouteHandler,
    RouteInfos,
    Routes,
    LazyRoutes,
    LazyRoutesAsyncClassResolver,
    RouteAuthorization
} from "src/routes/abstract-routes";
import * as _ from "lodash";
import { LazyClassLoader } from "hornet-js-utils/src/lazy-class-loader";
import { AsyncExecutor } from "src/executor/async-executor";
import {
    PAGE_READY_EVENT,
    ContextInitializerElement,
    UrlChangeElement,
    UserAccessSecurityElement,
    ViewRenderingElement,
    UnmanagedViewErrorElement
} from "src/routes/router-client-async-elements";
import { listenOnceHornetEvent } from "src/event/hornet-event";

const logger: Logger = Utils.getLogger("hornet-js-core.routes.router-client");

declare global {
    interface Window {
        setHornetJsGenerationServer: (enableValue: string) => void;
    }
}

export type DirectorClientRoutesDesc = {[key: string]: (...arg) => void};

export class RouterClient {
    private appComponent;
    private errorComponent;
    private pageRoutes: DirectorClientRoutesDesc = {};
    private appRoutes: AbstractRoutes;

    private directorPage: DirectorRouter;

    private directorClientConfiguration: DirectorRouterConfiguration;
    private lazyRoutesClassResolver: LazyRoutesAsyncClassResolver;

    constructor(appComponent, errorComponent, appRoutes: AbstractRoutes, lazyRoutesClassResolver: LazyRoutesAsyncClassResolver, directorClientConfiguration?: DirectorRouterConfiguration) {
        this.appComponent = appComponent;
        this.errorComponent = errorComponent;
        this.appRoutes = appRoutes;
        this.lazyRoutesClassResolver = lazyRoutesClassResolver;
        this.directorClientConfiguration = directorClientConfiguration;

        this.computeRoutes();

        logger.trace("routes chargées (PAGE) :", this.pageRoutes);
        this.directorPage = new Router(this.pageRoutes).configure({recurse: false, async: true});
    }

    private computeRoutes(routesObj = this.appRoutes, prefix: string = Utils.getContextPath(), directorRoutes = this.pageRoutes): void {
        this.parseRoutes(routesObj.getPageRoutes(), directorRoutes, prefix);

        var lazyRoutes = routesObj.getLazyRoutes();
        for (let lazy in lazyRoutes) {
            this.parseLazyRoute(this.pageRoutes, prefix + lazy, lazyRoutes[lazy]);
        }
    }

    private parseRoutes<T extends RouteInfos>(declaredRoutes: Routes<T>, internalObj: DirectorClientRoutesDesc, prefix: string) {
        for (var path in declaredRoutes) {
            for (var method in declaredRoutes[path]) {
                var uri = prefix + path;

                if (internalObj[uri]) {
                    throw new Error("Route duppliquée : ('" + uri + "' <" + method + ">)");
                }

                internalObj[uri] = this.buildRouteHandler(declaredRoutes, path, method);
            }
        }
    }

    private buildRouteHandler<T extends RouteInfos>(declaredRoutes: Routes<T>, path: string, method: string) {
        return (...params: Array<any>) => {
            var done = params.pop();
            this.handleRoute(done, declaredRoutes[path][method].authorization, declaredRoutes[path][method].handler, params);
            done();
        }
    }

    private parseLazyRoute(internalObj: DirectorClientRoutesDesc, prefix: string, routesClassPath: string) {
        var regPrefix = prefix + "/?((\w|.)*)";
        if (internalObj[regPrefix]) {
            throw new Error("Route duppliquée : ('" + regPrefix + "' <" + "get" + ">)");
        }

        internalObj[regPrefix] = (...params: Array<any>) => {
            var done = params.pop();

            try {
                var url = window.location.href;
                this.loadLazyRoutes(url, prefix, routesClassPath, (err) => {
                    logger.debug("Chargement routes lazy terminé pour :", prefix, "url demandée :", url);

                    if (err) throw err;
                    else done();
                })
            } catch (err) {
                logger.error("Erreur durant le chargement de la route lazy '" + prefix + "'", err);
                throw err;
            }
        }
    }

    private loadLazyRoutes(originalRoute: string, prefix: string, routesClassPath: string, done) {
        this.lazyRoutesClassResolver(routesClassPath, (lazyClass: Class<AbstractRoutes>) => {
            let newRoutes: DirectorClientRoutesDesc = {};
            let routesClass = LazyClassLoader.load(lazyClass);
            this.computeRoutes(new routesClass(), prefix, newRoutes);

            // suppression de la route "wildcard" gérant le lazy loading
            // _.set((this.directorPage as any).routes, (this.directorPage as any).getRoute().join("."), undefined);
            var lazyObjPath = prefix.split("/");
            lazyObjPath.shift();
            _.set((this.directorPage as any).routes, lazyObjPath.join("."), undefined);

            // montage des nouvelles routes
            this.directorPage.mount(newRoutes);

            // le chargement lazy est terminé
            done();

            // chargement de la route initialement demandée
            var iId = window.setInterval(() => {
                try {
                    this.setRoute(originalRoute);
                    window.clearInterval(iId);

                } catch (err) {
                    if (_.isFunction(window.onpopstate)) {
                        logger.error(err);
                        window.clearInterval(iId);
                        done(err);

                    } else {
                        // Exception liée au fonctionnement interne de director qui ne met la fonction onPopState qu'après 500ms
                        logger.trace("Exception prévue dans Director, retry");
                    }
                }
            }, 200);
        });
    }

    protected handleRoute<T extends RouteInfos>(done, authorization: RouteAuthorization, handler: RouteHandler<T>, params: Array<string>) {

        var executor = new AsyncExecutor();

        executor.setErrorAsyncElement(new UnmanagedViewErrorElement(this.errorComponent));

        executor.addElement(new ContextInitializerElement(authorization, handler, params));
        executor.addElement(new UrlChangeElement());
        executor.addElement(new UserAccessSecurityElement());
        executor.addElement(new ViewRenderingElement(this.appComponent));

        executor.on("end", (err) => {
            if (err) {
                logger.error("Erreur de route", err);
                throw err;
            } else done();
        });
        executor.execute();
    }

    /**
     * Méthode utilisée par la partie cliente pour initialiser le routeur
     */
    startRouter(baseElement: Document | Element = document) {
        // installer la fonction de parametrage "setHornetJsGenerationServer" sur le client
        RouterClient.setHornetJsGenerationServer();

        /**
         * Intercept any links that don't have 'data-pass-thru' or '#' and route using pushState.
         */
        baseElement.addEventListener('click', (e: MouseEvent) => {
            if (e.button != 0) return; // On ne prend que les clicks gauche
            var el = e.target as any;
            while (el) {
                if (el.nodeName === 'A') {
                    var link = el.attributes && el.attributes.href && el.attributes.href.value || '';
                    var download = el.attributes && el.attributes.download && el.attributes.download.value || '';

                    // Cas des liens vides ou les actions
                    if (link.length === 0 || link === '#') {
                        e.preventDefault();
                        return;
                    }

                    // Cas des liens dynamique pour download de fichier
                    if (download.length !== 0) {
                        return;
                    }

                    //TODO: Gérer les exports

                    // Gestion des ancres
                    if (link.indexOf('#') === 0)return;//startsWith('#')
                    var dataset = el && el.getAttribute('data-pass-thru');
                    if (dataset !== 'true') {
                        this.directorPage.setRoute(link);
                        e.preventDefault();
                    }
                    return;
                } else {
                    el = el.parentElement || el.parentNode;
                }
            }
        }, false);

        this.directorPage.configure(_.merge({
            html5history: true,
            strict: false,
            convert_hash_in_init: false,
            recurse: false,
            notfound: function() {
                alert("Erreur. Cette route n'existe pas: '" + this.path + "'");
            }
        }, this.directorClientConfiguration, {
            async: true // on force l'async à true
        }));

        /**
         * Démarrage du routeur
         */
        this.directorPage.init();
    }

    /**
     * Demande un changement d'url dans la barre d'adresse du navigateur (et donc un changement de route) mais sans recharger la page
     */
    setRoute(route: string, pageReady?: () => void) {
        if (pageReady && _.isFunction(pageReady)) {
            listenOnceHornetEvent(PAGE_READY_EVENT, pageReady);
        }
        this.directorPage.setRoute(route);
    }

    /**
     * Monte les routes dans director
     * @param newRoutes
     */
    mountRoutes(newRoutes: DirectorClientRoutesDesc) {
        this.directorPage.mount(newRoutes);
    }

    /**
     * Retourne un objet contenant les paramètres présents dans l'url. Exemple: page?param1=XX&param2=YY => {param1:XX, param2:YY}
     * @param url L'URL à parser
     * @returns {{}}
     */
    static getUrlParameters(url: string): any {
        if (url === "")
            return {};

        // On s'assure d'avoir un '?'
        var urls = url.split('?');
        if (urls.length === 1) {
            return {};
        }

        // On enlève tout ce qui est avant le premier '?'
        url = urls.slice(1, urls.length).join('?');

        var b = {};
        if (url.charAt(0) === '?') {
            url = url.substr(1);
        }

        var a = url.split('&');
        for (var i = 0; i < a.length; ++i) {
            var p = a[i].split('=');
            if (p.length != 2)
                continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    }


    static LOCAL_STORAGE_ENABLE_GENERATION_SERVER_KEY = "hornet-js.enable.generation.server";
    static defaultGenerationServerEnabled: string = "false";

    /**
     * mantis 0055411
     * Met a disposition une fonction sur le browser (window.setHornetJsGenerationServer)
     * Appellée depuis du code client, cette fonction permet de changer  l'option de paramétrage
     * pour activer ou désactiver la generation des pages côté serveur (cf usage getHornetJsGenerationServer)
     * Cette option est stockée dans le navigateur au niveau du localStorage,
     * elle peut donc aussi être modifié manuellement par l'utilisateur
     *
     * Attention, ne pas activer l'option en mode fullSpa
     * (elle n'a d'interet qu'avec le serveur node)
     */
    static setHornetJsGenerationServer(): void {
        if (window.localStorage) {
            if (!window.setHornetJsGenerationServer) {
                window.setHornetJsGenerationServer = function(enableValue: string) {
                    var enableGenerationServer: string = (!enableValue || enableValue === "null" || enableValue === "undefined") ? RouterClient.defaultGenerationServerEnabled : enableValue;
                    logger.trace("New value for setHornetJsGenerationServer :", enableValue, ". Reload page (F5) to activate");
                    window.localStorage.setItem(RouterClient.LOCAL_STORAGE_ENABLE_GENERATION_SERVER_KEY, enableGenerationServer);
                };
            }
        } else {
            logger.trace("ERREUR: Browser doesn't support LocalStorage");
        }
    }

    /**
     * Getter pour récuperer la valeur de l'option de paramétrage "hornet-js.enable.generation.server"
     * Cette option true/false permet d'activer ou désactiver la generation des pages côté serveur
     * Lecture du localStorage d'abord (si supporté et contient la valeur), et sinon valeur par défaut (false)
     *
     * @returns {any}
     */
    static getHornetJsGenerationServer(): any {
        if (window.localStorage) {
            return window.localStorage.getItem(RouterClient.LOCAL_STORAGE_ENABLE_GENERATION_SERVER_KEY) || RouterClient.defaultGenerationServerEnabled;
        } else {
            logger.trace("ERREUR: Browser doesn't support LocalStorage");
            return RouterClient.defaultGenerationServerEnabled;
        }
    }
}