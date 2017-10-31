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
 * hornet-js-utils - Partie commune et utilitaire à tous les composants hornet-js
 *
 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
 * @version v5.1.0
 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
 * @license CECILL-2.1
 */

import * as _ from "lodash";
import * as path from "path";
import { TechnicalError } from "src/exception/technical-error";
import { BusinessError } from "src/exception/business-error";
import { BusinessErrorList } from "src/exception/business-error-list";
import { BaseError } from "src/exception/base-error";

/**
 * Construit un logger avec la catégory demandée
 * @param category
 * @param getLoggerFn La fonction permettant de charger le logger, cette fonction est différente
 *            selon le client ou le serveur, c'est pour cette raison quelle doit être injectée
 */
export class Logger {
    private category: any;
    private log4jsLogger: any;

    constructor(category: any) {
        if (!(this instanceof Logger)) {
            return new Logger(category);
        }
        this.category = category;
    }

    static getLogger(category: any): Logger {
        return new Logger(category);
    }

    /**
     * Récupère le logger. Si côté client alors utilise log4js, si côté serveur alors utilise
     * log4js-node
     */
    buildLogger(category: string): void {
        throw new Error("The log building function should be injected before use log : " +
            "Logger.prototype.buildLogger = (ServerLog|ClientLog).getLoggerBuilder(logConfig)");
    }

    fatal(...args: any[]);
    fatal(message: string) {
        this.logInternal("fatal", arguments);
    }

    error(...args: any[]);
    error(message: string) {
        this.logInternal("error", arguments);
    }

    warn(...args: any[]);
    warn(message: string) {
        this.logInternal("warn", arguments);
    }

    info(...args: any[]);
    info(message: string) {
        this.logInternal("info", arguments);
    }

    debug(...args: any[]);
    debug() {
        this.logInternal("debug", arguments);
    }

    trace(...args: any[]);
    trace(message: string) {
        this.logInternal("trace", arguments);
    }

    /**
     * Récupère le nom de la fonction appelante,
     * [mantis 0055464] en évitant de ramener l'appel du logger, qui ne nous intéresse pas :
     * on remonte la pile d'appels en cherchant le code applicatif à l'origine de la log.
     *
     * Si la "vraie" fonction appelante n'est pas trouvée dans la pile,
     * alors par défaut on utilise le paramètre d'entrée callStackSize
     * qui indique le nombre arbitraire de niveaux à remonter dans la pile
     * pour avoir la fonction appelante
     *
     */
    static getFunctionName(callStackSize: number): string {
        let notTyppedError: any = Error;
        let orig: any = notTyppedError.prepareStackTrace;
        let err: any;
        let functionName: string = "";
        if (typeof notTyppedError.captureStackTrace === "function") {
            // Chrome/Node
            notTyppedError.prepareStackTrace = function(_, stack) {
                return stack;
            };
            err = new notTyppedError();
            notTyppedError.captureStackTrace(err, Logger.getFunctionName);
            functionName = "unknownFunction";
            if (err.stack) {

                // Remonter la stack jusqu'a la fonction appellante du logger

                // D'abord, on cherche le premier appel au logger dans la stack (en partant du haut)
                let lastLoggerStackIndex: number = _.findLastIndex(err.stack, function(o: any) {
                    return o.getTypeName && o.getTypeName() === "Logger";
                });
                // si on a trouvé l'appel au logger dans la stack :
                if (lastLoggerStackIndex > 0 && err.stack.length > lastLoggerStackIndex + 1) {
                    // on remonte d'un cran pour avoir le nom de la fonction appelante
                    let hornetCall: any = err.stack[lastLoggerStackIndex + 1];
                    functionName = hornetCall.getFunctionName();
                    // parfois, le nom de la fonction est vide (cas des fonctions déclarées dynamiquement)
                    if (!functionName) {
                        // dans ce cas on affiche "anonymous" avec le nom du fichier et le numéro de ligne+colonne
                        let filename: string = hornetCall.getFileName() || "no source file";
                        functionName = "anonymous:".concat(_.last(filename.split(path.sep)));
                        // functionName = hornetCall.toString();
                    }
                    functionName = functionName.concat(":").concat(hornetCall.getLineNumber())
                        .concat(":").concat(hornetCall.getColumnNumber());
                } else if (err.stack.length >= callStackSize) {
                    // traitement par défaut : on va chercher dans la pile avec l'index fourni en paramètre (callStackSize)
                    functionName = err.stack[callStackSize - 1].getFunctionName();
                }
            }
            notTyppedError.prepareStackTrace = orig;
        } else {
            // Firefox
            let e = new notTyppedError().stack;
            if (e) {
                let callstack = e.split("\n");
                if (callstack.length > callStackSize) {
                    functionName = callstack[callStackSize];
                }
            }
        }
        return functionName;
    }


    /**
     * Appelle la fonction de journalisation du logger en ajoutant le nom de la fonction appelant et si
     * disponible l'id de traitement
     *
     * @param niveau de log
     * @param [, arg1[, arg2[, ...]]] Une liste d'arguments à logguer
     */
    log(level: string, ...args: any[]) {
        if (!_.isString(level)) {
            args.unshift(level);
            level = "error";
        }
        this.logInternal.call(this, level, args);
    }


    /**
     * Appelle la fonction de log de manière asynchrone
     *
     * @param niveau de log
     * @param logArguments: Un tableau des objets (string, error ou object) à logguer
     */
    // private logInternalAsync(level:string, logArguments:IArguments) {
    //    setTimeout(this.logInternal.bind(this), 0, level, logArguments);
    // }

