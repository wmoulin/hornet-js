"use strict";

import Log4jsNode = require("log4js");
import _ = require("lodash");
import ContinuationLocalStorage = require("hornet-js-utils/src/continuation-local-storage");
import Logger = require("hornet-js-utils/src/logger");


class ServerLog {

    static noTid:string = "NO_TID";
    static noUser:string = "NO_USER";
    /**
     * Liste des tokens qui sont mis à disposition par Hornet dans le pattern des appender log4js
     */
    static appenderLayoutTokens =
    {
        "pid": function () {
            return process.pid;
        },
        "tid": function () {
            return (ContinuationLocalStorage.getContinuationStorage()) ? ContinuationLocalStorage.getContinuationStorage().get("tid") || ServerLog.noTid : ServerLog.noTid;
        },
        "user": function () {
            return (ContinuationLocalStorage.getContinuationStorage()) ? ContinuationLocalStorage.getContinuationStorage().get("user") || ServerLog.noUser : ServerLog.noUser;
        },
        "fn": function () {
            return Logger.getFunctionName(10);
        }
    }

    /**
     * Fonction d'ajout de token pour utilisation dans un pattern log4js
     * Si besoin spécifique d'une application, cette fonction permet
     * d'ajouter de nouveaux tokens en plus de ceux fournis par défaut
     * @param tokenWithFunc : objet de la forme {"token":function(){return "valeur"}}
     */
    static addLayoutTokens(tokenWithFunc:any):void {
        _.assign(ServerLog.appenderLayoutTokens, tokenWithFunc);
    }

    /**
     * Retourne une fonction destinée à initialiser les loggers de l'application côté serveur
     * @param logConfig Le configuration log
     * @returns {function(any): undefined}
     */
    static getLoggerBuilder(logConfig) {
        logConfig.appenders.forEach((appender) => {
                appender.layout.tokens = ServerLog.appenderLayoutTokens;
            }
        );

        Log4jsNode.configure(logConfig);

        var consoleLogger = Log4jsNode.getLogger("hornet-js.console");

        console.log = function () {
            consoleLogger.info.apply(consoleLogger, arguments);
        };
        console.info = function () {
            consoleLogger.info.apply(consoleLogger, arguments);
        };
        console.error = function () {
            consoleLogger.error.apply(consoleLogger, arguments);
        };
        console.warn = function () {
            consoleLogger.warn.apply(consoleLogger, arguments);
        };
        console.debug = function () {
            consoleLogger.debug.apply(consoleLogger, arguments);
        };
        console.trace = function () {
            consoleLogger.trace.apply(consoleLogger, arguments);
        };

        return function (category) {
            this.log4jsLogger = Log4jsNode.getLogger(category);
        };


    }
}

export = ServerLog;
