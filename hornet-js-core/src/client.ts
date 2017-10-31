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
Utils.setConfigObj(window.Config);
Utils.appSharedProps.rehydrate(window.AppSharedProps);

import { Logger } from "hornet-js-utils/src/logger";
import { ClientLog } from "src/log/client-log";
Logger.prototype.buildLogger = ClientLog.getLoggerBuilder(Utils.config.getOrDefault("logClient", {}));
const logger: Logger = Utils.getLogger("hornet-js-core.client");
declare var __webpack_public_path__: string;

import { ClientConfiguration } from "src/client-conf";
import { AsyncExecutor } from "src/executor/async-executor";
import { AsyncElement } from "src/executor/async-element";
import { RouterClient } from "src/routes/router-client";
import { COMPONENT_CHANGE_EVENT, ComponentChangeEventDetail } from "src/routes/router-client-async-elements";
import { listenOnceHornetEvent, CHANGE_URL_WITH_DATA_EVENT } from "src/event/hornet-event";
import { HornetEvent, listenHornetEvent } from "src/event/hornet-event";
import { IClientInitializer } from "hornet-js-components/src/component/iclient-initializer";
import { NodeApiError } from "src/services/service-api-results";
import { manageError } from "src/component/error-manager";
import { TechnicalError } from "hornet-js-utils/src/exception/technical-error";
import { BaseError } from "hornet-js-utils/src/exception/base-error";
import * as _ from "lodash";
import * as path from "path";


declare global {
    interface Window {
        Intl: any;
        router: RouterClient;
        Mode: "development" | "production";
        Config: { [ key: string ]: any };
        HornetCLS: { [ key: string ]: any };
        AppSharedProps: { [ key: string ]: any };
        Perf: any;
    }
}

window.addEventListener("unhandledrejection", function (e) {

    // NOTE: e.preventDefault() must be manually called to prevent the default
    // action which is currently to log the stack trace to console.warn
    e.preventDefault();
    // NOTE: parameters are properties of the event detail property
    let reason = (e[ "detail" ] && e[ "detail" ].reason) || e[ "reason" ];
    let promise = e[ "detail" ] && e[ "detail" ].promise;
    // See Promise.onPossiblyUnhandledRejection for parameter documentation
    if (!(reason instanceof BaseError)) {
        let err_tech = new TechnicalError('ERR_TECH_UNKNOWN', { errorMessage: "Erreur inattendue" }, reason);
        let err = NodeApiError.parseError(err_tech, null).toJsError();
        manageError(err, Utils.getCls("hornet.appConfig").errorComponent);
    } else {
        manageError(reason, Utils.getCls("hornet.appConfig").errorComponent);
    }
    //TODO faire un throw reason uniquement en env development
    throw reason;
});

// NOTE: event name is all lower case as per DOM convention
window.addEventListener("rejectionhandled", function (e) {
    // NOTE: e.preventDefault() must be manually called prevent the default
    // action which is currently unset (but might be set to something in the future)
    e.preventDefault();
    // NOTE: parameters are properties of the event detail property
    var promise = e[ "detail" ].promise;
    // See Promise.onUnhandledRejectionHandled for parameter documentation
    logger.error("rejectionHandled error for promise ", promise);
});


export class Client {

    /**
     * Cette fonction initialise complètement le client et le routage applicatif.
     *
     * Elle effectue les opérations suivantes:
     * <ul>
     *      <li> Réhydratation de la configuration applicative</li>
     *      <li> Enregistrement d'une fonction de callback spéciale afin de lancer le premier rendu une fois la première route résolue</li>
     *      <li> Configuration du routeur 'director' afin d'initialiser toutes les routes applicatives</li>
     *      <li> Démarrage du routeur</li>
     * </ul>
     * @param appConfig configuration de l'application
     * @param clientInit gestionnaire d'intialisation spécifique au moteur de rendu du client
     */
    static initAndStart(appConfig: ClientConfiguration, clientInit: IClientInitializer<HornetEvent<ComponentChangeEventDetail>>) {
        //const logger: Logger = Utils.getLogger("hornet-js-core.client");
        logger.trace("Enter initAndStart");

        __webpack_public_path__ = Utils.buildStaticPath("/") + "/";

        clientInit.initErrorComponent(appConfig.errorComponent);

        var executor = new AsyncExecutor();

        // Polyfill internationalisation > valorise l'objet Intl s'il n'existe pas.
        if (!window.Intl) {
            logger.warn("Chargement d'une librairie remplacant Intl qui n'est pas supportée par ce navigateur");
            executor.addElement(new AsyncElement((next) => {
                (<any>require).ensure([ "intl" ], (require) => {

                    window.Intl = require("intl");

                    (require as any).context("intl/locale-data", true, /\*.js$/);

                    let locale = window.HornetCLS.i18n.lang || "fr";
                    require("intl/locale-data/jsonp/" + locale.toLowerCase());
                    next();
                });
            }));
        }

        executor.addElement(new AsyncElement((next) => {

            // ajout de la méthode "onbeforeunload" si déclarée
            if (appConfig.onbeforeunload && typeof appConfig.onbeforeunload == "function") {
                window.onbeforeunload = function () {
                    appConfig.onbeforeunload();
                }
            }

            // ajout de la méthode "onload" si déclarée
            if (appConfig.onload && typeof appConfig.onload == "function") {
                window.onload = function () {
                    appConfig.onload();
                }
            }

            // on réhydrate le ContinuationStorage avec les objets exposés
            for (let i in window.HornetCLS) {
                Utils.setCls(i, window.HornetCLS[ i ]);
            }

            Utils.setCls("hornet.appConfig", appConfig);
            // instanciation du router
            var router = new RouterClient(appConfig.appComponent, appConfig.errorComponent, (appConfig as any).defaultRoutesClass, appConfig.routesLoaderfn);
            window.router = router;

            // cas particulier de l'init : on démarre le moteur de rendu lorsque le router a déterminé le composant à rendre
            //  > l'écoute de l'évènement est supprimée dans le callback
            listenOnceHornetEvent(COMPONENT_CHANGE_EVENT, clientInit.initClientRendering);

            listenHornetEvent(CHANGE_URL_WITH_DATA_EVENT, (ev) => {
                Utils.setCls("hornet.navigateData", ev.detail.data);
                window.router.setRoute(Utils.buildContextPath(ev.detail.url), () => {
                    if (ev.detail.cb) {
                        ev.detail.cb();
                    }
                });
            });

            // démarrage du router
            router.startRouter(appConfig.eventListenerComponent);

            next();
        }));

        executor.on("end", (err) => {

            if (err) {
                logger.error("Erreur client : initAndStart", err);
                throw err;
            }
        });

        executor.execute();
    }
}
