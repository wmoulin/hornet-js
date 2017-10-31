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
 * hornet-js-test - Ensemble des composants pour les tests hornet-js
 *
 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
 * @version v5.1.0
 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
 * @license CECILL-2.1
 */

import * as Log4jsNode from "log4js";
import * as _ from "lodash";
import * as path from "path";
import * as fs from "fs";

export class TestLogger {

    static noTid: string = "NO_TID";
    static noUser: string = "NO_USER";
    /**
     * Liste des tokens qui sont mis à disposition par Hornet dans le pattern des appender log4js
     */
    static appenderLayoutTokens = {
        "fn": function() {
            return TestLogger.getFunctionName(10);
        }
    };

    /**
     * Fonction d'ajout de token pour utilisation dans un pattern log4js
     * Si besoin spécifique d'une application, cette fonction permet
     * d'ajouter de nouveaux tokens en plus de ceux fournis par défaut
     * @param tokenWithFunc : objet de la forme {"token":function(){return "valeur"}}
     */
    static addLayoutTokens(tokenWithFunc: any): void {
        _.assign(TestLogger.appenderLayoutTokens, tokenWithFunc);
    }

    /**
     * Retourne une fonction destinée à initialiser les loggers de l'application côté serveur
     * @param logConfig Le configuration log
     * @returns {function(any): undefined}
     */
    static getLoggerBuilder(logConfig) {
        logConfig.appenders.forEach((appender) => {
                appender.layout.tokens = TestLogger.appenderLayoutTokens;

                // creation du repertoire de log si non existant
                if (appender.filename && path.dirname(appender.filename)) {
                    if (appender.createDir) {
                        let dirLogs = path.dirname(appender.filename);
                        let dirToCreate = [];
                        while (!fs.existsSync(dirLogs)) {
                            dirToCreate.unshift(dirLogs);
                            dirLogs = path.dirname(dirLogs);
                        }

                        dirToCreate.forEach(dir => {
                            fs.mkdirSync(dir);
                        });
                    } else if (!fs.existsSync(path.dirname(appender.filename))) {
                        throw new Error("You must specify a exsiting directory filename");
                    }
                }
            }
        );

        Log4jsNode.configure(logConfig);

        var consoleLogger = Log4jsNode.getLogger("hornet-js.console");

        console.log = function() {
            consoleLogger.info.apply(consoleLogger, arguments);
        };
        console.info = function() {
            consoleLogger.info.apply(consoleLogger, arguments);
        };
        console.error = function() {
            consoleLogger.error.apply(consoleLogger, arguments);
        };
        console.warn = function() {
            consoleLogger.warn.apply(consoleLogger, arguments);
        };
        console.debug = function() {
            consoleLogger.debug.apply(consoleLogger, arguments);
        };
        console.trace = function() {
            consoleLogger.trace.apply(consoleLogger, arguments);
        };

        return function(category) {
            this.log4jsLogger = Log4jsNode.getLogger(category);
        };
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
        var notTyppedError: any = Error;
        var orig: any = notTyppedError.prepareStackTrace;
        var err: any;
        var functionName: string = "";
        if (typeof notTyppedError.captureStackTrace === "function") {
            // Chrome/Node
            notTyppedError.prepareStackTrace = function(_, stack) {
                return stack;
            };
            err = new notTyppedError();
            notTyppedError.captureStackTrace(err, TestLogger.getFunctionName);
            functionName = "unknownFunction";
            if (err.stack) {

                // Remonter la stack jusqu'a la fonction appellante du logger

                // D'abord, on cherche le premier appel au logger dans la stack (en partant du haut)
                var lastLoggerStackIndex: number = _.findLastIndex(err.stack, function(o: any) {
                    return o.getTypeName && o.getTypeName() === "Logger";
                });
                // si on a trouvé l'appel au logger dans la stack :
                if (lastLoggerStackIndex > 0 && err.stack.length > lastLoggerStackIndex + 1) {
                    // on remonte d'un cran pour avoir le nom de la fonction appelante
                    var hornetCall: any = err.stack[lastLoggerStackIndex + 1];
                    functionName = hornetCall.getFunctionName();
                    // parfois, le nom de la fonction est vide (cas des fonctions déclarées dynamiquement)
                    if (!functionName) {
                        // dans ce cas on affiche "anonymous" avec le nom du fichier et le numéro de ligne+colonne
                        var filename: string = hornetCall.getFileName() || "no source file";
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
            var e = new notTyppedError().stack;
            if (e) {
                var callstack = e.split("\n");
                if (callstack.length > callStackSize) {
                    functionName = callstack[callStackSize];
                }
            }
        }
        return functionName;
    }
}
