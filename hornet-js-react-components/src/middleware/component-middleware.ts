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
 * hornet-js-react-components - Ensemble des composants web React de base de hornet-js
 *
 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
 * @version v5.1.0
 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
 * @license CECILL-2.1
 */

import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-utils/src/logger";
import { AbstractHornetMiddleware } from "hornet-js-core/src/middleware/middlewares";
import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import { RouteInfos, PageRouteInfos, RouteType } from "hornet-js-core/src/routes/abstract-routes";
import { BaseError } from "hornet-js-utils/src/exception/base-error";
import { BusinessError } from "hornet-js-utils/src/exception/business-error";
import { TechnicalError } from "hornet-js-utils/src/exception/technical-error";
import { HornetPage } from "src/widget/component/hornet-page";
import { HornetComponent } from "src/widget/component/hornet-component";
import { Class } from "hornet-js-utils/src/typescript-utils";
import * as _ from "lodash";

// ------------------------------------------------------------------------------------------------------------------- //
//                                      PageRenderingMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
export class PageRenderingMiddleware extends AbstractHornetMiddleware {
    private static logger: Logger = Utils.getLogger("hornet-js-react-components.middleware.PageRenderingMiddleware");

    constructor() {
        super((req, res, next) => {
            try {
                let routeInfos: RouteInfos = Utils.getCls("hornet.routeInfos");

                // route de type 'PAGE' uniquement
                if (Utils.getContinuationStorage().get("hornet.routeType") === RouteType.PAGE) {

                    let pageRouteInfos = routeInfos as PageRouteInfos;

                    //On expose la sérialisation de la conf aux clients
                    let clientConfig = {
                        shared: Utils.config.getOrDefault("shared", ""),
                        themeUrl: HornetComponent.genUrlTheme(),
                        themeHost: Utils.config.getIfExists("themeHost"),
                        themeName: Utils.config.get("themeName"),
                        fullSpa: Utils.config.getOrDefault("fullSpa", {
                            "enabled": false,
                            "host": "",
                            "name": "/services"
                        }),
                        contextPath: Utils.config.getOrDefault("contextPath", ""),
                        cache: Utils.config.getOrDefault("cache", {enabled: false}),
                        logClient: Utils.config.getOrDefault("logClient", {}),
                        welcomePage: Utils.config.getOrDefault("welcomePage", "/")
                    };
                    res.expose(clientConfig, "Config");

                    // On expose au client les informations de l"application courante
                    res.expose(Utils.appSharedProps.dehydrate(), "AppSharedProps");

                    // On expose au client le mode de façon dynamique
                    res.expose(process.env.NODE_ENV, "Mode");

                    // On expose le CLS sans ce qui est spécifique serveur
                    let cls = _.clone(Utils.getContinuationStorage().active);
                    delete cls["hornet.request"];
                    delete cls["hornet.response"];
                    delete cls["hornet.routeInfos"];
                    delete cls["hornet.routeAuthorization"];

                    let sessionData = req.getSession().getData();
                    for (let i in sessionData) {
                        cls[i] = sessionData[i];
                    }

                    res.expose(cls, "HornetCLS");

                    PageRenderingMiddleware.logger.trace("renderToString");
                    let htmlApp: string = ReactDOMServer.renderToString(
                        React.createFactory(AbstractHornetMiddleware.APP_CONFIG.appComponent as Class<HornetPage<any, any, any>>)({
                            content: pageRouteInfos.getViewComponent()
                        }) as any
                    );

                    // On rend la page entière en y intégrant l"appComponent rendu précédemment
                    let html: string = ReactDOMServer.renderToStaticMarkup(
                        React.createFactory(AbstractHornetMiddleware.APP_CONFIG.layoutComponent as Class<HornetPage<any, any, any>>)({
                            content: htmlApp,
                            state: res.locals.state
                        }) as any
                    );
                    res.send("<!DOCTYPE html>" + html);
                    res.end();
                }

            } catch (e) {
                next(e);
            } finally {
                next();
            }
        });
    }
}

// ------------------------------------------------------------------------------------------------------------------- //
//                                      UnmanagedViewErrorMiddleware
// ------------------------------------------------------------------------------------------------------------------- //
export class UnmanagedViewErrorMiddleware extends AbstractHornetMiddleware {
    private static logger: Logger = Utils.getLogger("hornet-js-react-components.middleware.UnmanagedViewErrorMiddleware");

    constructor() {
        super((err, req, res, next: any) => {
            // route de type 'PAGE' uniquement
            if (Utils.getCls("hornet.routeType") === RouteType.PAGE) {
                sanitizeErrorThrownInDomain(err);

                if (!(err instanceof BaseError)) {
                    err = new TechnicalError("ERR_TECH_UNKNOWN", {errorMessage: err.message}, err);
                }

                if (err instanceof TechnicalError) {
                    UnmanagedViewErrorMiddleware.logger.error("ERREUR technique [" + err.code + "] - reportId [" + err.reportId + "] : ", err);
                } else if (err instanceof BusinessError) {
                    UnmanagedViewErrorMiddleware.logger.error("ERREUR métier [" + err.code + "] - : ", err);
                } else {
                    UnmanagedViewErrorMiddleware.logger.error("ERREUR [" + err.code + "] - : ", err);
                }

                Utils.getContinuationStorage().set("hornet.currentError", err);

                let htmlApp: string = ReactDOMServer.renderToString(
                    React.createFactory(AbstractHornetMiddleware.APP_CONFIG.appComponent as Class<HornetPage<any, any, any>>)({
                        content: AbstractHornetMiddleware.APP_CONFIG.errorComponent
                    }) as any
                );

                // On rend la page entière en y intégrant l"appComponent rendu précédemment
                let html: string = ReactDOMServer.renderToStaticMarkup(
                    React.createFactory(AbstractHornetMiddleware.APP_CONFIG.layoutComponent as Class<HornetPage<any, any, any>>)({
                        content: htmlApp,
                        state: res.locals.state,
                        nojavascript: true
                    }) as any
                );

                if (err.status && typeof err.status === "number") {
                    res.status(err.status);
                } else {
                    res.status(500);
                }
                res.send("<!DOCTYPE html>" + html);
                res.end();


            } else {
                next(err);
            }
        })
    }
}

function sanitizeErrorThrownInDomain(error) {
    if (error) {
        delete error["error@context"];
        delete error["domain"];
    }
}
