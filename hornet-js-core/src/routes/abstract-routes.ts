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
import { Class, AbstractClass } from "hornet-js-utils/src/typescript-utils";
import { UserInformations } from "hornet-js-utils/src/authentication-utils";
import { IHornetPage } from "hornet-js-components/src/component/ihornet-page";
import * as _ from "lodash";
import Options = ajv.Options;
import { DataValidator } from "src/validation/data-validator";
import { Request } from "express";
import { Response } from "express";
import { IService } from "src/services/service-api";
import { Logger } from "hornet-js-utils/src/logger";
import { TechnicalError } from "hornet-js-utils/src/exception/technical-error";
import { CodesError } from "hornet-js-utils/src/exception/codes-error";
import { MediaTypes, MediaType } from "src/protocol/media-type";

const logger: Logger = Utils.getLogger("hornet-js-core.routes.abstract-routes");

/** DirectorClientConfiguration */
export interface DirectorClientConfiguration {
    html5history?: boolean;
    strict?: boolean;
    convert_hash_in_init?: boolean;
    recurse?: boolean;
    notfound?: Function;
}

/** Routes type */
export const RouteType = {
    PAGE: "PAGE_ROUTE",
    DATA: "DATA_ROUTE"
};

/** Routes Authorizations */
export type RouteAuthorization = Array<string>
export const PUBLIC_ROUTE: RouteAuthorization = [];
export const PRIVATE_ROUTE: RouteAuthorization = ["*"];
export const DEFAULT_AUTHORIZATION: RouteAuthorization = PRIVATE_ROUTE;

/** Routes Method */
export type RouteMethod = "get" | "post" | "delete" | "put" | "patch";
export const DEFAULT_METHOD: RouteMethod = "get";


export type RouteHandler<T extends RouteInfos> = (...params: Array<string>) => T;
export type Routes<T extends RouteInfos> = {[key: string]: {[key: string]: { authorization: RouteAuthorization, handler: RouteHandler<T> }}};

export type PageRouteHandler = RouteHandler<PageRouteInfos>;
export type PageRoutes = Routes<PageRouteInfos>;

export type DataRouteHandler = RouteHandler<DataRouteInfos>;
export type DataRoutes = Routes<DataRouteInfos>;

export type LazyRoutes = {[key: string]: string};
export type LazyRoutesClassResolver = (name: string) => Class<AbstractRoutes>;
export type LazyRoutesAsyncClassResolver = (name: string, callback: (routesClass: Class<AbstractRoutes>) => void) => void;

/** Routes Informations */
export type RouteAttributes = {[key: string]: any};


export abstract class RouteAction<A extends RouteAttributes> {
    /** Requête en cours */
    req: Request;

    /** Réponse en cours */
    res: Response;

    /** Attributs de la route déclenchant l'action */
    attributes: A = {} as A;

    service : IService;

    /** Utilisateur connecté */
    user: UserInformations = Utils.getCls("hornet.user");

    /** Exécute l'action */
    abstract execute(): Promise<any>;

    /**
     * Renvoie l'objet contenant les éléments nécessaires à la validation des données transmises à cette action.
     * Renvoie null par défaut : à surcharger éventuellement dans la classe action implémentée.
     * @returns {null} une instance de ActionValidation ou null
     */
    getDataValidator():DataValidator {
        return null;
    }

    /**
     * Renvoie les données entrantes éventuelles, récupérées par défaut directement dans le corps de la requête.
     * A sucharger si nécessaire.
     * @return {any} un objet contenant les données transmises à cette action
     */
    getPayload():any {
        return this.req.body;
    }

    /**
     * Renvoie le MediaType issu de l'entête de la requête.
     * @return {any} un objet contenant les données transmises à cette action
     */
    getMediaType():MediaType {
        return MediaTypes.fromMime(this.req.get('Accept'));
    }
}

export abstract class RouteActionService<A extends RouteAttributes, B extends IService> extends RouteAction<A>{

    getService(): B {
        return this.service as B;
    }
}

export abstract class RouteInfos {
    private type: string;
    private attributes: RouteAttributes = {};
    private service: Class<IService> | AbstractClass<IService>;

    constructor(type: string, attributes: RouteAttributes = {}, service? : Class<IService> | AbstractClass<IService>) {
        this.type = type;
        _.assign(this.attributes, attributes);
        if (service) {
            this.service = service;
        }
    }