    /**
     * Appelle la fonction de journalisation du logger en ajoutant le nom de la fonction appelant et si
     * disponible l'id de traitement
     *
     * @param niveau de log
     * @param logArguments: Un tableau des objets (string, error ou object) à logguer
     */
    private logInternal(level: string, logArguments: IArguments) {

        if (!this.log4jsLogger) {
            this.buildLogger(this.category);
        }

        let logFn, stack, stackLogEnabled;

        stackLogEnabled = this.log4jsLogger.isStackErrorLogEnabled && this.log4jsLogger.isStackErrorLogEnabled() === "true";

        switch (level.toLowerCase()) {
            case "trace":
                if (this.log4jsLogger.isTraceEnabled()) {
                    logFn = this.log4jsLogger.trace;
                    stack = stackLogEnabled ? this.searchStack(logArguments) : null;
                }
                break;
            case "debug":
                if (this.log4jsLogger.isDebugEnabled()) {
                    logFn = this.log4jsLogger.debug;
                    stack = stackLogEnabled ? this.searchStack(logArguments) : null;
                }
                break;
            case "info":
                if (this.log4jsLogger.isInfoEnabled()) {
                    logFn = this.log4jsLogger.info;
                    stack = stackLogEnabled ? this.searchStack(logArguments) : null;
                }
                break;
            case "warn":
                if (this.log4jsLogger.isWarnEnabled()) {
                    logFn = this.log4jsLogger.warn;
                    stack = stackLogEnabled ? this.searchStack(logArguments) : null;
                }
                break;
            case "fatal":
                if (this.log4jsLogger.isFatalEnabled()) {
                    logFn = this.log4jsLogger.fatal;
                    stack = this.searchStack(logArguments);
                }
                break;
            default:
                if (this.log4jsLogger.isErrorEnabled()) {
                    logFn = this.log4jsLogger.error;
                    stack = this.searchStack(logArguments);
                }
        }

        if (logFn) {
            if (stack && this.log4jsLogger.setStack) {
                this.log4jsLogger.setStack(stack);
            }

            // On a bien besoin de logguer
            let parameters = Array.prototype.slice.call(logArguments);
            let message = parameters.map(this.mappingObjectToString.bind(this)).join(" ");

            // Et enfin on log réellement
            logFn.call(this.log4jsLogger, message);
        }
    }

    /**
     * Méthode de recherche de stack depuis les arguments passés dans le logger
     * @param args
     * @returns {{}}
     */
    private searchStack(args) {
        let stack = {};
        if (args) {
            Object.keys(args).map(function(key) {
                stack = args[key] && args[key].error && args[key].error.stack || args[key] && args[key].stack || null;
            });
        }
        return stack;
    }

    private mappingObjectToString(arg: any) {
        if (_.isString(arg)) {
            return arg;

        } else if (arg instanceof TechnicalError) {
            let errStr: string = arg.toString();

            let infoSupp;
            try {
                infoSupp = JSON.stringify(arg);
            }
            catch (err) {
                infoSupp = "<stringifyErr>";
            }

            let stacks = arg.stack;
            if (arg.cause()) {
                stacks = stacks + "\nCaused by:\n" + this.mappingObjectToString(arg.cause());
            }
            return errStr + "\nInformations supplémentaires :\n" + infoSupp + "\n" + stacks;

        } else if (arg instanceof BusinessErrorList) {
            let errors = arg.getErrors();
            let errStr: string = "\n";
            for (let i = 0; i < errors.length; i++) {
                errStr += ("Erreur #" + (i + 1) + " [" + errors[i].code + "] :\n" + errors[i].toString());

                let infoSupp;
                try {
                    infoSupp = JSON.stringify(errors[i]);
                }
                catch (err) {
                    infoSupp = "<stringifyErr>";
                }

                let stacks = errors[i].backend ? "" : errors[i].stack;
                if (errors[i].cause()) {
                    stacks = stacks + "\nCaused by:\n" + this.mappingObjectToString(errors[i].cause());
                }
                errStr += "\nInformations supplémentaires :\n" + infoSupp + "\n" + stacks + "\n";
            }

            return errStr;

        } else if (arg instanceof BusinessError) {
            let errStr = arg.toString();

            let infoSupp;
            try {
                infoSupp = JSON.stringify(arg);
            }
            catch (err) {
                infoSupp = "<stringifyErr>";
            }

            let stacks = arg.backend ? "" : arg.stack;
            if (arg.cause()) {
                stacks = stacks + "\nCaused by:\n" + this.mappingObjectToString(arg.cause());
            }
            return errStr + "\nInformations supplémentaires :\n" + infoSupp + "\n" + stacks;

        } else if (arg instanceof BaseError) {
            let errStr = arg.toString();

            let infoSupp;
            try {
                infoSupp = JSON.stringify(arg);
            }
            catch (err) {
                infoSupp = "<stringifyErr>";
            }

            let stacks = arg.stack;
            if (arg.cause()) {
                stacks = stacks + "\nCaused by:\n" + this.mappingObjectToString(arg.cause());
            }
            return errStr + "\nInformations supplémentaires :\n" + infoSupp + "\n" + stacks;

        } else if (_.isError(arg)) {
            let errString;
            try {
                errString = JSON.stringify(arg);
            } catch (err) {
                errString = "<stringifyErr>";
            }
            return (arg.stack || (arg.toString && arg.toString()) || arg) + "\n Informations supplémentaires :\n" + errString;
        } else {
            try {
                // return JSON.stringify(arg);
                return JSON.stringify(arg, function(key, value) {
                    if (_.isFunction(value)) {
                        return "[Function" + (value.name ? ": " + value.name : "") + "]";
                    } else if (value instanceof RegExp) {
                        return "_PxEgEr_" + value;
                    }
                    return value;
                });
            } catch (err) {
                return "<stringifyErr>";
            }
        }
    }
}


