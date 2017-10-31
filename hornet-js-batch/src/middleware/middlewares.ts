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
 * hornet-js-batch - Ensemble des composants de gestion de base hornet-js
 *
 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
 * @version v5.1.0
 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
 * @license CECILL-2.1
 */

import {
    HornetContextInitializerMiddleware,
    LoggerTIDMiddleware,
    AbstractHornetMiddleware,
    BodyParserJsonMiddleware,
    BodyParserUrlEncodedMiddleware,
    LoggerUserMiddleware,
    RouterServerMiddleware,
    UserAccessSecurityMiddleware,
    DataRenderingMiddleware
} from "hornet-js-core/src/middleware/middlewares";
import { Class } from "hornet-js-utils/src/typescript-utils";
import { Request } from "express";
import { Response } from "express";
import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-utils/src/logger";
import { TechnicalError } from "hornet-js-utils/src/exception/technical-error";
import { RouteInfos, DataRouteInfos } from "hornet-js-core/src/routes/abstract-routes";
import { HornetResult } from "hornet-js-core/src/result/hornet-result";
import { RouteActionBatch } from "../routes/abstract-batch-routes";
import { BatchExecutor } from "src/core/batch-executor";
import { ResultBatch } from "src/result/result-batch";
import { ResultJSON } from "hornet-js-core/src/result/result-json";
import { AsyncExecutor } from "hornet-js-core/src/executor/async-executor";
import { AsyncElement } from "hornet-js-core/src/executor/async-element";
import { ValidationError } from "hornet-js-utils/src/exception/validation-error";
import * as _ from "lodash";
import { RouteType } from "hornet-js-core/src/routes/abstract-routes";



// ------------------------------------------------------------------------------------------------------------------- //
//                                      BatchMiddleware
// ------------------------------------------------------------------------------------------------------------------- //

export class BatchRenderingMiddleware extends AbstractHornetMiddleware {
    private static logger: Logger = Utils.getLogger("hornet-js-core.middlewares.DataRenderingMiddleware");

    constructor() {
        super((req: Request, res: Response, next: Function) => {
            BatchRenderingMiddleware.logger.trace("===========>", req.originalUrl);
            try {
                let routeInfos: RouteInfos = Utils.getCls("hornet.routeInfos");

                // route de type 'DATA' uniquement
                if (Utils.getCls("hornet.routeType") === RouteType.DATA) {

                    let dataRouteInfos = routeInfos as DataRouteInfos;

                    if (!dataRouteInfos) {
                        let mess = "DataRouteInfos inexistant pour l'url : " + req.originalUrl;
                        BatchRenderingMiddleware.logger.warn(mess);
                        throw new TechnicalError("ERR_TECH_UNKNOWN", { errorMessage: mess, httpStatus: 200 });

                    } else {


                        let executor = new AsyncExecutor();
                        executor.addElement(new AsyncElement((next: (err?: any, data?: any) => void) => {
                            let action = new (dataRouteInfos.getAction())();
                            action.req = req;
                            action.res = res;
                            action.attributes = routeInfos.getAttributes();
                            if (dataRouteInfos.getService()) {
                                action.service = new (dataRouteInfos.getService() as Class<any>)();
                            }

                            let validator = action.getDataValidator();
                            if (validator) {
                                let data = _.cloneDeep(action.getPayload());

                                let validationRes = validator.validate(data);

                                if (!validationRes.valid) {
                                    BatchRenderingMiddleware.logger.warn("Données invalides (la validation aurait dû être effectuée côté client) : ", validationRes.errors);
                                    throw new ValidationError();
                                }
                            }

                            BatchRenderingMiddleware.logger.debug(req.originalUrl + " req");
                            let exec: Promise<any>;
                            let query = BatchExecutor.Instance.isBatchActionExist(req.originalUrl);
                            let isBusy = query[ "isBusy" ];
                            if (action instanceof RouteActionBatch && isBusy) {
                                exec = Promise.resolve(new ResultBatch({ isExist: isBusy }))
                            } else {
                                exec = action.execute();
                            }

                            exec.then((result: any | HornetResult) => {
                                // pas d'erreur si on est ici > on construit un ApiResult

                                BatchRenderingMiddleware.logger.debug(req.originalUrl + " res");
                                if (result instanceof HornetResult) {
                                    let _data = result.options[ "data" ]
                                    if (!_data) {
                                        _data = {}
                                    }
                                    _data[ "history" ] = query[ "history" ];
                                } else {
                                    result[ "history" ] = query[ "history" ];
                                }
                                let newResult: HornetResult = (result instanceof HornetResult) ? result : new ResultJSON({ data: result });
                                return newResult.manageResponse(res);
                            }).then((send) => {
                                if (send) {
                                    res.end();
                                }
                            }).catch((error) => {
                                BatchRenderingMiddleware.logger.error("Erreur de service..." + error);
                                next(error);
                            });
                        }));

                        executor.on("end", (err) => {
                            if (err) {
                                next(err);
                            }
                        });
                        executor.execute();
                    }
                }

            } catch (e) {
                next(e);
            }
        });
    }
}

export const DEFAULT_HORNET_BATCH_MIDDLEWARES: Array<Class<AbstractHornetMiddleware>> = [
    HornetContextInitializerMiddleware,
    LoggerTIDMiddleware,
    BodyParserJsonMiddleware,
    BodyParserUrlEncodedMiddleware,
    LoggerUserMiddleware,
    RouterServerMiddleware,
    UserAccessSecurityMiddleware,
    BatchRenderingMiddleware,

];