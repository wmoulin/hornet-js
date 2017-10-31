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
import { AsyncElement } from "src/executor/async-element";
import { HornetEvent, fireHornetEvent } from "src/event/hornet-event";
import { RouteAuthorization, PageRouteInfos } from "src/routes/abstract-routes";
import { SecurityError } from "hornet-js-utils/src/exception/security-error";
import { AuthUtils } from "hornet-js-utils/src/authentication-utils";
import { IHornetPage } from "hornet-js-components/src/component/ihornet-page";
import { manageError } from "src/component/error-manager";

// ------------------------------------------------------------------------------------------------------------------- //
//                                      ContextInitializerElement
// ------------------------------------------------------------------------------------------------------------------- //
export class ContextInitializerElement extends AsyncElement {
    private authorization;
    private handler;
    private params;

    constructor(authorization, handler, params) {
        super();
        this.authorization = authorization;
        this.handler = handler;
        this.params = params;
    }

    execute(next) {
        Utils.setCls("hornet.routeAuthorization", this.authorization);
        Utils.setCls("hornet.routeInfos", this.handler.apply(null, this.params));
        next();
    }
}


export var PAGE_READY_EVENT = new HornetEvent<{}>("PAGE_READY_EVENT");
// ------------------------------------------------------------------------------------------------------------------- //
//                                      UrlModifierAction
// ------------------------------------------------------------------------------------------------------------------- //
export interface UrlChangeEventDetail { newUrl: string; newPath: string }
export var URL_CHANGE_EVENT = new HornetEvent<UrlChangeEventDetail>("URL_CHANGE_EVENT");
export class UrlChangeElement extends AsyncElement {

    execute(next) {
        var newUrl = window.location.pathname;
        var newPath = newUrl.replace(Utils.getContextPath(), "");
        // on synchronise le CLS
        Utils.setCls("hornet.routePath", newPath);
        Utils.setCls("hornet.currentUrl", newUrl);
        // on dispatch le changement d'url
        fireHornetEvent(URL_CHANGE_EVENT.withData({ newUrl: newUrl, newPath: newPath }));
        next();
    }
}

// ------------------------------------------------------------------------------------------------------------------- //
//                                      UserAccessSecurityAction
// ------------------------------------------------------------------------------------------------------------------- //
export class UserAccessSecurityElement extends AsyncElement {
    private static logger: Logger = Utils.getLogger("hornet-js-core.routes.router-client.UserAccessSecurityElement");
    
    execute(next) {
        var user = Utils.getCls("hornet.user");
        var routeAuthorization:RouteAuthorization = Utils.getCls("hornet.routeAuthorization");

        if (routeAuthorization && routeAuthorization.length > 0) {
            // cas de la redirection vers la page de login si page authentifiée et pas connecté
            if (!user) {
                UserAccessSecurityElement.logger.debug("Passage d'une page publique vers une page privée sans utilisateur, redirection vers la page de login");

                // TODO: voir s'il n'est pas possible de faire autrement
                // on stock l'url de la route authentifiée avant de faire le "back"
                var oldUrl = window.location.href;
                // on fait un "back" pour remettre en tête l'url de la page depuis laquelle la route authentifiée a été demandée
                // cela permet de pouvoir utiliser le bouton "back" depuis la page de login et de revenir sur l'url de la page publique plutôt que sur la page privée
                history.back();
                // la redirection se fait dans un setTimeout car le "back" est asynchrone
                setTimeout(function() {
                    window.location.href = Utils.buildContextPath(Utils.appSharedProps.get("loginUrl")) + "?previousUrl=" + oldUrl;
                }, 50);

                return;
            } else {
                UserAccessSecurityElement.logger.trace("Route avec restriction d'accès sur les rôles:", routeAuthorization);
                if (!AuthUtils.isAllowed(user, routeAuthorization)) {
                    throw new SecurityError();
                }
            }
        } else {
            UserAccessSecurityElement.logger.trace("Route publique sans restriction d'accès");
        }
        next();

    }
}


// ------------------------------------------------------------------------------------------------------------------- //
//                                      ViewRenderingAction
// ------------------------------------------------------------------------------------------------------------------- //
export interface ComponentChangeEventDetail { newComponent: Class<IHornetPage<any,any>>; data: any; }
export var COMPONENT_CHANGE_EVENT = new HornetEvent<ComponentChangeEventDetail>("COMPONENT_CHANGE_EVENT");
export class ViewRenderingElement extends AsyncElement {
    private static logger: Logger = Utils.getLogger("hornet-js-core.routes.router-client.ViewRenderingElement");

    private appComponent;
    constructor(appComponent) {
        super();
        this.appComponent = appComponent;
    }

    execute(next) {
        var routeInfos:PageRouteInfos = Utils.getCls("hornet.routeInfos");
        let dataToPass = Utils.getCls("hornet.navigateData");
        fireHornetEvent(COMPONENT_CHANGE_EVENT.withData({ newComponent: routeInfos.getViewComponent(), data : dataToPass }));
        next();
    }
}

// ------------------------------------------------------------------------------------------------------------------- //
//                                      UnmanagedViewErrorElement
// ------------------------------------------------------------------------------------------------------------------- //
export class UnmanagedViewErrorElement extends AsyncElement {
    private static logger: Logger = Utils.getLogger("hornet-js-core.routes.router-client.UnmanagedViewErrorElement");

    private errorComponent;
    constructor(errorComponent) {
        super();
        this.errorComponent = errorComponent;
    }

    execute(next, resolvedError) {
        manageError(resolvedError, this.errorComponent);
        next();
    }
}