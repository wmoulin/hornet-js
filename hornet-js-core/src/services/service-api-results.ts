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

import { BaseError } from "hornet-js-utils/src/exception/base-error";
import { TechnicalError } from "hornet-js-utils/src/exception/technical-error";
import { BusinessError } from "hornet-js-utils/src/exception/business-error";
import { BusinessErrorList } from "hornet-js-utils/src/exception/business-error-list";
import * as _ from "lodash";

export interface BackendApiResult {
    hasTechnicalError: boolean;
    hasBusinessError: boolean;
    status: number;
    url: string;
    data: any;
    /** Erreurs : objets représentant des BackendApiError */
    errors: Array<any>;
}

export interface NodeApiResult {
    hasTechnicalError: boolean;
    hasBusinessError: boolean;
    status: number;
    url: string;
    data: any;
    errors: Array<BaseError>;
}

export class NodeApiResultBuilder {
    static build(jsonData: any): NodeApiResult {
        return {
            hasTechnicalError: false,
            hasBusinessError: false,
            status: 200,
            url: "???",
            data: jsonData,
            errors: []
        };
    }

    static buildError(error: BaseError): NodeApiResult {
        return {
            hasTechnicalError: error instanceof TechnicalError,
            hasBusinessError: error instanceof BusinessError,
            status: (error.args["httpStatus"] && parseInt(error.args["httpStatus"])) || 200,
            url: "???",
            data: null,
            errors: [error]
        };
    }
}

export class NodeApiError {
    /**
     * Timestamp (en ms depuis Epoch) correspondant à la date de création de l'erreur. L'utilisation d'un timestamp
     * plutôt qu'un objet Date facilite la sérialisation/désérialisation en json.
     */
    date: number;
    /** Code d'erreur, normalement associé à un message internationalisé */
    code: string;
    name: string;
    details: string;
    reportId: string;
    /** Paramètres utilisables dans la construction du message d'erreur correspondant au code */
    args: { [key: string]: string };
    backend: boolean = false;
    httpStatus: number;
    nodeApiErrorList: Array<NodeApiError>;

    constructor(date?: number, code?: string, name?: string, details?: string,
                args?: { [key: string]: string }, reportId?: string, backend?: boolean, httpStatus?: number) {
        this.date = date;
        this.code = code;
        this.name = name;
        this.details = details;
        this.args = args;
        this.reportId = reportId;
        this.backend = backend;
        this.httpStatus = httpStatus;
        this.nodeApiErrorList = [];
    }

    /**
     * Renvoie le résumé des détails éventuels de l'erreur d'origine.
     * @param apiError erreur serveur
     * @returns {string} la première ligne de détail
     */
    static parseDetails(apiError: BaseError): string {
        let details: string;
        if (apiError.err_cause && apiError.err_cause.message) {
            /* apiErrors[i].err_cause.message contient toute la pile d'erreur côté serveur :
             * on récupère uniquement la première ligne car il n'est pas judicieux
             * (notamment pour des raisons de sécurité) d'afficher toute la pile
             * d'erreur serveur dans le log client */
            let lineEndIndex = apiError.err_cause.message.indexOf("\n");
            if (process.env.NODE_ENV !== "production") {
                details = apiError.err_cause.message;
            } else {
                if (lineEndIndex > 0) {
                    details = apiError.err_cause.message.substring(0, lineEndIndex);
                } else {
                    details = apiError.err_cause.message;
                }
            }
        }
        return details;
    }

    static parseError(apiErrors: BaseError[] | BaseError, httpStatus: number): NodeApiError {
        if (!_.isArray(apiErrors) && (apiErrors as BaseError).name == "BusinessErrorList") {
            apiErrors = apiErrors["errors"];
        } else if (_.isArray(apiErrors) && apiErrors.length == 1 && apiErrors[0].name == "BusinessErrorList") {
            apiErrors = apiErrors[0]["errors"];
        }

        if (_.isArray(apiErrors) && apiErrors.length > 1) {
            // cas d'une liste d'erreurs
            let global: NodeApiError = new NodeApiError();
            for (let i: number = 0; i < apiErrors.length; i++) {
                let details: string = NodeApiError.parseDetails(apiErrors[i]);
                global.nodeApiErrorList.push(
                    new NodeApiError(apiErrors[i].date, apiErrors[i].code, apiErrors[i].name,
                        details, apiErrors[i].args, apiErrors[i].reportId, apiErrors[i].backend, httpStatus)
                );
            }
            return global;
        } else {
            // cas d'une erreur simple
            let singleError: BaseError;
            if (_.isArray(apiErrors)) {
                singleError = apiErrors[0];
            } else {
                singleError = apiErrors as BaseError;
            }

            let details: string = NodeApiError.parseDetails(singleError);

            return new NodeApiError(singleError.date, singleError.code, singleError.name,
                details, singleError.args, singleError.reportId, singleError.backend, httpStatus);
        }
    }

