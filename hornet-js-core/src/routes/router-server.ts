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
import { http, DirectorRouter } from "director";
import {
    AbstractRoutes,
    RouteHandler,
    RouteInfos,
    Routes,
    LazyRoutes,
    LazyRoutesClassResolver,
    RouteAuthorization,
    RouteType
} from "src/routes/abstract-routes";
import { LazyClassLoader } from "hornet-js-utils/src/lazy-class-loader";
import * as _ from "lodash";
import * as Http from "http";
import { NotFoundError } from "hornet-js-utils/src/exception/not-found-error";


const logger: Logger = Utils.getLogger("hornet-js-core.routes.router-server");

type DirectorRoutesDesc = { [ key: string ]: { [ key: string ]: (...arg) => void } };

export class RouterServer {
    private dataRoutes: DirectorRoutesDesc = {};
    private pageRoutes: DirectorRoutesDesc = {};
    private appRoutes: AbstractRoutes;

    private directorData: DirectorRouter;
    private directorPage: DirectorRouter;

    private lazyRoutesClassResolver: LazyRoutesClassResolver;

    private dataContext: String = "/services";

    constructor(appRoutes: AbstractRoutes, lazyRoutesClassResolver: LazyRoutesClassResolver, routesPaths: Array<string>, routesDataContext: String = "/services") {
        this.appRoutes = appRoutes;
        this.lazyRoutesClassResolver = lazyRoutesClassResolver || appRoutes.getDefaultRouteLoader(routesPaths);
        this.dataContext = routesDataContext;
        this.computeRoutes();

        logger.trace("routes chargées (PAGE) :", this.pageRoutes);
        logger.trace("routes chargées (DATA) :", this.dataRoutes);

        this.directorData = new http.Router(this.dataRoutes).configure({ recurse: false, async: true });
        this.directorPage = new http.Router(this.pageRoutes).configure({ recurse: false, async: true });

        /** GESTION DES PUBLIC_ROUTES **/
        // les PUBLIC_ROUTES ne sont pas interprétées comme telles, car la méthode isAuthenticated (PASSPORT) est exécutée avant l'instanciation de DIRECTOR
        // La méthode isAuthenticated de passport est donc surchargée dans le cas d'une PUBLIC_ROUTE
        const req = (<any>Http).IncomingMessage.prototype;

        if (!req.__oldIsAuthenticated__) {
            req.__oldIsAuthenticated__ = req.isAuthenticated;
        }

        req.isAuthenticated = function () {

            let routesInfos = (<any>global).routesInfos;
            let _req = this;
            let isAuthenticated = false;

            let directorPage = new http.Router(routesInfos).configure({ recurse: false, async: true });
            let fns = (<any>directorPage).traverse(_req.method.toLowerCase(), _req.url, (<any>directorPage).routes, '',
                (route) => {
                    if (Array.isArray(route.authorization) && route.authorization.length == 0) {
                        isAuthenticated = true;
                    } else {
                        isAuthenticated = _req.__oldIsAuthenticated__();
                    }
                });

            if (!fns) {
                this.unknowedRoute = true;
                return _req.__oldIsAuthenticated__();
            }

            return isAuthenticated;
        }
    }

    /**
     * Méthode utilisée par la partie serveur pour initialiser le routeur.
     * Note: Fourni un middleware Express
     */
    dataMiddleware() {
        var directorData = this.directorData;
        return function middleware(req: Express.Request, res: Express.Response, next) {
            if (Utils.getCls("hornet.routeType") !== RouteType.DATA) return next();

            directorData.dispatch(req, res, function (err) {
                if (err) {
                    if (err.status && err.status == 404) {
                        err = new NotFoundError({ errorMessage: err.message }, err);
                    }
                    next(err);
                }
                else next();
            });
        };
    }

    pageMiddleware() {
        let directorPage = this.directorPage;
        return function middleware(req: Express.Request, res: Express.Response, next) {

            if (Utils.getCls("hornet.routeType") !== RouteType.PAGE) {
                return next();
            }

            directorPage.dispatch(req, res, function (err) {
                if (err) {
                    if (err.status && err.status == 404) {
                        err = new NotFoundError({ errorMessage: err.message }, err);
                    }
                    next(err);
                }
                else next();
            });
        };
    }

    private computeRoutes(routesObj = this.appRoutes, prefix: string = ""): void {
        this.parseRoutes(routesObj.getPageRoutes(), this.pageRoutes, prefix);
        this.parseRoutes(routesObj.getDataRoutes(), this.dataRoutes, prefix);
        this.parseLazyRoutes(routesObj.getLazyRoutes(), prefix);

        this.computeAuthorizationsRoutes(routesObj.getPageRoutes(), routesObj.getDataRoutes(), prefix);
    }


    private computeAuthorizationsRoutes(pageRoutes, dataRoutes, prefix: string) {
        let objPage = {}, objData = {};
        for (let key in pageRoutes) {
            objPage[ prefix + key ] = pageRoutes[ key ];
        }

        for (let key in dataRoutes) {
            objData[ this.dataContext + prefix + key ] = dataRoutes[ key ];
        }

        (<any>global).routesInfos = _.merge((<any>global).routesInfos, objPage, objData);
    }

    private parseRoutes<T extends RouteInfos>(declaredRoutes: Routes<T>, internalObj: DirectorRoutesDesc, prefix: string) {
        for (var path in declaredRoutes) {
            for (var method in declaredRoutes[ path ]) {
                var uri = prefix + path;
                if (!internalObj[ uri ]) {
                    internalObj[ uri ] = {};
                }
                if (internalObj[ uri ][ method ]) {
                    throw new Error("Route duppliquée : ('" + uri + "' <" + method + ">)");
                }

                internalObj[ uri ][ method ] = this.buildRouteHandler(declaredRoutes, path, method);
            }
        }
    }

    private buildRouteHandler<T extends RouteInfos>(declaredRoutes: Routes<T>, path: string, method: string) {
        return (...params: Array<any>) => {
            var done = params.pop();

            try {

                this.handleRoute(declaredRoutes[ path ][ method ].authorization, declaredRoutes[ path ][ method ].handler, method, params);
                done();
            } catch (err) {
                done(err);
            }
        }
    }

    private parseLazyRoutes(lazyRoutes: LazyRoutes, prefix: string) {
        for (let lazy in lazyRoutes) {
            let lazyClass = this.lazyRoutesClassResolver(lazyRoutes[ lazy ]);
            let routesClass = LazyClassLoader.load(lazyClass);
            this.computeRoutes(new routesClass(), prefix + lazy);
        }
    }

    protected handleRoute<T extends RouteInfos>(authorization: RouteAuthorization, handler: RouteHandler<T>, method, params: Array<string>) {
        Utils.setCls("hornet.routeAuthorization", authorization);
        Utils.setCls("hornet.routeInfos", handler.apply(null, params));
    }
}