    getRouteType() {
        return this.type;
    }

    getAttributes() {
        return this.attributes;
    }

    getService() {
        return this.service;
    }
}

export class PageRouteInfos extends RouteInfos {
    private viewComponent: Class<IHornetPage<any,any>>;

    constructor(viewComponent: Class<IHornetPage<any,any>>, attributes?: RouteAttributes, service? : Class<IService> | AbstractClass<IService>) {
        super(RouteType.PAGE, attributes, service);
        this.viewComponent = viewComponent;
    }

    getViewComponent(): Class<IHornetPage<any,any>> {
        return this.viewComponent;
    }
}

export class DataRouteInfos extends RouteInfos {
    private action: Class<RouteAction<any>>;


    constructor(action: Class<RouteAction<any>>, attributes?: RouteAttributes, service? : Class<IService>) {
        super(RouteType.DATA, attributes, service);
        this.action = action;

    }

    getAction() {
        return this.action;
    }
}

/** Routes Declaration */
export abstract class AbstractRoutes {
    private pageRoutes: PageRoutes = {};
    private dataRoutes: DataRoutes = {};
    private lazyRoutes: LazyRoutes = {};

    private resolveAuthorizationAndMethod(authorizationOrMethod: RouteMethod | RouteAuthorization, method: RouteMethod) {
        var auth, meth;
        if (_.isString(authorizationOrMethod)) {
            auth = DEFAULT_AUTHORIZATION;
            meth = authorizationOrMethod;
        } else {
            if (_.isUndefined(authorizationOrMethod)) {
                auth = DEFAULT_AUTHORIZATION;
            } else {
                auth = authorizationOrMethod;
            }
            if (_.isString(method)) {
                meth = method;
            } else {
                meth = DEFAULT_METHOD;
            }
        }
        return {authorization: auth, method: meth};
    }

    addPageRoute(path: string, handler: PageRouteHandler, authorization?: RouteAuthorization) {
        var args = this.resolveAuthorizationAndMethod(authorization, DEFAULT_METHOD);

        if (!this.pageRoutes[path]) this.pageRoutes[path] = {};
        this.pageRoutes[path][args.method.toLowerCase()] = {authorization: args.authorization, handler: handler};
    }

    addDataRoute(path: string, handler: DataRouteHandler);
    addDataRoute(path: string, handler: DataRouteHandler, authorization: RouteAuthorization);
    addDataRoute(path: string, handler: DataRouteHandler, method: RouteMethod);
    addDataRoute(path: string, handler: DataRouteHandler, authorization: RouteAuthorization, method: RouteMethod);
    addDataRoute(path: string, handler: DataRouteHandler, authorizationOrMethod?: RouteMethod | RouteAuthorization, method?: RouteMethod) {
        var args = this.resolveAuthorizationAndMethod(authorizationOrMethod, method);

        if (!this.dataRoutes[path]) this.dataRoutes[path] = {};
        this.dataRoutes[path][args.method.toLowerCase()] = {authorization: args.authorization, handler: handler};
    }

    addLazyRoutes(path: string, subRoutesFile: string) {
        this.lazyRoutes[path] = subRoutesFile;
    }

    getPageRoutes(): PageRoutes {
        return this.pageRoutes;
    }

    getDataRoutes(): DataRoutes {
        return this.dataRoutes;
    }

    getLazyRoutes(): LazyRoutes {
        return this.lazyRoutes;
    }

    /**
     * Permet de charger les routes depuis une liste de répertoires
     * @param paths
     * @returns route module
     */
    getDefaultRouteLoader(paths:Array<string>) {
        return (name:string) => {
            logger.trace("defaultRouteLoader(" + name + ")");
            let index = _.findIndex(paths, function(path) {
                try {
                    return require.main.require(path + name);
                } catch(e) {
                    //throw new TechnicalError('ERR_TECH_' + CodesError.ROUTE_ERROR, {errorMessage: e.message});
                }
            });
            if (index == -1) {
                logger.error("Unknow route " + name + " in paths " + paths);
                throw new TechnicalError('ERR_TECH_' + CodesError.ROUTE_ERROR, {errorMessage: CodesError.DEFAULT_ERROR_MSG});
            }
            return require.main.require(paths[index] + name) ;
        }
    }
}