    toJsError(): BaseError {
        if (this.nodeApiErrorList.length == 0) {
            let error;
            let args = {};

            // backend args
            for (let i in this.args) {
                args[i] = this.args[i];
            }

            // default args
            if (!args["reportId"] && this.reportId) {
                args["reportId"] = this.reportId;
            }
            if (!args["httpStatus"] && this.httpStatus) {
                args["httpStatus"] = this.httpStatus;
            }

            // Error type
            if (this.name == "BusinessError") {
                error = new BusinessError(this.code, args);
            } else {
                error = new TechnicalError(this.code, args, this.details ? new BaseError("", this.details) : null);
            }
            error.backend = this.backend;

            return error;

        } else {
            let error = new BusinessErrorList();
            let backend = false;
            for (let i = 0; i < this.nodeApiErrorList.length; i++) {
                let apiError = this.nodeApiErrorList[i];
                let suberror;
                let args = {};

                // backend args
                for (let i in apiError.args) {
                    args[i] = apiError.args[i];
                }

                // default args
                if (!args["reportId"] && apiError.reportId) {
                    args["reportId"] = apiError.reportId;
                }
                if (!args["httpStatus"] && apiError.httpStatus) {
                    args["httpStatus"] = apiError.httpStatus;
                }

                // Error type
                if (apiError.name == "BusinessError") {
                    suberror = new BusinessError(apiError.code, args);
                } else {
                    suberror = new TechnicalError(apiError.code, args, apiError.details ? new BaseError("", apiError.details) : null);
                }
                suberror.backend = backend = apiError.backend;
                error.addError(suberror);
            }

            error.backend = backend;

            return error;
        }
    }
}


export class BackendApiError {
    date: number;
    code: string;
    name: string;
    type: string;
    details: string;
    reportId: string;
    args: Array<string>;
    httpStatus: number;
    backendApiErrorList: Array<BackendApiError>;

    constructor(date?: number, code?: string, name?: string, type?: string, details?: string,
                args?: Array<string>, reportId?: string, httpStatus?: number) {
        this.date = date;
        this.code = code;
        this.name = name;
        this.type = type;
        this.details = details;
        this.args = args;
        this.reportId = reportId;
        this.httpStatus = httpStatus;
        this.backendApiErrorList = [];
    }

    /**
     * Crée l'instance de BackendApiError à partir de l'objet JSON représentant la ou les erreurs
     * @param apiErrors erreurs[s] représentant
     * @param httpStatus
     * @returns {BackendApiError}
     */
    static parseError(apiErrors: BackendApiError | Array<BackendApiError>, httpStatus: number): BackendApiError {
        if (_.isArray(apiErrors) && apiErrors.length > 1) {
            // cas d'une liste d'erreurs
            let global: BackendApiError = new BackendApiError();
            for (let i = 0; i < (apiErrors as Array<BackendApiError>).length; i++) {
                global.backendApiErrorList.push(
                    new BackendApiError(apiErrors[i].date, apiErrors[i].code, apiErrors[i].name, apiErrors[i].type,
                        apiErrors[i].details, apiErrors[i].args, apiErrors[i].reportId, httpStatus)
                );
            }
            return global;
        } else {
            // cas d'une erreur simple
            let singleError: BackendApiError;
            if (_.isArray(apiErrors)) {
                singleError = apiErrors[0];
            } else {
                singleError = apiErrors;
            }

            return new BackendApiError(singleError.date, singleError.code, singleError.name, singleError.type,
                singleError.details, singleError.args, singleError.reportId, httpStatus);
        }
    }

    toJsError(): BaseError {
        if (this.backendApiErrorList.length == 0) {
            let error: BaseError;
            let args = {};

            // backend args
            for (let i = 0; i < this.args.length; i++) {
                args["$" + i] = this.args[i];
            }

            // default args
            if (this.reportId) {
                args["reportId"] = this.reportId;
            }
            if (this.httpStatus) {
                args["httpStatus"] = this.httpStatus;
            }
            if (this.name) {
                args["errorMessage"] = this.name;
            } else {
                args["errorMessage"] = "";
            }

            // Error type
            if (this.type == "TechnicalException") {
                error = new TechnicalError(this.code, args, this.details ? new BaseError("", this.details) : null);
                error.backend = true;
            } else if (this.type == "BusinessException") {
                error = new BusinessError(this.code, args);
                error.backend = true;
            }

            return error;

        } else {
            let error = new BusinessErrorList();

            for (let i = 0; i < this.backendApiErrorList.length; i++) {
                let apiError = this.backendApiErrorList[i];
                let suberror;
                let args = {};

                // backend args
                for (let i = 0; i < apiError.args.length; i++) {
                    args["$" + i] = apiError.args[i];
                }

                // default args
                if (apiError.reportId) {
                    args["reportId"] = apiError.reportId;
                }
                if (apiError.httpStatus) {
                    args["httpStatus"] = apiError.httpStatus;
                }
                if (apiError.name) {
                    args["errorMessage"] = apiError.name;
                } else {
                    args["errorMessage"] = "";
                }

                // Error type
                if (apiError.type == "TechnicalException") {
                    suberror = new TechnicalError(apiError.code, args, apiError.details ? new BaseError("", apiError.details) : null);

                } else if (apiError.type == "BusinessException") {
                    suberror = new BusinessError(apiError.code, args);
                }
                suberror.backend = true;
                error.addError(suberror);
            }
            error.backend = true;

            return error;
        }
    }
}

